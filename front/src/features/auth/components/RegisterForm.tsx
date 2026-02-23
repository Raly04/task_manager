import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { AsyncButton } from '../../../components/AsyncButton'
import { registerSchema, type RegisterValues } from '../schemas'

interface RegisterFormProps {
    onSubmit: (values: RegisterValues) => Promise<void>
    isLoading: boolean
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        },
    })

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                        <User size={16} className="text-secondary" />
                        Nom complet
                    </span>
                </label>
                <input
                    className={`input input-bordered w-full focus:input-primary transition-all ${errors.name ? 'input-error' : ''
                        }`}
                    placeholder="John Doe"
                    {...register('name')}
                />
                {errors.name && (
                    <span className="mt-2 text-xs text-error font-medium flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-error" />
                        {errors.name.message}
                    </span>
                )}
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                        <Mail size={16} className="text-secondary" />
                        Email
                    </span>
                </label>
                <input
                    className={`input input-bordered w-full focus:input-primary transition-all ${errors.email ? 'input-error' : ''
                        }`}
                    placeholder="votre@email.com"
                    type="email"
                    {...register('email')}
                />
                {errors.email && (
                    <span className="mt-2 text-xs text-error font-medium flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-error" />
                        {errors.email.message}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2">
                            <Lock size={16} className="text-secondary" />
                            Mot de passe
                        </span>
                    </label>
                    <div className="relative group">
                        <input
                            className={`input input-bordered w-full pr-12 focus:input-primary transition-all ${errors.password ? 'input-error' : ''
                                }`}
                            placeholder="••••••••"
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-base-200 transition-colors text-base-content/50 hover:text-base-content"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && (
                        <span className="mt-2 text-xs text-error font-medium flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-error" />
                            {errors.password.message}
                        </span>
                    )}
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2">
                            <Lock size={16} className="text-secondary" />
                            Confirmation
                        </span>
                    </label>
                    <div className="relative group">
                        <input
                            className={`input input-bordered w-full pr-12 focus:input-primary transition-all ${errors.password_confirmation ? 'input-error' : ''
                                }`}
                            placeholder="••••••••"
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...register('password_confirmation')}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-base-200 transition-colors text-base-content/50 hover:text-base-content"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <span className="mt-2 text-xs text-error font-medium flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-error" />
                            {errors.password_confirmation.message}
                        </span>
                    )}
                </div>
            </div>

            <AsyncButton
                className="btn btn-primary w-full mt-6 font-bold tracking-wide"
                isLoading={isLoading}
                loadingText="Création du compte..."
                type="submit"
            >
                Créer un compte
            </AsyncButton>
        </form>
    )
}
