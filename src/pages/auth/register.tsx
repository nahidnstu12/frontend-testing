import { FormInput } from '@/components/forms/form-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import type { RegisterForm } from '@/types/auth';
import { registerFormSchema } from '@/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormProvider from '@/components/forms/form-provider';

export default function Register() {
  const {
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerFormSchema) });

  console.log('form errors', errors);

  const submit = (data: RegisterForm) => {
    console.log(data);
    // post(route('register'), {
    //     onFinish: () => reset('password', 'password_confirmation'),
    // });
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details below to create your account"
    >
      {/* <Head title="Register" /> */}
      <FormProvider onSubmit={submit}>
        <div className="flex flex-col gap-6">
          <FormInput name="name" label="Name" />
          <FormInput name="email" label="Email" />
          <FormInput name="password" label="Password" />
          <FormInput name="password_confirmation" label="Confirm Password" />
          <Button type="submit" className="mt-2 w-full" tabIndex={5}>
            Create account
          </Button>
        </div>
        <div className="text-muted-foreground text-center text-sm mt-2">
          Already have an account?{' '}
          <TextLink to={'/login'} tabIndex={6} >
            Log in
          </TextLink>
        </div>
      </FormProvider>
      {/* <form className="flex flex-col gap-6" onSubmit={handleSubmit(submit)}>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              required
              autoFocus
              tabIndex={1}
              autoComplete="name"
              {...register('name')}
              placeholder="Full name"
            />
            <InputError message={errors.name?.message} className="mt-2" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              tabIndex={2}
              autoComplete="email"
              {...register('email')}
              placeholder="email@example.com"
            />
            <InputError message={errors.email?.message} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              tabIndex={3}
              autoComplete="new-password"
              {...register('password')}
              placeholder="Password"
            />
            <InputError message={errors.password?.message} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">Confirm password</Label>
            <Input
              id="password_confirmation"
              type="password"
              required
              tabIndex={4}
              autoComplete="new-password"
              {...register('password_confirmation')}
              placeholder="Confirm password"
            />
            <InputError message={errors.password_confirmation?.message} />
          </div>

          <Button type="submit" className="mt-2 w-full" tabIndex={5}>
            Create account
          </Button>
        </div>

        <div className="text-muted-foreground text-center text-sm">
          Already have an account?{' '}
          <TextLink to={'/login'} tabIndex={6}>
            Log in
          </TextLink>
        </div>
      </form> */}
    </AuthLayout>
  );
}
