import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FriendsPage from './FriendsPage';

describe('FriendsPage', () => {
  test('renders FriendsPage and displays friends', async () => {
    render(<FriendsPage />);

    expect(screen.getByText('Friends List 👥')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Rayes')).toBeInTheDocument();
      expect(screen.getByText('David')).toBeInTheDocument();
      expect(screen.getByText('Will')).toBeInTheDocument();
      expect(screen.getByText('Billal')).toBeInTheDocument();
    });
  });

  test('displays pending friend requests', async () => {
    render(<FriendsPage />);

    await waitFor(() => {
      expect(screen.getByText('Matthew')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });
  });

  test('displays received friend invitations', async () => {
    render(<FriendsPage />);

    await waitFor(() => {
      expect(screen.getByText('Alex')).toBeInTheDocument();
      expect(screen.getByText('Sophie')).toBeInTheDocument();
    });
  });

  test('allows sending a new friend invitation', async () => {
    render(<FriendsPage />);

    const input = screen.getByPlaceholderText("Enter friend's name");
    const sendButton = screen.getByText('Send Invitation');

    fireEvent.change(input, { target: { value: 'New Friend' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('New Friend')).toBeInTheDocument();
    });

    expect(input).toHaveValue('');
  });

  test('allows accepting a friend invitation', async () => {
    render(<FriendsPage />);

    await waitFor(() => {
      const acceptButton = screen.getAllByText('Accept')[0];
      fireEvent.click(acceptButton);
    });

    expect(screen.getAllByText('Alex')).toHaveLength(1); // Only in friends list
  });

  test('allows rejecting a friend invitation', async () => {
    render(<FriendsPage />);

    await waitFor(() => {
      const rejectButton = screen.getAllByText('Reject')[0]; // Use the first 'Reject' button
      fireEvent.click(rejectButton);
    });

    expect(screen.queryByText('Alex')).not.toBeInTheDocument(); // Alex should be removed
  });
});
