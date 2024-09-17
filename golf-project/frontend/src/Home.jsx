import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  
  const userDisplayName = localStorage.getItem('userDisplayName'); // Get displayName

  const handleLogout = () => {
    // Clear authentication state and user information from localStorage
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('userUID');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userDisplayName');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="container">
      <h2>Welcome to the Home Page</h2>
      {userDisplayName && <h2>Hello, {userDisplayName}!</h2>}  {/* Display displayName */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
  // Generic Place Holder. This will be replaced by an actual Home Page when merged
}

export default Home;
