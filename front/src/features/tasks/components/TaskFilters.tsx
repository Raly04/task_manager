import { useState } from 'react'
import { Filter, Search, X } from 'lucide-react'
import type { TaskFilters as ITaskFilters, User, TaskStatus, TaskPriority } from '../../../types'
import { TASK_STATUS, TASK_PRIORITY } from '../constants'

interface TaskFiltersProps {
    filters: ITaskFilters
    users: User[]
    onFilterChange: (filters: Partial<ITaskFilters>) => void
}

export function TaskFilters({ filters, users, onFilterChange }: TaskFiltersProps) {
    const [isOpen, setIsOpen] = useState(false)

    const activeFilterCount = Object.entries(filters).filter(([key, val]) => val !== '' && key !== 'search').length

    return (
        <div className="flex flex-col gap-3 mb-4">
            {/* Search Bar + Toggle */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="z-100 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                    <input
                        className="input input-bordered w-full pl-10 h-10 md:h-12 shadow-sm focus:shadow-md transition-all border-base-300"
                        onChange={(event) => onFilterChange({ search: event.target.value })}
                        placeholder="Rechercher une tâche..."
                        value={filters.search}
                    />
                    {filters.search && (
                        <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle"
                            onClick={() => onFilterChange({ search: '' })}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
                <button
                    className={`btn btn-square h-10 md:h-12 w-10 md:w-12 border-base-300 shadow-sm ${isOpen || activeFilterCount > 0 ? 'btn-primary' : 'bg-base-100'}`}
                    onClick={() => setIsOpen(!isOpen)}
                    title="Filtres"
                >
                    <div className="relative">
                        <Filter size={20} />
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-2 -right-2 badge badge-secondary badge-xs animate-in zoom-in">
                                {activeFilterCount}
                            </span>
                        )}
                    </div>
                </button>
            </div>

            {/* Collapsible Filters */}
            <div className={`grid gap-3 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 md:max-h-[500px] md:opacity-100'}`}>
                <div className="grid gap-3 md:grid-cols-3 bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm">
                    <label className="form-control w-full">
                        <span className="label-text-alt font-bold text-base-content/60 mb-1">Statut</span>
                        <select
                            className="select select-bordered select-sm md:select-md h-10"
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
                    <label className="form-control w-full">
                        <span className="label-text-alt font-bold text-base-content/60 mb-1">Priorité</span>
                        <select
                            className="select select-bordered select-sm md:select-md h-10"
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
                    <label className="form-control w-full">
                        <span className="label-text-alt font-bold text-base-content/60 mb-1">Assignée à</span>
                        <select
                            className="select select-bordered select-sm md:select-md h-10"
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
                    {activeFilterCount > 0 && (
                        <div className="md:hidden pt-2">
                            <button
                                className="btn btn-ghost btn-sm btn-block text-error"
                                onClick={() => onFilterChange({ status: '', priority: '', assigned_to: '' })}
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
