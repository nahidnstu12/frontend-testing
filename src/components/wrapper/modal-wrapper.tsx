import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ModalWrapperProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: React.ReactNode;
}

export default function ModalWrapper({ isOpen, onOpenChange, title, children }: ModalWrapperProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="md:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                {title}
              </DialogTitle>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
    )
}
