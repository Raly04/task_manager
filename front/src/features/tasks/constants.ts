import type { TaskPriority, TaskStatus } from '../../types'

export const TASK_STATUS: Array<{ value: '' | TaskStatus; label: string }> = [
    { value: '', label: 'Tous les statuts' },
    { value: 'todo', label: 'To do' },
    { value: 'in-progress', label: 'In progress' },
    { value: 'done', label: 'Done' },
]

export const TASK_PRIORITY: Array<{ value: '' | TaskPriority; label: string }> = [
    { value: '', label: 'Toutes les priorités' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
]

export const STATUS_BADGE: Record<TaskStatus, string> = {
    todo: 'badge badge-info h-auto py-0.5',
    'in-progress': 'badge badge-secondary h-auto py-0.5',
    done: 'badge badge-success h-auto py-0.5',
}

export const PRIORITY_BADGE: Record<TaskPriority, string> = {
    low: 'badge badge-ghost h-auto py-0.5',
    medium: 'badge badge-warning text-warning-content h-auto py-0.5',
    high: 'badge badge-error h-auto py-0.5',
}
