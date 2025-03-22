import { z } from 'zod';
import { USER_CONFIG } from 'src/config/constants';
import { UserRole } from 'src/users/entities/user.entity';

export const registerSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().email(),
  password: z
    .string()
    .min(USER_CONFIG.PASSWORD.MIN)
    .max(USER_CONFIG.PASSWORD.MAX),
  role: z.nativeEnum(UserRole),
});

export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(USER_CONFIG.PASSWORD.MIN)
    .max(USER_CONFIG.PASSWORD.MAX),
});

export type LoginDto = z.infer<typeof loginSchema>;
