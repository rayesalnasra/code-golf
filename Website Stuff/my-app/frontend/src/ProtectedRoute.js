import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userUID = localStorage.getItem('userUID');
    const userEmail = localStorage.getItem('userEmail');

    if (!isAuthenticated || !userUID || !userEmail) {
      if (isAuthenticated && (!userUID || !userEmail)) {
        localStorage.setItem('isAuthenticated', 'Nice Try');
        // Tampering with 'Inspect' > 'Application' > 'Local storage' >
        // Then by changing the values is possible.
        // This code acknowledges that and changes the value
      }
      // If any values are empty or false then it is likely they did not login
      navigate('/login');
    } else {
      // If all variables have values they are logged in
      setAuth(true);
    }
  }, [navigate]);

  return auth ? children : null;
  // Render children (protected page) only if authenticated
  /***********************************************************************************
    children are refering to any element that should be rendered.                     *
    This allows for reuse of protected route to ensure that user is still logged in   *
    NOTE: This only checks if the user variables have values. It does not validate    *
          them in the backend. Ensure your page has communication with server.js      *
          to validate login credentials when needed                                   *

    --- To use Protected Route use this code in App.js and replace where needed ---
    <Route
      path="/Your_URL"
      element={
        <ProtectedRoute>
          <Your_Component_to_Load />
        </ProtectedRoute>
      }
    />

  **************************************************************************************/
}

export default ProtectedRoute;
