export type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type ConfirmPasswordForm = {
    password: string;
};

export type ForgotPasswordForm = {
    email: string;
};

export type LoginForm = {
    username: string;
    password: string;
    remember?: boolean;
  };

 export type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type VerifyEmailForm = {
    email: string;
};