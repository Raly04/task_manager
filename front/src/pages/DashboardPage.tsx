import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { MainLayout } from '../layouts/MainLayout'
import { TaskTable } from '../features/tasks/components/TaskTable'
import { TaskFilters } from '../features/tasks/components/TaskFilters'
import { TaskDrawer } from '../components/TaskDrawer'
import { useTasks } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import { useDebounce } from '../hooks/useDebounce'
import type { Task, TaskFilters as ITaskFilters, TaskPayload, User } from '../types'

export function DashboardPage() {
    const { user, isAuthenticated } = useAuth()
    const [filters, setFilters] = useState<ITaskFilters>({
        status: '',
        priority: '',
        assigned_to: '',
        search: '',
    })
    const [page, setPage] = useState(1)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const debouncedSearch = useDebounce(filters.search, 450)

    const effectiveFilters = useMemo<ITaskFilters>(() => {
        return {
            ...filters,
            search: debouncedSearch,
        }
    }, [debouncedSearch, filters])

    const {
        tasks,
        meta,
        isFetching,
        fetchError,
        isSaving,
        deletingTaskId,
        createTask,
        updateTask,
        deleteTask,
    } = useTasks({
        filters: effectiveFilters,
        page,
        isEnabled: isAuthenticated,
    })

    useEffect(() => {
        if (fetchError) {
            toast.error(fetchError, { id: 'tasks-fetch-error' })
        }
    }, [fetchError])

    const assignableUsers = useMemo(() => {
        const usersById = new Map<number, User>()
        if (user) usersById.set(user.id, user)
        for (const task of tasks) {
            if (task.created_by) usersById.set(task.created_by.id, task.created_by)
            if (task.assigned_to) usersById.set(task.assigned_to.id, task.assigned_to)
        }
        return [...usersById.values()].sort((a, b) => a.name.localeCompare(b.name))
    }, [tasks, user])

    const openCreateDrawer = () => {
        setEditingTask(null)
        setIsDrawerOpen(true)
    }

    const openEditDrawer = (task: Task) => {
        setEditingTask(task)
        setIsDrawerOpen(true)
    }

    const closeDrawer = () => {
        if (isSaving) return
        setIsDrawerOpen(false)
        setEditingTask(null)
    }

    const onSaveTask = async (taskId: number | null, payload: TaskPayload) => {
        try {
            if (taskId) {
                await updateTask(taskId, payload)
                toast.success('Tâche mise à jour.')
            } else {
                await createTask(payload)
                toast.success('Tâche créée.')
            }
            closeDrawer()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Enregistrement impossible.'
            toast.error(message)
        }
    }

    const onDeleteTask = async (taskId: number) => {
        const shouldDelete = window.confirm('Supprimer cette tâche ?')
        if (!shouldDelete) return

        try {
            await deleteTask(taskId)
            toast.success('Tâche supprimée.')
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Suppression impossible.'
            toast.error(message)
        }
    }

    const handleFilterChange = (newFilters: Partial<ITaskFilters>) => {
        setPage(1)
        setFilters((current) => ({ ...current, ...newFilters }))
    }

    return (
        <MainLayout>
            <div className="flex justify-start">
                <button className="btn btn-primary" onClick={openCreateDrawer} type="button">
                    Nouvelle tâche
                </button>
            </div>

            <TaskFilters
                filters={filters}
                users={assignableUsers}
                onFilterChange={handleFilterChange}
            />

            <TaskTable
                tasks={tasks}
                meta={meta}
                isFetching={isFetching}
                deletingTaskId={deletingTaskId}
                onEdit={openEditDrawer}
                onDelete={onDeleteTask}
                onPageChange={setPage}
            />

            <TaskDrawer
                isOpen={isDrawerOpen}
                isSaving={isSaving}
                onClose={closeDrawer}
                onSubmit={onSaveTask}
                task={editingTask}
                users={assignableUsers}
            />
        </MainLayout>
    )
}
