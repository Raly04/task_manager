import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { LayoutGrid, List } from 'lucide-react'
import { MainLayout } from '../layouts/MainLayout'
import { TaskTable } from '../features/tasks/components/TaskTable'
import { TaskKanban } from '../features/tasks/components/TaskKanban'
import { TaskFilters } from '../features/tasks/components/TaskFilters'
import { TaskDrawer } from '../components/TaskDrawer'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { useTasks } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import { useUsers } from '../hooks/useUsers'
import { useDebounce } from '../hooks/useDebounce'
import type { Task, TaskFilters as ITaskFilters, TaskPayload, TaskStatus } from '../types'

export function DashboardPage() {
    const { isAuthenticated } = useAuth()
    const { users: allUsers } = useUsers(isAuthenticated)
    const [view, setView] = useState<'table' | 'kanban'>('table')
    const [filters, setFilters] = useState<ITaskFilters>({
        status: '',
        priority: '',
        assigned_to: '',
        search: '',
    })
    const [page, setPage] = useState(1)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null)
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
        page: view === 'table' ? page : 1, // Disable pagination for kanban if needed, or handle it
        isEnabled: isAuthenticated,
        all: view === 'kanban',
    })

    useEffect(() => {
        if (fetchError) {
            toast.error(fetchError, { id: 'tasks-fetch-error' })
        }
    }, [fetchError])

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

    const onUpdateTaskStatus = async (taskId: number, payload: { status?: TaskStatus }) => {
        try {
            await updateTask(taskId, payload)
            toast.success('Statut mis à jour.')
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Droit insuffisant ou erreur.'
            toast.error(message)
        }
    }

    const confirmDelete = async () => {
        if (!taskToDelete) return

        try {
            await deleteTask(taskToDelete)
            toast.success('Tâche supprimée avec succès.')
            setTaskToDelete(null)
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button className="btn btn-primary sm:w-fit" onClick={openCreateDrawer} type="button">
                    Nouvelle tâche
                </button>

                <div className="join bg-base-100 shadow-sm border border-base-300">
                    <button
                        className={`join-item btn btn-sm h-10 px-4 ${view === 'table' ? 'btn-active btn-ghost' : 'btn-ghost'}`}
                        onClick={() => setView('table')}
                    >
                        <List size={18} className="mr-2" />
                        Liste
                    </button>
                    <button
                        className={`join-item btn btn-sm h-10 px-4 ${view === 'kanban' ? 'btn-active btn-ghost' : 'btn-ghost'}`}
                        onClick={() => setView('kanban')}
                    >
                        <LayoutGrid size={18} className="mr-2" />
                        Kanban
                    </button>
                </div>
            </div>

            <TaskFilters
                filters={filters}
                users={allUsers}
                onFilterChange={handleFilterChange}
            />

            {view === 'table' ? (
                <TaskTable
                    tasks={tasks}
                    meta={meta}
                    isFetching={isFetching}
                    deletingTaskId={deletingTaskId}
                    onEdit={openEditDrawer}
                    onDelete={setTaskToDelete}
                    onPageChange={setPage}
                />
            ) : (
                <TaskKanban
                    tasks={tasks}
                    onEdit={openEditDrawer}
                    onTaskUpdate={onUpdateTaskStatus}
                />
            )}

            <TaskDrawer
                isOpen={isDrawerOpen}
                isSaving={isSaving}
                onClose={closeDrawer}
                onSubmit={onSaveTask}
                task={editingTask}
                users={allUsers}
            />

            <ConfirmationModal
                isOpen={taskToDelete !== null}
                title="Supprimer la tâche"
                message="Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible."
                confirmText="Supprimer"
                cancelText="Annuler"
                isLoading={deletingTaskId !== null}
                onConfirm={confirmDelete}
                onCancel={() => setTaskToDelete(null)}
                type="danger"
            />
        </MainLayout>
    )
}
