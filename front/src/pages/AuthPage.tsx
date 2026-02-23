import { useState } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { AuthLayout } from '../layouts/AuthLayout'
import { LoginForm } from '../features/auth/components/LoginForm'
import { RegisterForm } from '../features/auth/components/RegisterForm'
import type { LoginValues, RegisterValues } from '../features/auth/schemas'

type AuthStatus = {
    type: 'success' | 'error'
    message: string
} | null

export function AuthPage() {
    const { login, register, isLoading: isAuthLoading } = useAuth()
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
    const [status, setStatus] = useState<AuthStatus>(null)

    const onLogin = async (values: LoginValues) => {
        setStatus(null)
        try {
            await login(values)
            setStatus({ type: 'success', message: 'Connexion réussie.' })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Impossible de se connecter.'
            setStatus({ type: 'error', message })
        }
    }

    const onRegister = async (values: RegisterValues) => {
        setStatus(null)
        try {
            await register(values)
            setStatus({ type: 'success', message: 'Compte créé avec succès.' })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Impossible de créer le compte.'
            setStatus({ type: 'error', message })
        }
    }

    const handleModeChange = (mode: 'login' | 'register') => {
        setAuthMode(mode)
        setStatus(null) // Clear status when switching between login and register
    }

    return (
        <AuthLayout>
            <div className="tabs tabs-box mb-6 w-fit">
                <button
                    className={`tab ${authMode === 'login' ? 'tab-active' : ''}`}
                    onClick={() => handleModeChange('login')}
                    type="button"
                >
                    Connexion
                </button>
                <button
                    className={`tab ${authMode === 'register' ? 'tab-active' : ''}`}
                    onClick={() => handleModeChange('register')}
                    type="button"
                >
                    Inscription
                </button>
            </div>

            {status && (
                <div
                    role="alert"
                    className={`alert ${status.type === 'error' ? 'alert-error' : 'alert-success'} mb-6 shadow-sm`}
                >
                    {status.type === 'error' ? (
                        <AlertCircle className="h-6 w-6 shrink-0 stroke-current" />
                    ) : (
                        <CheckCircle2 className="h-6 w-6 shrink-0 stroke-current" />
                    )}
                    <span className="font-medium flex-1 text-sm">{status.message}</span>
                    <button
                        type="button"
                        className="btn btn-ghost btn-xs btn-circle"
                        onClick={() => setStatus(null)}
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            {authMode === 'login' ? (
                <LoginForm onSubmit={onLogin} isLoading={isAuthLoading} />
            ) : (
                <RegisterForm onSubmit={onRegister} isLoading={isAuthLoading} />
            )}
        </AuthLayout>
    )
}
