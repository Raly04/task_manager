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
    onPageChange: (page: number) => void
}

export function TaskTable({
    tasks,
    meta,
    isFetching,
    deletingTaskId,
    onEdit,
    onDelete,
    onPageChange,
}: TaskTableProps) {
    return (
        <div className="card bg-base-100 shadow-md">
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
                                    <tr key={task.id}>
                                        <td>
                                            <p className="font-semibold">{task.title}</p>
                                            <p className="max-w-md text-sm text-base-content/70">
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
                                                    className="btn btn-sm btn-outline"
                                                    onClick={() => onEdit(task)}
                                                    type="button"
                                                >
                                                    Modifier
                                                </button>
                                                <AsyncButton
                                                    className="btn btn-sm btn-error btn-outline"
                                                    isLoading={deletingTaskId === task.id}
                                                    loadingText="Suppression..."
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

                <div className="flex items-center justify-between border-t border-base-300 p-4 text-sm">
                    <span>
                        {meta.total} tâche(s) - page {meta.current_page}/{meta.last_page}
                    </span>
                    <div className="join">
                        <button
                            className="btn join-item btn-sm"
                            disabled={meta.current_page <= 1 || isFetching}
                            onClick={() => onPageChange(meta.current_page - 1)}
                            type="button"
                        >
                            Précédent
                        </button>
                        <button
                            className="btn join-item btn-sm"
                            disabled={meta.current_page >= meta.last_page || isFetching}
                            onClick={() => onPageChange(meta.current_page + 1)}
                            type="button"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
