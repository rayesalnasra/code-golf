import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DirectMessagePage from './DirectMessagePage';
import { addDirectMessage, getDirectMessages } from '../firebase/firebaseDiscussions';

// Mock the react-router-dom useParams hook
jest.mock('react-router-dom', () => ({
  useParams: () => ({ userId: 'testUserId' }),
}));

// Mock the firebase functions
jest.mock('../firebase/firebaseDiscussions', () => ({
  addDirectMessage: jest.fn(),
  getDirectMessages: jest.fn(),
}));

describe('DirectMessagePage', () => {
  const originalError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
    // Mock localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'userUID') return 'currentUserId';
      if (key === 'userDisplayName') return 'Current User';
      return null;
    });

    // Mock getDirectMessages to return some test messages
    getDirectMessages.mockImplementation((_, callback) => {
      callback([
        { id: '1', userId: 'currentUserId', userName: 'Current User', message: 'Hello' },
        { id: '2', userId: 'testUserId', userName: 'Test User', message: 'Hi there' },
      ]);
      return jest.fn(); // Return a mock unsubscribe function
    });
  });

  afterEach(() => {
    console.error = originalError;
  });

  test('renders DirectMessagePage and displays messages', async () => {
    render(<DirectMessagePage />);

    expect(screen.getByText('Direct Message')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hi there')).toBeInTheDocument();
    });
  });

  test('allows sending a new message', async () => {
    render(<DirectMessagePage />);

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'New message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(addDirectMessage).toHaveBeenCalledWith(
        'currentUserId_testUserId',
        'currentUserId',
        'Current User',
        'New message'
      );
    });

    expect(input).toHaveValue('');
  });

  test('displays error message when sending fails', async () => {
    addDirectMessage.mockRejectedValueOnce(new Error('Failed to send'));

    render(<DirectMessagePage />);

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'New message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to send message: Failed to send')).toBeInTheDocument();
    });

    expect(console.error).toHaveBeenCalled();
  });
});
