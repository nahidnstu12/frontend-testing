import { FormInput } from '@/components/forms/form-input';
import FormProvider from '@/components/forms/form-provider';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { setCredentials } from '@/store/features/auth/authSlice';
import { useLoginMutation } from '@/store/services/authApi';
import type { LoginForm } from '@/types/auth';
import { loginFormSchema } from '@/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function Login() {
  const canResetPassword = true;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const submit = async (data: LoginForm) => {
    try {
      const response = await login(data).unwrap();
      Cookies.set('token', response.token, { expires: 7 });
      localStorage.setItem('user', JSON.stringify(response.user));
      dispatch(setCredentials({ user: response.user, token: response.token }));
      navigate('/dashboard');
      toast.success('Login successful');
    } catch (err) {
      console.error('Login failed', err);
      toast.error((err as any).data.error);
    }
  };

  return (

      <AuthLayout
        title="Log in to your account"
        description="Enter your email and password below to log in"
      >
        {/* <Head title="Log in" /> */}

        <FormProvider 
          onSubmit={submit}
          resolver={zodResolver(loginFormSchema)}
          defaultValues={{
            username: '',
            password: ''
          }}
        >
          <div className="flex flex-col gap-6">
            <FormInput name="username" label="Username"/>
            <FormInput name="password" label="Password" type="password"/>
            {canResetPassword && (
              <TextLink
                to={'/forgot-password'}
                className="ml-auto text-sm"
                tabIndex={5}
              >
                Forgot password?
              </TextLink>
            )}
            <Button type="submit" className="mt-2 w-full bg-gray-700" tabIndex={5}>
              Log in
            </Button>
          </div>
        </FormProvider>

       
      </AuthLayout>
  );
}
