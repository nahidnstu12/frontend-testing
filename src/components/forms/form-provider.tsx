import { useEffect } from 'react';
import { FormProvider as FormProviderRHF, useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';

type FormProviderProps = {
  children: React.ReactNode;
  onSubmit: (data: any) => void;
  resolver?: Resolver<any>;
  defaultValues?: Record<string, any>;
  itemData?: Record<string, any>;
};

export default function FormProvider({
  children,
  onSubmit,
  resolver,
  defaultValues,
  itemData
}: FormProviderProps) {
  const methods = useForm({
    resolver,
    defaultValues,
  });

  useEffect(() => {
    if (itemData) {
      methods.reset({
        ...itemData,
      });
    }
  }, [itemData, methods]);

  return (
    <FormProviderRHF {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProviderRHF>
  );
}
