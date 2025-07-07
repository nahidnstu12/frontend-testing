import { FormInput } from "@/components/forms/form-input";
import FormProvider from "@/components/forms/form-provider";
import { FormSelect } from "@/components/forms/form-select";
import { FormFileInput } from "@/components/forms/form-file-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateSliderMutation, useGetSliderQuery, useUpdateSliderMutation, type CreateSliderRequest, type UpdateSliderRequest } from "@/store/services/slidersApi";

interface SliderFormData {
  title: string;
  body: string;
  publish_date: string;
  archive_date: string;
  cover_image?: File;
  status: string;
  organization_id: number;
}

interface SliderFormProps {
  onCancel: () => void;
  isEditing?: number | null;
}

const sliderFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  publish_date: z.string().min(1, "Publish date is required"),
  archive_date: z.string().min(1, "Archive date is required"),
  cover_image: z.any().optional(),
  status: z.string().min(1, "Status is required"),
  organization_id: z.number().min(1, "Organization is required"),
});

export function AddEditForm({ onCancel, isEditing }: SliderFormProps) {
  const [createSlider] = useCreateSliderMutation();
  const [updateSlider] = useUpdateSliderMutation();
  const { data: sliderData } = useGetSliderQuery(isEditing || 0, {
    skip: !isEditing,
  });

  const defaultValues = {
    title: sliderData?.title || "",
    body: sliderData?.body || "",
    publish_date: sliderData?.publish_date 
      ? new Date(sliderData.publish_date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    archive_date: sliderData?.archive_date 
      ? new Date(sliderData.archive_date).toISOString().split('T')[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    cover_image: undefined,
    status: sliderData?.status || "draft",
    organization_id: sliderData?.organization_id || 1, // Default to organization 1
  };

  const handleSubmit = async (formData: SliderFormData) => {
    try {
      if (isEditing) {
        await updateSlider({ 
          id: isEditing, 
          body: formData as UpdateSliderRequest 
        }).unwrap();
        toast.success("Slider updated successfully");
      } else {
        await createSlider(formData as CreateSliderRequest).unwrap();
        toast.success("Slider created successfully");
      }
      onCancel();
    } catch (error) {
      console.error("Error:", error);
      toast.error(isEditing ? "Failed to update slider" : "Failed to create slider");
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
      resolver={zodResolver(sliderFormSchema)}
      defaultValues={defaultValues}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput name="title" label="Title" placeholder="Enter slider title" />
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
          placeholder="Enter slider content"
          rows={6}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput 
            name="publish_date" 
            label="Publish Date" 
            type="date"
          />
          <FormInput 
            name="archive_date" 
            label="Archive Date" 
            type="date"
          />
          <FormSelect
            name="organization_id"
            label="Organization"
            options={organizationOptions}
            placeholder="Select organization"
          />
        </div>

        <FormFileInput
          name="cover_image"
          label="Cover Image"
          accept="image/*"
          showPreview={true}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Slider" : "Create Slider"}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
