import type { TaskFilters as ITaskFilters, User, TaskStatus, TaskPriority } from '../../../types'
import { TASK_STATUS, TASK_PRIORITY } from '../constants'

interface TaskFiltersProps {
    filters: ITaskFilters
    users: User[]
    onFilterChange: (filters: Partial<ITaskFilters>) => void
}

export function TaskFilters({ filters, users, onFilterChange }: TaskFiltersProps) {
    return (
        <div className="card bg-base-100 shadow-md">
            <div className="card-body">
                <div className="grid gap-3 md:grid-cols-4">
                    <label className="form-control">
                        <span className="label-text mb-1">Recherche</span>
                        <input
                            className="input input-bordered"
                            onChange={(event) => onFilterChange({ search: event.target.value })}
                            placeholder="Titre..."
                            value={filters.search}
                        />
                    </label>
                    <label className="form-control">
                        <span className="label-text mb-1">Statut</span>
                        <select
                            className="select select-bordered"
                            onChange={(event) =>
                                onFilterChange({ status: event.target.value as '' | TaskStatus })
                            }
                            value={filters.status}
                        >
                            {TASK_STATUS.map((status) => (
                                <option key={status.label} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="form-control">
                        <span className="label-text mb-1">Priorité</span>
                        <select
                            className="select select-bordered"
                            onChange={(event) =>
                                onFilterChange({ priority: event.target.value as '' | TaskPriority })
                            }
                            value={filters.priority}
                        >
                            {TASK_PRIORITY.map((priority) => (
                                <option key={priority.label} value={priority.value}>
                                    {priority.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="form-control">
                        <span className="label-text mb-1">Assignée à</span>
                        <select
                            className="select select-bordered"
                            onChange={(event) =>
                                onFilterChange({
                                    assigned_to: event.target.value ? Number(event.target.value) : '',
                                })
                            }
                            value={filters.assigned_to ? String(filters.assigned_to) : ''}
                        >
                            <option value="">Tous les utilisateurs</option>
                            {users.map((option) => (
                                <option key={option.id} value={String(option.id)}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
        </div>
    )
}
