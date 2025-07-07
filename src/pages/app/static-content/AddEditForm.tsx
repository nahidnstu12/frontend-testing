import { FormInput } from "@/components/forms/form-input";
import FormProvider from "@/components/forms/form-provider";
import { FormSelect } from "@/components/forms/form-select";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Button } from "@/components/ui/button";

import {
  useCreateStaticContentMutation,
  useGetStaticContentQuery,
  useUpdateStaticContentMutation,
  type CreateStaticContentRequest,
  type UpdateStaticContentRequest,
} from "@/store/services/staticContentsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

interface StaticContentFormData {
  title: string;
  body: string;
  image: string;
  code: string;
  status: string;
  organization_id: number;
}

interface StaticContentFormProps {
  onCancel: () => void;
  isEditing?: number | null;
}

const staticContentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  code: z.string().min(1, "Code is required"),
  status: z.string().min(1, "Status is required"),
  organization_id: z.number().min(1, "Organization is required"),
});

export function AddEditForm({ onCancel, isEditing }: StaticContentFormProps) {
  const [createStaticContent] = useCreateStaticContentMutation();
  const [updateStaticContent] = useUpdateStaticContentMutation();
  const { data: staticContentData } = useGetStaticContentQuery(isEditing || 0, {
    skip: !isEditing,
  });

  const defaultValues = {
    title: staticContentData?.title || "",
    body: staticContentData?.body || "",
    code: staticContentData?.code || "",
    status: staticContentData?.status || "draft",
    organization_id: staticContentData?.organization_id || 1, // Default to organization 1
  };

  const handleSubmit = async (formData: StaticContentFormData) => {
    try {
      if (isEditing) {
        await updateStaticContent({
          id: isEditing,
          body: formData as UpdateStaticContentRequest,
        }).unwrap();
        toast.success("Static Content updated successfully");
      } else {
        await createStaticContent(
          formData as CreateStaticContentRequest
        ).unwrap();
        toast.success("Static Content created successfully");
      }
      onCancel();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        isEditing
          ? "Failed to update static Content"
          : "Failed to create static Content"
      );
    }
  };

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ];

  const organizationOptions = [
    { value: 1, label: "Organization 1" },
    { value: 2, label: "Organization 2" },
  ];

  return (
    <FormProvider
      onSubmit={handleSubmit}
      resolver={zodResolver(staticContentFormSchema)}
      defaultValues={defaultValues}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="title"
            label="Title"
            placeholder="Enter static Content title"
          />
          <FormSelect
            name="status"
            label="Status"
            options={statusOptions}
            placeholder="Select status"
          />
        </div>

        <FormTextarea
          name="body"
          label="Body"
          placeholder="Enter static Content content"
          rows={6}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput name="code" label="Code" type="text" />
          <FormSelect
            name="organization_id"
            label="Organization"
            options={organizationOptions}
            placeholder="Select organization"
          />
        </div>

        

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update StaticContent" : "Create StaticContent"}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
