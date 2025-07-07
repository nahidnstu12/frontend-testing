import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

interface FormTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

export function FormTextarea({
  name,
  label,
  placeholder,
  disabled,
  rows,
}: FormTextareaProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              {...field}
              disabled={disabled}
              rows={rows}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
