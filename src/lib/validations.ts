import { z } from 'zod';

export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'error_invalid_email' })
    .max(255, { message: 'Email must be less than 255 characters' }),
  password: z
    .string()
    .min(6, { message: 'error_password_short' })
    .max(128, { message: 'Password must be less than 128 characters' }),
});

export type AuthFormData = z.infer<typeof authSchema>;
