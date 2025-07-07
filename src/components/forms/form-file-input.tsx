import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FormFileInputProps {
  name: string;
  label: string;
  className?: string;
  accept?: string;
  showPreview?: boolean;
}

export function FormFileInput({ 
  name, 
  label, 
  className, 
  accept = "image/*",
  showPreview = true 
}: FormFileInputProps) {
  const { control } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (file: File | null, onChange: (value: any) => void) => {
    onChange(file);
    
    if (file && showPreview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleRemoveFile = (onChange: (value: any) => void) => {
    onChange(null);
    setPreview(null);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value, ...rest } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <Input
                type="file"
                accept={accept}
                onChange={(e) =>
                  handleFileChange(e.target.files ? e.target.files[0] : null, onChange)
                }
                className={cn(className)}
                {...rest}
              />
              
              {showPreview && preview && (
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-xs max-h-48 rounded-lg border border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    onClick={() => handleRemoveFile(onChange)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 