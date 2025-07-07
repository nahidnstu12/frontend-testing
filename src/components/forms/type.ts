import type { DrawerMode } from "@/types/shared";

export interface FormProps {
    data: Record<string, any>;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    mode: DrawerMode;
    options: Record<string, any[]>;
}