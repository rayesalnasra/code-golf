import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiscussionPage from './DiscussionPage';
import { addMessage, getMessages, checkDMConversation } from '../firebase/firebaseDiscussions';
import { useNavigate } from 'react-router-dom';

jest.mock('../firebase/firebaseDiscussions', () => ({
  addMessage: jest.fn(),
  getMessages: jest.fn(),
  checkDMConversation: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('DiscussionPage', () => {
  const mockNavigate = jest.fn();
  const originalError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'userUID') return 'currentUserId';
      if (key === 'userDisplayName') return 'Current User';
      return null;
    });

    getMessages.mockImplementation((callback) => {
      callback([
        { id: '1', userId: 'currentUserId', userName: 'Current User', message: 'Hello' },
        { id: '2', userId: 'otherUserId', userName: 'Other User', message: 'Hi there' },
      ]);
      return jest.fn();
    });

    checkDMConversation.mockResolvedValue(true);
  });

  afterEach(() => {
    console.error = originalError;
  });

  test('renders DiscussionPage and displays messages', async () => {
    render(<DiscussionPage />);

    expect(screen.getByText('Discussion 💬')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hi there')).toBeInTheDocument();
    });
  });

  test('allows sending a new message', async () => {
    render(<DiscussionPage />);

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'New message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(addMessage).toHaveBeenCalledWith(
        'currentUserId',
        'Current User',
        'New message'
      );
    });

    expect(input).toHaveValue('');
  });

  test('displays Reply button for existing DM conversations', async () => {
    render(<DiscussionPage />);

    await waitFor(() => {
      const replyButton = screen.getByText('Reply');
      expect(replyButton).toBeInTheDocument();
      expect(replyButton).toHaveStyle('background-color: blue');
    });
  });

  test('navigates to DM page when Reply button is clicked', async () => {
    render(<DiscussionPage />);

    await waitFor(() => {
      const replyButton = screen.getByText('Reply');
      fireEvent.click(replyButton);
      expect(mockNavigate).toHaveBeenCalledWith('/direct-message/otherUserId');
    });
  });

  test('displays error message when fetching messages fails', async () => {
    getMessages.mockImplementation(() => {
      throw new Error('Failed to fetch messages');
    });

    render(<DiscussionPage />);

    await waitFor(() => {
      expect(screen.getByText('Error fetching messages: Failed to fetch messages')).toBeInTheDocument();
    });

    expect(console.error).toHaveBeenCalled();
  });
});
