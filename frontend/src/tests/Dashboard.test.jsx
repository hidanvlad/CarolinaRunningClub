import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import Dashboard from '../components/Dashboard';

const renderDashboard = () => {
    return render(
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>
    );
};

describe('Dashboard 100% Final Coverage', () => {
    beforeEach(() => {
        cleanup();
        window.confirm = vi.fn(() => true);
    });

    test('Validation: covers all error branches', () => {
        renderDashboard();
        const addButton = screen.getByText(/Add Run/i);

        fireEvent.change(screen.getByLabelText(/Run Name/i), { target: { value: 'ab' } });
        fireEvent.click(addButton);
        expect(screen.getByText(/Run name must be at least 3 characters/i)).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText(/Run Name/i), { target: { value: 'Valid Name' } });
        fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '' } });
        fireEvent.click(addButton);
        expect(screen.getByText(/A valid date is required/i)).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2099-01-01' } });
        fireEvent.click(addButton);
        expect(screen.getByText(/Date cannot be in the future/i)).toBeInTheDocument();
    });

    test('CRUD: Create, Update, Cancel, and Delete cycle', async () => {
        renderDashboard();

        // 1. Create
        fireEvent.change(screen.getByLabelText(/Run Name/i), { target: { value: 'New Test Run' } });
        fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-01-01' } });
        fireEvent.click(screen.getByText(/Add Run/i));
        await waitFor(() => expect(screen.getByText('New Test Run')).toBeInTheDocument());

        // 2. Edit Setup & Cancel 
        fireEvent.click(screen.getAllByText(/Edit/i)[0]);
        expect(screen.getByText(/Editing Mode/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Cancel/i));
        expect(screen.queryByText(/Editing Mode/i)).not.toBeInTheDocument();

        // 3. Update
        fireEvent.click(screen.getAllByText(/Edit/i)[0]);
        fireEvent.change(screen.getByLabelText(/Run Name/i), { target: { value: 'Completely Updated' } });
        fireEvent.click(screen.getByText(/Save Changes/i));
        await waitFor(() => expect(screen.getByText('Completely Updated')).toBeInTheDocument());

        // 4. Delete
        fireEvent.click(screen.getAllByText(/Delete/i)[0]);
        await waitFor(() => expect(screen.queryByText('Completely Updated')).not.toBeInTheDocument());
    });

    test('UI: handles pagination and navigation', async () => {
        renderDashboard();

        // Add an extra run to ensure we have > 5 items for Page 2
        fireEvent.change(screen.getByLabelText(/Run Name/i), { target: { value: 'Sixth Run' } });
        fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-01-01' } });
        fireEvent.click(screen.getByText(/Add Run/i));

        // Test Pagination
        const nextBtn = screen.getByText(/Next/i);
        fireEvent.click(nextBtn);
        expect(screen.getByText(/Page 2/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText(/Prev/i));
        expect(screen.getByText(/Page 1/i)).toBeInTheDocument();

        // Test Navigation Links
        fireEvent.click(screen.getByText(/Back to Home/i));
        fireEvent.click(screen.getAllByText(/2026/i)[0]); // Clicks a date/row to trigger detail nav
    });
});