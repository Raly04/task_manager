import { AlertTriangle } from 'lucide-react'

interface ConfirmationModalProps {
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
    isLoading?: boolean
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
}

export function ConfirmationModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    isLoading = false,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    type = 'danger'
}: ConfirmationModalProps) {
    if (!isOpen) return null

    const typeConfig = {
        danger: {
            btnClass: 'btn-error',
            iconClass: 'text-error bg-error/10'
        },
        warning: {
            btnClass: 'btn-warning',
            iconClass: 'text-warning bg-warning/10'
        },
        info: {
            btnClass: 'btn-info',
            iconClass: 'text-info bg-info/10'
        }
    }[type]

    return (
        <div className="modal modal-open bg-black/50 backdrop-blur-sm z-50">
            <div className="modal-box max-w-md p-0 overflow-hidden border border-base-content/5 shadow-2xl">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${typeConfig.iconClass}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-black text-base-content">{title}</h3>
                            <p className="mt-2 text-base-content/70 leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-base-200/50 p-4 px-6 flex justify-end gap-3">
                    <button
                        className="btn btn-ghost"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`btn ${typeConfig.btnClass} px-6`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner loading-xs"></span>
                        ) : null}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
