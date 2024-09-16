import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState('');

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setUserDisplayName(localStorage.getItem('userDisplayName') || '');
  }, []);

  return (
    <div>
      <h1>Welcome to Code Golf</h1>
      {isAuthenticated ? (
        <p>Hello, {userDisplayName}! Ready to solve some coding challenges?</p>
      ) : (
        <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to start golfing!</p>
      )}
    </div>
  )
}

export default HomePage