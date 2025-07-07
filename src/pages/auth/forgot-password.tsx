import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import type { ForgotPasswordForm } from '@/types/auth';
import { forgotPasswordFormSchema } from '@/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordFormSchema),
  });

  const submit = (data: ForgotPasswordForm) => {
    console.log(data);
    // post(route('password.email'));
  };

  return (
    <AuthLayout
      title="Forgot password"
      description="Enter your email to receive a password reset link"
    >
      {/* <Head title="Forgot password" /> */}

      {/* {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>} */}

      <div className="space-y-6">
        <form onSubmit={handleSubmit(submit)}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="off"
              {...register('email')}
              autoFocus
              placeholder="email@example.com"
            />

            <InputError message={errors.email?.message} />
          </div>

          <div className="my-6 flex items-center justify-start">
            <Button className="w-full">
              {/* {processing && <LoaderCircle className="h-4 w-4 animate-spin" />} */}
              Email password reset link
            </Button>
          </div>
        </form>

        <div className="text-muted-foreground space-x-1 text-center text-sm">
          <span>Or, return to</span>
          <TextLink to={'/login'}>log in</TextLink>
        </div>
      </div>
    </AuthLayout>
  );
}
