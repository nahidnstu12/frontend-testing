import z from "zod";

export const registerFormSchema = z.object({
    name: z.string().min(1).max(15),
    email: z.string().email(),
    password: z.string().min(3).max(35),
    password_confirmation: z.string().min(3).max(35),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"], 
  });

export const confirmPasswordFormSchema = z.object({
    password: z.string().min(3).max(35),
});

export const forgotPasswordFormSchema = z.object({
    email: z.string().email(),
});

export const loginFormSchema = z.object({
    username: z.string().min(2).max(15),
    password: z.string().min(3).max(35),
    remember: z.boolean().optional(),
  });

export const resetPasswordFormSchema = z.object({
    token: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(3).max(35),
    password_confirmation: z.string().min(3).max(35),
});

export const verifyEmailFormSchema = z.object({
    email: z.string().email(),
});