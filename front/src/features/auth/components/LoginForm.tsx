import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { AsyncButton } from '../../../components/AsyncButton'
import { loginSchema, type LoginValues } from '../schemas'

interface LoginFormProps {
    onSubmit: (values: LoginValues) => Promise<void>
    isLoading: boolean
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    })

    return (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-base-200 transition-colors text-base-content/50 hover:text-base-content group-focus-within:text-primary"
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

            <AsyncButton
                className="btn btn-primary w-full mt-4 font-bold tracking-wide"
                isLoading={isLoading}
                loadingText="Connexion en cours..."
                type="submit"
            >
                Se connecter
            </AsyncButton>
        </form>
    )
}
