import FormProvider from "@/components/forms/form-provider";
import { FormRadioGroup } from "@/components/forms/form-radio-group";
import FrontendLayout from "@/layouts/frontend-layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/components/forms/form-input";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/forms/form-select";
import { FormTextarea } from "@/components/forms/form-textarea";
import { FormFileInput } from "@/components/forms/form-file-input";

const registrationFormSchema = z.object({
  instituteCategory: z.enum(["school", "madrasah"], {
    required_error: "Please select an institute category.",
  }),
  studentName: z.string().min(1, "Student name is required"),
  gender: z.enum(["male", "female"], {
    required_error: "Please select a gender.",
  }),
  instituteName: z.string().min(1, "Institute name is required"),
  class: z.string().min(1, "Please select a class"),
  roll: z.string().min(1, "Roll number is required"),
  section: z.string().optional(),
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  studentContact: z
    .string()
    .min(1, "Student contact number is required")
    .regex(/^(\+8801|01)\d{9}$/, "Invalid Bangladeshi phone number"),
  presentAddress: z.string().min(1, "Present address is required"),
  studentPhoto: z
    .any()
    .refine((file) => file, "Student photo is required.")
    .refine(
      (file) => file && file.type.startsWith("image/"),
      "File must be an image"
    )
    .refine(
      (file) => file && file.size <= 5 * 1024 * 1024, // 5MB limit
      "File size must be less than 5MB"
    ),
});

type RegistrationFormData = z.infer<typeof registrationFormSchema>;

export default function ApplicantRegistration() {
  const handleSubmit = (data: RegistrationFormData) => {
    console.log(data);
    toast.success("Registration successful!");
  };

  const classOptions = [
    { value: "6", label: "Class 6" },
    { value: "7", label: "Class 7" },
    { value: "8", label: "Class 8" },
    { value: "9", label: "Class 9" },
    { value: "10", label: "Class 10" },
  ];

  return (
    <FrontendLayout>
      <div className="flex justify-center items-center py-12 px-4">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Online Registration Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormProvider
              onSubmit={handleSubmit}
              resolver={zodResolver(registrationFormSchema)}
            >
              <div className="space-y-6">
                <FormRadioGroup
                  name="instituteCategory"
                  label="Institute Category *"
                  options={[
                    { value: "school", label: "School" },
                    { value: "madrasah", label: "Madrasah" },
                  ]}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    name="studentName"
                    label="Student Name *"
                    placeholder="Student Name"
                  />
                  <FormRadioGroup
                    name="gender"
                    label="Gender *"
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                    ]}
                  />
                </div>

                <FormInput
                  name="instituteName"
                  label="Institute Name *"
                  placeholder="Institute Name"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormSelect
                    name="class"
                    label="Class *"
                    placeholder="Select Class"
                    options={classOptions}
                    className="w-full"
                  />
                  <FormInput
                    name="roll"
                    label="Roll *"
                    placeholder="Roll"
                    type="number"
                  />
                  <FormInput
                    name="section"
                    label="Section"
                    placeholder="Section"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    name="fatherName"
                    label="Father Name *"
                    placeholder="Father Name"
                  />
                  <FormInput
                    name="motherName"
                    label="Mother Name *"
                    placeholder="Mother Name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    name="studentContact"
                    label="Student Contact *"
                    placeholder="Phone Number"
                  />
                  <FormTextarea
                    name="presentAddress"
                    label="Present Address *"
                    placeholder="Present Address"
                  />
                </div>

                <FormFileInput 
                  name="studentPhoto" 
                  label="Student Photo *" 
                  accept="image/*"
                />
              </div>

              <div className="flex justify-center mt-8">
                <Button type="submit" size="lg" className="cursor-pointer">
                  Registration
                </Button>
              </div>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </FrontendLayout>
  );
}
