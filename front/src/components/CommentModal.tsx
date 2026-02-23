import { useState } from 'react'
import { X, Send, Trash2, MessageSquare } from 'lucide-react'
import { useComments } from '../hooks/useComments'
import { useAuth } from '../hooks/useAuth'
import { formatDate } from '../utils/date'
import { toast } from 'sonner'
import type { Task } from '../types'

interface CommentModalProps {
    task: Task | null
    isOpen: boolean
    onClose: () => void
}

export function CommentModal({ task, isOpen, onClose }: CommentModalProps) {
    const { user } = useAuth()
    const {
        comments,
        isFetching,
        isSaving,
        deletingId,
        addComment,
        deleteComment
    } = useComments(task?.id || null)

    const [newComment, setNewComment] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || isSaving) return

        try {
            await addComment({ body: newComment })
            setNewComment('')
            toast.success('Commentaire ajouté')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erreur lors de l’ajout')
        }
    }

    const handleDelete = async (commentId: number) => {
        try {
            await deleteComment(commentId)
            toast.success('Commentaire supprimé')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression')
        }
    }

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl p-0 overflow-hidden flex flex-col h-[600px]">
                {/* Header */}
                <div className="p-4 border-b border-base-300 flex items-center justify-between bg-base-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">Commentaires</h3>
                            <p className="text-xs text-base-content/60">{task?.title}</p>
                        </div>
                    </div>
                    <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200/30">
                    {isFetching ? (
                        <div className="flex justify-center py-10">
                            <span className="loading loading-spinner text-primary"></span>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-base-content/50">Aucun commentaire pour le moment.</p>
                            <p className="text-xs text-base-content/30 mt-1">Soyez le premier à réagir !</p>
                        </div>
                    ) : (
                        comments.map((comment) => {
                            const isAdmin = user?.role === 'admin'
                            const isOwner = user?.id === comment.user?.id
                            const canDelete = isAdmin || isOwner

                            return (
                                <div key={comment.id} className={`flex gap-3 group animate-in fade-in slide-in-from-bottom-2`}>
                                    <div className="avatar placeholder h-fit">
                                        <div className="bg-primary/10 text-primary rounded-full w-8">
                                            <span className="text-xs font-bold">{comment.user?.name.charAt(0)}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-base-100 p-3 rounded-2xl rounded-tl-none border border-base-300 shadow-sm">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-bold text-sm">{comment.user?.name}</span>
                                                <span className="text-[10px] text-base-content/50">{formatDate(comment.created_at)}</span>
                                            </div>
                                            <p className="text-sm text-base-content/80 whitespace-pre-wrap">{comment.body}</p>
                                        </div>
                                        {canDelete && (
                                            <button
                                                className="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 transition-opacity mt-1 gap-1"
                                                onClick={() => handleDelete(comment.id)}
                                                disabled={deletingId === comment.id}
                                            >
                                                {deletingId === comment.id ? (
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                ) : (
                                                    <Trash2 size={12} />
                                                )}
                                                Supprimer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                    <form onSubmit={handleSubmit} className="relative">
                        <textarea
                            className="textarea textarea-bordered w-full pr-12 min-h-[80px] focus:textarea-primary transition-all resize-none"
                            placeholder="Écrivez un commentaire..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary btn-sm btn-circle absolute right-3 bottom-3"
                            disabled={!newComment.trim() || isSaving}
                        >
                            {isSaving ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                <Send size={16} />
                            )}
                        </button>
                    </form>
                    <p className="text-[10px] text-base-content/40 mt-2 text-center">
                        Appuyez sur Entrée pour envoyer
                    </p>
                </div>
            </div>
            <div className="modal-backdrop bg-black/40" onClick={onClose}></div>
        </div>
    )
}
