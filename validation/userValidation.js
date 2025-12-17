import { email, z } from 'zod';
import { requiredFields } from '../utils/zodHelper.js';

const generalFields = {
  email: z
    .string({
      error: (issue) => requiredFields(issue, 'Email'),
    })
    .regex(
      /^\S+@\S+\.\S+$/,
      'Email format is invalid (example: name@example.com)'
    ),
  password: z
    .string({
      error: (issue) => requiredFields(issue, 'Password'),
    })
    .min(8)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(
      /[@$!%*?&]/,
      'Password must contain at least one special character (@ $ ! % * ? &)'
    ),
  confirmPassword: z.string({
    error: (issue) => requiredFields(issue, 'Confirm Password'),
  }),
  name: z
    .string({
      error: (issue) => requiredFields(issue, 'Name'),
    })
    .min(3)
    .max(20),
  photo: z.string({
    error: (issue) => requiredFields(issue, 'Photo'),
  }),
};

export const createUserSchema = z
  .object({
    name: generalFields.name,
    email: generalFields.email,
    password: generalFields.password,
    confirmPassword: generalFields.confirmPassword,
    photo: generalFields.photo.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .strict();

export const loginSchema = z
  .object({
    email: generalFields.email,
    password: generalFields.password,
  })
  .strict();

export const forgetPassSchema = z
  .object({
    email: generalFields.email,
  })
  .strict();

export const resetPassSchema = z
  .object({
    newPassword: generalFields.password,
    confirmPassword: generalFields.confirmPassword,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .strict();

export const updatePassSchema = z
  .object({
    oldPassword: generalFields.password,
    newPassword: generalFields.password,
    confirmPassword: generalFields.confirmPassword,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .strict();

export const updateUserSchema = z.object({
  name: generalFields.name.optional(),
  email: generalFields.email.optional(),
  photo: generalFields.photo.optional(),
}).strict();
