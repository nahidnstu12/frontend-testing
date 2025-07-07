
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import type { VerifyEmailForm } from '@/types/auth';
import { verifyEmailFormSchema } from '@/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function VerifyEmail({ status }: { status?: string }) {
  const { handleSubmit } = useForm<VerifyEmailForm>({
    resolver: zodResolver(verifyEmailFormSchema),
  });

  const submit = (data: VerifyEmailForm) => {
    console.log(data);
    // post(route('verification.send'));
  };

  return (
    <AuthLayout
      title="Verify email"
      description="Please verify your email address by clicking on the link we just emailed to you."
    >
      {/* <Head title="Email verification" /> */}

      {status === 'verification-link-sent' && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          A new verification link has been sent to the email address you
          provided during registration.
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} className="space-y-6 text-center">
        <Button variant="secondary">
          {/* {processing && <LoaderCircle className="h-4 w-4 animate-spin" />} */}
          Resend verification email
        </Button>

        <TextLink to={'/logout'} className="mx-auto block text-sm">
          Log out
        </TextLink>
      </form>
    </AuthLayout>
  );
}
