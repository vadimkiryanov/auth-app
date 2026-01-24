import { z } from 'zod'

export const registrationSchema = z.object({
  username: z.string().min(3, 'Минимум 3 символа').max(20),
  password: z.string().min(6, 'Минимум 6 символов'),
  name: z.string().min(2, 'Минимум 2 символа').max(50),
})

export const loginSchema = z.object({
  username: z.string().min(3, 'Минимум 3 символа'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

export type RegistrationData = z.infer<typeof registrationSchema>
export type LoginData = z.infer<typeof loginSchema>
