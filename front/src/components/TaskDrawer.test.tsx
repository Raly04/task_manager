import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TaskDrawer } from './TaskDrawer'
import type { User } from '../types'

const mockUsers: User[] = [
    { id: 1, name: 'User 1', email: 'user1@test.com', role: 'user' },
    { id: 2, name: 'User 2', email: 'user2@test.com', role: 'user' },
]

describe('TaskDrawer', () => {
    const mockOnClose = jest.fn()
    const mockOnSubmit = jest.fn()

    it('renders correctly when open', () => {
        render(
            <TaskDrawer
                isOpen={true}
                task={null}
                users={mockUsers}
                isSaving={false}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        )

        expect(screen.getByText('Nouvelle tâche')).toBeInTheDocument()
        expect(screen.getByLabelText('Titre')).toBeInTheDocument()
        expect(screen.getByLabelText('Description')).toBeInTheDocument()
    })

    it('calls onSubmit with correct data when saving new task', async () => {
        render(
            <TaskDrawer
                isOpen={true}
                task={null}
                users={mockUsers}
                isSaving={false}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        )

        fireEvent.change(screen.getByLabelText('Titre'), { target: { value: 'New Test Task' } })
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test description' } })

        fireEvent.click(screen.getByText('Créer'))

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(null, expect.objectContaining({
                title: 'New Test Task',
                description: 'Test description',
                status: 'todo',
                priority: 'medium'
            }))
        })
    })

    it('calls onClose when clicking Annuler', () => {
        render(
            <TaskDrawer
                isOpen={true}
                task={null}
                users={mockUsers}
                isSaving={false}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        )

        fireEvent.click(screen.getByText('Annuler'))
        expect(mockOnClose).toHaveBeenCalled()
    })
})
