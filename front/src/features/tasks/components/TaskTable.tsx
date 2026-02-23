import { MessageSquare } from 'lucide-react'
import type { Task, PaginationMeta } from '../../../types'
import { formatDate } from '../../../utils/date'
import { STATUS_BADGE, PRIORITY_BADGE } from '../constants'
import { AsyncButton } from '../../../components/AsyncButton'

interface TaskTableProps {
    tasks: Task[]
    meta: PaginationMeta
    isFetching: boolean
    deletingTaskId: number | null
    onEdit: (task: Task) => void
    onDelete: (taskId: number) => void
    onComment: (task: Task) => void
    onPageChange: (page: number) => void
}

export function TaskTable({
    tasks,
    meta,
    isFetching,
    deletingTaskId,
    onEdit,
    onDelete,
    onComment,
    onPageChange,
}: TaskTableProps) {
    return (
        <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block card bg-base-100 shadow-md border border-base-300">
                <div className="card-body gap-0 p-0">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Tâche</th>
                                    <th>Statut</th>
                                    <th>Priorité</th>
                                    <th>Assignée à</th>
                                    <th>Échéance</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isFetching && (
                                    <tr>
                                        <td className="py-8 text-center" colSpan={6}>
                                            <span className="loading loading-dots loading-lg" />
                                        </td>
                                    </tr>
                                )}
                                {!isFetching && tasks.length === 0 && (
                                    <tr>
                                        <td className="py-8 text-center text-base-content/70" colSpan={6}>
                                            Aucune tâche trouvée.
                                        </td>
                                    </tr>
                                )}
                                {!isFetching &&
                                    tasks.map((task) => (
                                        <tr key={task.id} className="hover:bg-base-200/50 transition-colors">
                                            <td>
                                                <p className="font-semibold">{task.title}</p>
                                                <p className="max-w-md text-sm text-base-content/70 truncate">
                                                    {task.description || 'Sans description'}
                                                </p>
                                            </td>
                                            <td>
                                                <span className={STATUS_BADGE[task.status]}>{task.status}</span>
                                            </td>
                                            <td>
                                                <span className={PRIORITY_BADGE[task.priority]}>{task.priority}</span>
                                            </td>
                                            <td>{task.assigned_to?.name ?? 'Non assignée'}</td>
                                            <td>{formatDate(task.due_date)}</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-ghost btn-circle text-primary relative"
                                                        onClick={() => onComment(task)}
                                                        title="Commentaires"
                                                    >
                                                        <MessageSquare size={18} />
                                                        {task.comments_count > 0 && (
                                                            <span className="badge badge-xs badge-primary absolute -top-0 -right-0 animate-in zoom-in">
                                                                {task.comments_count}
                                                            </span>
                                                        )}
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline"
                                                        onClick={() => onEdit(task)}
                                                        type="button"
                                                    >
                                                        Modifier
                                                    </button>
                                                    <AsyncButton
                                                        className="btn btn-sm btn-error btn-outline"
                                                        isLoading={deletingTaskId === task.id}
                                                        loadingText="..."
                                                        onClick={() => onDelete(task.id)}
                                                    >
                                                        Supprimer
                                                    </AsyncButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {isFetching && (
                    <div className="flex justify-center py-8">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                )}
                {!isFetching && tasks.length === 0 && (
                    <div className="card bg-base-100 shadow-sm border border-base-300 p-8 text-center text-base-content/50">
                        Aucune tâche trouvée.
                    </div>
                )}
                {!isFetching && tasks.map((task) => (
                    <div key={task.id} className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-base leading-tight pr-2">{task.title}</h3>
                                <div className="flex gap-1 shrink-0">
                                    <span className={`${PRIORITY_BADGE[task.priority]} badge-xs`}>{task.priority}</span>
                                    <span className={`${STATUS_BADGE[task.status]} badge-xs`}>{task.status}</span>
                                </div>
                            </div>
                            <p className="text-sm text-base-content/60 line-clamp-2">
                                {task.description || 'Pas de description'}
                            </p>
                            <div className="flex justify-between items-center text-xs pt-2 border-t border-base-200">
                                <div className="text-base-content/50 font-medium">Échéance: {formatDate(task.due_date)}</div>
                                <div className="font-semibold text-primary">{task.assigned_to?.name ?? 'Non assignée'}</div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    className="btn btn-sm btn-ghost gap-2 flex-1"
                                    onClick={() => onComment(task)}
                                >
                                    <MessageSquare size={16} />
                                    Commenter ({task.comments_count})
                                </button>
                                <button
                                    className="btn btn-sm btn-outline flex-1"
                                    onClick={() => onEdit(task)}
                                >
                                    Modifier
                                </button>
                                <button
                                    className="btn btn-sm btn-error btn-outline"
                                    onClick={() => onDelete(task.id)}
                                    disabled={deletingTaskId === task.id}
                                >
                                    {deletingTaskId === task.id ? '...' : 'Suppr.'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-base-300 pt-4 text-sm font-medium">
                <span className="text-base-content/60">
                    {meta.total} tâches • Page {meta.current_page}/{meta.last_page}
                </span>
                <div className="join shadow-sm">
                    <button
                        className="btn join-item btn-sm h-10 px-4"
                        disabled={meta.current_page <= 1 || isFetching}
                        onClick={() => onPageChange(meta.current_page - 1)}
                    >
                        Précédent
                    </button>
                    <button
                        className="btn join-item btn-sm h-10 px-4"
                        disabled={meta.current_page >= meta.last_page || isFetching}
                        onClick={() => onPageChange(meta.current_page + 1)}
                    >
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    )
}
