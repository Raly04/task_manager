import type { ReactNode } from 'react'
import { AsyncButton } from '../components/AsyncButton'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

interface MainLayoutProps {
    children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    const { user, logout, isLoading: isAuthLoading } = useAuth()

    const onLogout = async () => {
        await logout()
        toast.success('Déconnecté.')
    }

    return (
        <main className="min-h-screen bg-base-200 p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-4">
                <header className="card bg-base-100 shadow-md">
                    <div className="card-body flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm text-base-content/70">Connecté en tant que</p>
                            <h1 className="text-2xl font-bold">
                                {user?.name}{' '}
                                <span className="text-sm font-normal text-base-content/70">
                                    ({user?.email})
                                </span>
                            </h1>
                        </div>
                        <div className="flex gap-2">
                            <AsyncButton
                                className="btn btn-outline"
                                isLoading={isAuthLoading}
                                loadingText="Déconnexion..."
                                onClick={onLogout}
                            >
                                Déconnexion
                            </AsyncButton>
                        </div>
                    </div>
                </header>
                {children}
            </div>
        </main>
    )
}
