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
                onPageChange={mockOnPageChange}
            />
        )

        expect(screen.getByText('Test Task 1')).toBeInTheDocument()
        expect(screen.getByText('Description 1')).toBeInTheDocument()
        expect(screen.getByText('User 1')).toBeInTheDocument()
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
                onPageChange={mockOnPageChange}
            />
        )

        expect(screen.getByText('Aucune tâche trouvée.')).toBeInTheDocument()
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
                onPageChange={mockOnPageChange}
            />
        )

        fireEvent.click(screen.getByText('Modifier'))
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
                onPageChange={mockOnPageChange}
            />
        )

        fireEvent.click(screen.getByText('Supprimer'))
        expect(mockOnDelete).toHaveBeenCalledWith(mockTasks[0].id)
    })
})
