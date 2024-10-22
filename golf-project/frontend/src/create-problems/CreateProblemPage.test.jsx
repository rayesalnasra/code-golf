import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
jest.mock('./CreateProblemPage.css', () => ({}));
import CreateProblemPage from './CreateProblemPage';

// Mock the firebase modules
jest.mock('./firebase/firebaseCodeRunner', () => ({
  dbCodeRunner: {}
}));

jest.mock('firebase/firestore/lite', () => ({
  setDoc: jest.fn(),
  doc: jest.fn()
}));

describe('CreateProblemPage', () => {
  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => 'testUserId');
  });

  test('renders CreateProblemPage and allows form submission', async () => {
    render(<CreateProblemPage />);

    // Check if the page title is rendered
    expect(screen.getByText('Create New Problem 🧩')).toBeInTheDocument();

    // Check if the form is rendered
    expect(screen.getByText('Problem Details')).toBeInTheDocument();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Problem ID:/i), { target: { value: 'test-problem-id' } });
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Test Problem' } });
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'This is a test problem.' } });

    // Simulate adding a test case
    fireEvent.change(screen.getByPlaceholderText('Inputs (comma-separated or JSON array)'), { target: { value: '[1, 2]' } });
    fireEvent.change(screen.getByPlaceholderText('Expected Output'), { target: { value: '3' } });
    fireEvent.click(screen.getByText('Add Test Case'));

    // Simulate testing the solution
    fireEvent.click(screen.getByText('Test Solution'));

    // Submit the form
    const submitButton = screen.getByText('Create Problem');
    fireEvent.click(submitButton);

    // Check if the form submission doesn't throw an error
    expect(submitButton).toBeInTheDocument();
  });

  test('shows error message when not logged in', () => {
    // Mock localStorage to return null
    Storage.prototype.getItem = jest.fn(() => null);

    render(<CreateProblemPage />);

    // Check if the error message is displayed
    expect(screen.getByText('Please log in to create a problem.')).toBeInTheDocument();
  });
});
