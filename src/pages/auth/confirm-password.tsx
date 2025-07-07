import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import type { ConfirmPasswordForm } from '@/types/auth';
import { confirmPasswordFormSchema } from '@/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function ConfirmPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmPasswordForm>({
    resolver: zodResolver(confirmPasswordFormSchema),
  });

  const submit = (data: ConfirmPasswordForm) => {
    console.log(data);
    // post(route('password.confirm'), {
    //     onFinish: () => reset('password'),
    // });
  };

  return (
    <AuthLayout
      title="Confirm your password"
      description="This is a secure area of the application. Please confirm your password before continuing."
    >
      {/* <Head title="Confirm password" /> */}

      <form onSubmit={handleSubmit(submit)}>
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              {...register('password')}
              autoFocus
            />

            <InputError message={errors.password?.message} />
          </div>

          <div className="flex items-center">
            <Button className="w-full">
              {/* {processing && <LoaderCircle className="h-4 w-4 animate-spin" />} */}
              Confirm password
            </Button>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
