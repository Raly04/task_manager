import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskTable } from './TaskTable'
import type { Task, PaginationMeta } from '../../../types'

const mockTasks: Task[] = [
    {
        id: 1,
        title: 'Test Task 1',
        description: 'Description 1',
        status: 'todo',
        priority: 'high',
        due_date: '2026-12-31',
        assigned_to: { id: 1, name: 'User 1', email: 'user1@test.com', role: 'user' },
        created_by: { id: 2, name: 'Admin', email: 'admin@test.com', role: 'admin' },
        comments_count: 0,
        created_at: ''
    }
]

const mockMeta: PaginationMeta = {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 1
}

describe('TaskTable', () => {
    const mockOnEdit = jest.fn()
    const mockOnDelete = jest.fn()
    const mockOnComment = jest.fn()
    const mockOnPageChange = jest.fn()

    it('renders tasks correctly', () => {
        render(
            <TaskTable
                tasks={mockTasks}
                meta={mockMeta}
                isFetching={false}
                deletingTaskId={null}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onComment={mockOnComment}
                onPageChange={mockOnPageChange}
            />
        )

        expect(screen.getAllByText('Test Task 1')[0]).toBeInTheDocument()
        expect(screen.getAllByText('Description 1')[0]).toBeInTheDocument()
        expect(screen.getAllByText('User 1')[0]).toBeInTheDocument()
    })

    it('shows empty state when no tasks', () => {
        render(
            <TaskTable
                tasks={[]}
                meta={{ ...mockMeta, total: 0 }}
                isFetching={false}
                deletingTaskId={null}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onComment={mockOnComment}
                onPageChange={mockOnPageChange}
            />
        )

        expect(screen.getAllByText('Aucune tâche trouvée.')[0]).toBeInTheDocument()
    })

    it('calls onEdit when clicking modifier', () => {
        render(
            <TaskTable
                tasks={mockTasks}
                meta={mockMeta}
                isFetching={false}
                deletingTaskId={null}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onComment={mockOnComment}
                onPageChange={mockOnPageChange}
            />
        )

        fireEvent.click(screen.getAllByText('Modifier')[0])
        expect(mockOnEdit).toHaveBeenCalledWith(mockTasks[0])
    })

    it('calls onDelete when clicking supprimer', () => {
        render(
            <TaskTable
                tasks={mockTasks}
                meta={mockMeta}
                isFetching={false}
                deletingTaskId={null}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onComment={mockOnComment}
                onPageChange={mockOnPageChange}
            />
        )

        fireEvent.click(screen.getAllByText('Supprimer')[0])
        expect(mockOnDelete).toHaveBeenCalledWith(mockTasks[0].id)
    })

    it('calls onComment when clicking comment button', () => {
        render(
            <TaskTable
                tasks={mockTasks}
                meta={mockMeta}
                isFetching={false}
                deletingTaskId={null}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onComment={mockOnComment}
                onPageChange={mockOnPageChange}
            />
        )

        const commentBtn = screen.getAllByTitle('Commentaires')[0]
        fireEvent.click(commentBtn)
        expect(mockOnComment).toHaveBeenCalledWith(mockTasks[0])
    })
})
