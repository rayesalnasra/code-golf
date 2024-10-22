import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePage from './ProfilePage';

// Mock the necessary modules
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock('react-chartjs-2', () => ({
  Line: () => null,
}));

jest.mock('../firebase/databaseUtils', () => ({
  readProfileData: jest.fn(),
  updateData: jest.fn(),
}));

jest.mock('../firebase/firebaseAuth', () => ({
  auth: {
    currentUser: {
      updateProfile: jest.fn(),
    },
  },
}));

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  get: jest.fn().mockResolvedValue({ exists: () => false, val: () => null }),
  set: jest.fn(),
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'userUID') return 'testUserId';
      if (key === 'userEmail') return 'test@example.com';
      if (key === 'userDisplayName') return 'Test User';
      if (key === 'userBio') return 'Test Bio';
      return null;
    });
  });

  test('renders badges correctly', async () => {
    render(<ProfilePage />);

    // Check if the Badges section is rendered
    expect(await screen.findByText('Badges')).toBeInTheDocument();

    // Check if all point badges are rendered
    ['100', '1000', '1500', '2000', '2500'].forEach(points => {
      expect(screen.getByText(`${points} Points`)).toBeInTheDocument();
    });

    // Check if all level badges are rendered
    ['1', '5', '10', '50', '100+'].forEach(level => {
      expect(screen.getByText(`Level ${level}`)).toBeInTheDocument();
    });

    // Check if all badge images are rendered
    const badgeImages = screen.getAllByAltText(/Badge for/);
    expect(badgeImages).toHaveLength(10); // 5 point badges + 5 level badges
  });
});
