import type { ReactNode } from 'react'
import { LogOut, CheckSquare } from 'lucide-react'
import { AsyncButton } from '../components/AsyncButton'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'

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
        <main className="min-h-screen bg-base-200/50 p-4 md:p-6 font-sans">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body py-4 md:py-6 flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                                <CheckSquare size={24} className="text-primary-content" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black italic uppercase tracking-tighter">Task Manager</h1>
                                <p className="text-[10px] text-base-content/40 font-bold uppercase tracking-widest">Collaborative Workspace</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-base-200">
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold leading-none">{user?.name}</p>
                                    <p className="text-[11px] text-base-content/50 truncate max-w-[150px]">{user?.email}</p>
                                </div>
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content w-10 rounded-full ring ring-offset-base-100 ring-offset-2 ring-primary/20">
                                        <span className="text-sm font-bold">{user?.name.charAt(0)}</span>
                                    </div>
                                </div>
                            </div>

                            <AsyncButton
                                className="btn btn-ghost btn-sm btn-circle text-error"
                                isLoading={isAuthLoading}
                                loadingText="..."
                                onClick={onLogout}
                                title="Déconnexion"
                            >
                                <LogOut size={20} />
                            </AsyncButton>
                        </div>
                    </div>
                </header>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </div>
        </main>
    )
}
