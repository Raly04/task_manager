import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskKanban } from './TaskKanban'
import type { Task } from '../../../types'

// Mocking dnd to avoid complex setup
jest.mock('@hello-pangea/dnd', () => ({
    DragDropContext: ({ children }: any) => <div>{children}</div>,
    Droppable: ({ children }: any) => children({
        droppableProps: {},
        innerRef: jest.fn(),
        placeholder: null,
    }, { isDraggingOver: false }),
    Draggable: ({ children }: any) => children({
        draggableProps: {},
        dragHandleProps: {},
        innerRef: jest.fn(),
    }, { isDragging: false }),
}))

const mockTasks: Task[] = [
    {
        id: 1,
        title: 'Task 1',
        description: 'Desc 1',
        status: 'todo',
        priority: 'high',
        due_date: '2026-12-31',
        assigned_to: { id: 1, name: 'User 1', email: 'u1@t.com', role: 'user' },
        created_by: { id: 2, name: 'Admin', email: 'a@t.com', role: 'admin' },
        comments_count: 5,
        created_at: ''
    }
]

describe('TaskKanban', () => {
    const mockOnTaskUpdate = jest.fn()
    const mockOnEdit = jest.fn()
    const mockOnComment = jest.fn()

    it('renders columns and tasks correctly', () => {
        render(
            <TaskKanban
                tasks={mockTasks}
                onTaskUpdate={mockOnTaskUpdate}
                onEdit={mockOnEdit}
                onComment={mockOnComment}
            />
        )

        expect(screen.getByText('To do')).toBeInTheDocument()
        expect(screen.getByText('In progress')).toBeInTheDocument()
        expect(screen.getByText('Done')).toBeInTheDocument()

        expect(screen.getByText('Task 1')).toBeInTheDocument()
        expect(screen.getByText('5')).toBeInTheDocument() // Comment count badge
    })

    it('calls onEdit when clicking edit button', () => {
        render(
            <TaskKanban
                tasks={mockTasks}
                onTaskUpdate={mockOnTaskUpdate}
                onEdit={mockOnEdit}
                onComment={mockOnComment}
            />
        )

        const editBtn = screen.getAllByRole('button').find(b => !b.title) // The one with MoreVertical
        if (editBtn) fireEvent.click(editBtn)
        expect(mockOnEdit).toHaveBeenCalledWith(mockTasks[0])
    })

    it('calls onComment when clicking comment button', () => {
        render(
            <TaskKanban
                tasks={mockTasks}
                onTaskUpdate={mockOnTaskUpdate}
                onEdit={mockOnEdit}
                onComment={mockOnComment}
            />
        )

        const commentBtn = screen.getByTitle('Commentaires')
        fireEvent.click(commentBtn)
        expect(mockOnComment).toHaveBeenCalledWith(mockTasks[0])
    })
})
