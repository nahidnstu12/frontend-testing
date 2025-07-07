import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface DrawerProps {
    drawerSettings: {
        isOpen: boolean;
        onClose: () => void;
        mode: 'create' | 'read' | 'edit' | 'delete';
        itemId: string | undefined;
    };
    formSettings: {
        initialData: Record<string, any>;
        postRoute: string;
        updateRoute: string;
        showRoute: string;
        transformResponse?: (data: any) => Record<string, any>;
    };
    children: React.ReactNode | ((props: any) => React.ReactNode);
    featureTitle: string;
}

export function DrawerContainer({ drawerSettings, formSettings, children, featureTitle }: DrawerProps) {
    const { isOpen, onClose, mode, itemId } = drawerSettings;
    const { initialData, postRoute, updateRoute, showRoute, transformResponse } = formSettings;
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        defaultValues: initialData,
    });

    useEffect(() => {
        if (isOpen && itemId && (mode === 'read' || mode === 'edit')) {
            axios
                .get(showRoute, itemId)
                .then((response) => {
                    // Use transformResponse if provided, otherwise use the response data directly
                    const transformedData = transformResponse 
                        ? transformResponse(response.data)
                        : response.data;
                    setData(transformedData);
                })
                .catch((error) => {
                    console.error(`Error fetching ${featureTitle}:`, error);
                });
        }
    }, [isOpen, itemId, mode, showRoute, transformResponse]);

    const handleSubmit = () => {
        if (mode === 'create') {
            post(postRoute, {
                onSuccess: () => {
                    reset();
                }
            });
        } else if (mode === 'edit') {
            patch(updateRoute, itemId, {
                onSuccess: () => {
                    // Keep the form data after successful update
                }
            });
        }
    };

    const getTitle = () => {
        switch (mode) {
            case 'create':
                return `Add New ${featureTitle}`;
            case 'read':
                return `${featureTitle} Details`;
            case 'edit':
                return `Edit ${featureTitle}`;
            default:
                return featureTitle;
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose} direction="right">
            <DrawerContent className="flex h-full flex-col">
                <div className="mx-auto flex h-full w-full max-w-sm flex-col">
                    <DrawerHeader>
                        <DrawerClose
                            asChild
                            className="ml-auto"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                        >
                            <X className="h-4 w-4 cursor-pointer" />
                        </DrawerClose>
                        <DrawerTitle>{getTitle()}</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex-1 overflow-y-auto p-4">
                        <form onSubmit={handleSubmit} className="w-full space-y-4">
                            {typeof children === 'function' 
                                ? children({ data, setData, errors, mode }) 
                                : children}
                        </form>
                    </div>
                    {mode !== 'read' && (
                        <DrawerFooter className="border-t">
                            <div className="flex gap-2">
                                <Button onClick={handleSubmit} disabled={processing} className="w-1/2">
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <DrawerClose asChild>
                                    <Button variant="outline" className="w-1/2" onClick={() => reset()}>
                                        Cancel
                                    </Button>
                                </DrawerClose>
                            </div>
                        </DrawerFooter>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
