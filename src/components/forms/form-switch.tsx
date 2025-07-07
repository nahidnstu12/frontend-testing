import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

type FormSwitchProps = {
    label: string;
    name: string;
    value: boolean;
    onChange: (value: boolean) => void;
    errors: Record<string, string>;
    disabled?: boolean;
};

export function FormSwitch({ label, name, value, onChange, errors, disabled }: FormSwitchProps) {
    const error = errors[name];
    return (
        <div>
            <Label>{label}</Label>
            <div className="flex items-center space-x-2">
                <Switch checked={value} onCheckedChange={(val) => onChange(val as boolean)} disabled={disabled} />
                <span>{value ? 'Active' : 'Inactive'}</span>
            </div>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
