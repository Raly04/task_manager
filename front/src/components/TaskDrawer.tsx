import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Task, TaskPayload, TaskPriority, TaskStatus, User } from '../types'
import { AsyncButton } from './AsyncButton'

const TASK_STATUS: Array<{ value: TaskStatus; label: string }> = [
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
]

const TASK_PRIORITY: Array<{ value: TaskPriority; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const taskSchema = z.object({
  title: z.string().trim().min(1, 'Le titre est obligatoire.').max(255),
  description: z.string().max(2000).optional(),
  status: z.enum(['todo', 'in-progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  due_date: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true
      const selectedDate = new Date(`${value}T00:00:00`)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate > today
    }, 'La date doit être dans le futur.'),
  assigned_to: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskSchema>

interface TaskDrawerProps {
  isOpen: boolean
  task: Task | null
  users: User[]
  isSaving: boolean
  onClose: () => void
  onSubmit: (id: number | null, payload: TaskPayload) => Promise<void>
}

function toDateInputValue(value: string | null): string {
  if (!value) return ''
  return value.slice(0, 10)
}

export function TaskDrawer({
  isOpen,
  task,
  users,
  isSaving,
  onClose,
  onSubmit,
}: TaskDrawerProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      due_date: '',
      assigned_to: '',
    },
  })

  useEffect(() => {
    reset({
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: task?.status ?? 'todo',
      priority: task?.priority ?? 'medium',
      due_date: toDateInputValue(task?.due_date ?? null),
      assigned_to: task?.assigned_to?.id ? String(task.assigned_to.id) : '',
    })
  }, [task, reset])

  const submitForm = handleSubmit(async (values) => {
    await onSubmit(task?.id ?? null, {
      title: values.title.trim(),
      description: values.description?.trim() || null,
      status: values.status,
      priority: values.priority,
      due_date: values.due_date || null,
      assigned_to: values.assigned_to ? Number(values.assigned_to) : null,
    })
  })

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-40 transition-all ${isOpen ? '' : 'pointer-events-none'
        }`}
    >
      <button
        aria-label="Fermer le panneau de tâche"
        className={`absolute inset-0 bg-black/35 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={onClose}
        type="button"
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-xl bg-base-100 shadow-2xl transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-base-300 p-5">
            <h2 className="text-xl font-bold">{task ? 'Modifier la tâche' : 'Nouvelle tâche'}</h2>
          </div>

          <form className="flex-1 overflow-y-auto p-5" onSubmit={submitForm}>
            <div className="space-y-5">
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-bold">Titre</span>
                </label>
                <input
                  className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                  {...register('title')}
                />
                {errors.title && (
                  <label className="label py-0 mt-1">
                    <span className="label-text-alt text-error">{errors.title.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-bold">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32 w-full resize-none"
                  {...register('description')}
                />
                {errors.description && (
                  <label className="label py-0 mt-1">
                    <span className="label-text-alt text-error">{errors.description.message}</span>
                  </label>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text font-bold">Statut</span>
                  </label>
                  <select className="select select-bordered w-full" {...register('status')}>
                    {TASK_STATUS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text font-bold">Priorité</span>
                  </label>
                  <select className="select select-bordered w-full" {...register('priority')}>
                    {TASK_PRIORITY.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text font-bold">Date limite</span>
                  </label>
                  <input
                    className={`input input-bordered w-full ${errors.due_date ? 'input-error' : ''}`}
                    type="date"
                    {...register('due_date')}
                  />
                  {errors.due_date && (
                    <label className="label py-0 mt-1">
                      <span className="label-text-alt text-error">{errors.due_date.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text font-bold">Assignée à</span>
                  </label>
                  <select className="select select-bordered w-full" {...register('assigned_to')}>
                    <option value="">Non assignée</option>
                    {users.map((user) => (
                      <option key={user.id} value={String(user.id)}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 mt-6 flex justify-end gap-2 border-t border-base-300 bg-base-100 pt-4">
              <button className="btn btn-ghost" onClick={onClose} type="button">
                Annuler
              </button>
              <AsyncButton
                className="btn btn-primary"
                isLoading={isSaving}
                loadingText={task ? 'Mise à jour...' : 'Création...'}
                type="submit"
              >
                {task ? 'Mettre à jour' : 'Créer'}
              </AsyncButton>
            </div>
          </form>
        </div>
      </aside>
    </div>
  )
}
