import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email('Email invalide.'),
    password: z.string().min(1, 'Mot de passe requis.'),
})

export const registerSchema = z
    .object({
        name: z.string().trim().min(2, 'Nom trop court.'),
        email: z.string().email('Email invalide.'),
        password: z.string().min(8, 'Minimum 8 caractères.'),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Les mots de passe ne correspondent pas.',
        path: ['password_confirmation'],
    })

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
