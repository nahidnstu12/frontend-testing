import { FormInput } from '@/components/forms/form-input';
import FormProvider from '@/components/forms/form-provider';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import api from '@/store/api';
import { useAuth } from '@/store/authContext';
import type { LoginForm } from '@/types/auth';
import { loginFormSchema } from '@/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function Login() {
  const canResetPassword = true;
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (data: LoginForm) => {
    try {
      const response = await api.post('/login', data);
      if (!response.data) throw await response.data;
      const { token } = await response.data;
      // Decode user from token (or fetch user info if needed)
      const base64Payload = token.split('.')[1];
      const user = JSON.parse(atob(base64Payload));
      Cookies.set('token', token, { expires: 7 });
      localStorage.setItem('user', JSON.stringify(user));
      login(user, token);
      navigate('/dashboard');
      toast.success('Login successful');
    } catch (err: any) {
      console.error('Login failed', err);
      toast.error(err?.error || 'Login failed');
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
