import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import type { ResetPasswordForm } from '@/types/auth';
import { resetPasswordFormSchema } from '@/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// interface ResetPasswordProps {
//     token: string;
//     email: string;
// }

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const submit = (data: ResetPasswordForm) => {
    console.log(data);
    // post(route('password.store'), {
    //     onFinish: () => reset('password', 'password_confirmation'),
    // });
  };

  return (
    <AuthLayout
      title="Reset password"
      description="Please enter your new password below"
    >
      {/* <Head title="Reset password" /> */}

      <form onSubmit={handleSubmit(submit)}>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="mt-1 block w-full"
              readOnly
            />
            <InputError message={errors.email?.message} className="mt-2" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
              className="mt-1 block w-full"
              autoFocus
              placeholder="Password"
            />
            <InputError message={errors.password?.message} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">Confirm password</Label>
            <Input
              id="password_confirmation"
              type="password"
              autoComplete="new-password"
              {...register('password_confirmation')}
              className="mt-1 block w-full"
              placeholder="Confirm password"
            />
            <InputError
              message={errors.password_confirmation?.message}
              className="mt-2"
            />
          </div>

          <Button type="submit" className="mt-4 w-full">
            {/* {processing && <LoaderCircle className="h-4 w-4 animate-spin" />} */}
            Reset password
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
