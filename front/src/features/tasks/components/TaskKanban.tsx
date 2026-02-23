import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import type { Task, TaskStatus } from '../../../types'
import { PRIORITY_BADGE, TASK_STATUS } from '../constants'
import { MoreVertical, Calendar, MessageSquare } from 'lucide-react'
import { formatDate } from '../../../utils/date'

interface TaskKanbanProps {
    tasks: Task[]
    onTaskUpdate: (taskId: number, payload: { status?: TaskStatus }) => Promise<void>
    onEdit: (task: Task) => void
    onComment: (task: Task) => void
}

export function TaskKanban({ tasks, onTaskUpdate, onEdit, onComment }: TaskKanbanProps) {
    const columns: { id: TaskStatus; title: string }[] = TASK_STATUS
        .filter(s => s.value !== '')
        .map(s => ({ id: s.value as TaskStatus, title: s.label }))

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result

        if (!destination) return
        if (destination.droppableId === source.droppableId && destination.index === source.index) return

        const taskId = parseInt(draggableId)
        const newStatus = destination.droppableId as TaskStatus

        onTaskUpdate(taskId, { status: newStatus })
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start">
                {columns.map((column) => {
                    const columnTasks = tasks.filter((t) => t.status === column.id)

                    return (
                        <div key={column.id} className="flex flex-col bg-base-200/50 rounded-2xl border border-base-300 min-h-[500px]">
                            <div className="p-4 flex items-center justify-between border-b border-base-300">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-base-content/80">{column.title}</h3>
                                    <span className="badge badge-sm badge-ghost">{columnTasks.length}</span>
                                </div>
                            </div>

                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`flex-1 p-3 space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-base-300/30' : ''
                                            }`}
                                    >
                                        {columnTasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`card bg-base-100 shadow-sm border border-base-300 hover:border-primary/30 transition-all ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-primary/20 rotate-1' : ''
                                                            }`}
                                                    >
                                                        <div className="card-body p-4 gap-3">
                                                            <div className="flex justify-between items-start gap-2">
                                                                <span className={`${PRIORITY_BADGE[task.priority]} badge-xs font-bold uppercase tracking-wider`}>
                                                                    {task.priority}
                                                                </span>
                                                                <div className="flex gap-1">
                                                                    <button
                                                                        className="btn btn-ghost btn-xs btn-circle text-primary relative"
                                                                        onClick={() => onComment(task)}
                                                                        title="Commentaires"
                                                                    >
                                                                        <MessageSquare size={14} />
                                                                        {task.comments_count > 0 && (
                                                                            <span className="badge badge-xs badge-primary absolute -top-1 -right-1 scale-75">
                                                                                {task.comments_count}
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-ghost btn-xs btn-circle"
                                                                        onClick={() => onEdit(task)}
                                                                    >
                                                                        <MoreVertical size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <h4 className="font-bold text-sm leading-tight text-base-content">
                                                                {task.title}
                                                            </h4>

                                                            <p className="text-xs text-base-content/60 line-clamp-2 leading-relaxed">
                                                                {task.description || 'Pas de description'}
                                                            </p>

                                                            <div className="flex flex-wrap items-center gap-3 mt-1 py-2 border-t border-base-200 pt-3">
                                                                <div className="flex items-center gap-1.5 text-[10px] text-base-content/50">
                                                                    <Calendar size={12} className="shrink-0" />
                                                                    <span>{formatDate(task.due_date)}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-[10px] text-base-content/50 ml-auto">
                                                                    <div className="avatar placeholder">
                                                                        <div className="bg-primary/10 text-primary w-5 rounded-full">
                                                                            <span className="text-[10px] font-bold">
                                                                                {task.assigned_to?.name.charAt(0) || '?'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <span className="truncate max-w-[60px]">
                                                                        {task.assigned_to?.name.split(' ')[0] || 'Unassigned'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    )
                })}
            </div>
        </DragDropContext>
    )
}
