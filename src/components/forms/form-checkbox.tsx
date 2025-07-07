import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '../input-error';
import { Label } from '../ui/label';

interface FormCheckboxProps {
  name: string;
  label?: string;
  [x: string]: any;
}

export function FormCheckbox({ name, label, ...rest }: FormCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={name}
            checked={!!field.value}
            onCheckedChange={field.onChange}
            {...rest}
          />
          {label && <Label htmlFor={name}>{label}</Label>}
          {fieldState.error && (
            <InputError message={fieldState.error.message} />
          )}
        </div>
      )}
    />
  );
}