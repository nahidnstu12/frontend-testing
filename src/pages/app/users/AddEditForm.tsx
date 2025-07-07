import { FormInput } from "@/components/forms/form-input";
import FormProvider from "@/components/forms/form-provider";
import { FormSelect } from "@/components/forms/form-select";
import { Button } from "@/components/ui/button";
import {
  useCreateUserByAdminMutation,
  useGetUserQuery,
  useUpdateUserByAdminMutation,
} from "@/store/services/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface UserFormProps {
  initialData?: UserFormData;
  onCancel: () => void;
  isEditing?: string | null;
}

const userFormSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().min(1),
});

export function AddEditForm({ onCancel, isEditing }: UserFormProps) {
  const [createUser] = useCreateUserByAdminMutation();
  const [updateUser] = useUpdateUserByAdminMutation();
  const { data: user } = useGetUserQuery(isEditing || "");
  console.log(user);


  const itemData = {
    username: user?.user?.username || "",
    email: user?.user?.email || "",
    role: user?.user?.role || "",
    password: "Password1!",
  };

  const handleSubmit = async (formData: UserFormData) => {
    console.log(formData);
    try {
      formData.password = "Password1!";
      if (isEditing) {
        await updateUser({ name: isEditing, data: formData }).unwrap();
      } else {
        await createUser(formData).unwrap();
      }
      onCancel();
      toast.success("User created successfully");
    } catch (error) {
      toast.error("Operation failed");
    }
  };


  const roleOptions = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <FormProvider
      onSubmit={handleSubmit}
      resolver={zodResolver(userFormSchema)}
      defaultValues={itemData}
      itemData={itemData}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormInput name="username" label="Username" />
        <FormInput name="email" label="Email" />
        <FormSelect
          name="role"
          label="Role"
          options={roleOptions}
          placeholder="Select a role"
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
      </div>
    </FormProvider>
  );
}
