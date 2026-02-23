import type { ReactNode } from 'react'

interface AuthLayoutProps {
    children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <main className="min-h-screen bg-base-200 p-4 md:p-8 flex items-center justify-center transition-colors duration-300">
            <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
                <section className="hidden lg:flex flex-col gap-6 p-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black leading-tight text-primary">
                            Collaborez sur vos tâches en temps réel.
                        </h1>
                        <p className="text-xl text-base-content/80 leading-relaxed max-w-md">
                            Gérez vos projets avec une efficacité redoutable. Suivi des statuts, priorités et échéances dans une interface ultra-rapide.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="card bg-base-100 border border-base-content/10 p-4">
                            <span className="text-3xl font-bold text-primary">2.4ms</span>
                            <span className="text-sm opacity-70">Temps de réponse</span>
                        </div>
                        <div className="card bg-base-100 border border-base-content/10 p-4">
                            <span className="text-3xl font-bold text-secondary">SSL</span>
                            <span className="text-sm opacity-70">Sécurisé & Chiffré</span>
                        </div>
                    </div>
                </section>

                <section className="card bg-base-100 border border-base-content/5 overflow-hidden">
                    <div className="card-body p-8 md:p-12">
                        {children}
                    </div>
                </section>
            </div>
        </main>
    )
}
