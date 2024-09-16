import React, { useState, useEffect } from 'react';

function ProfilePage() {
  const [userDisplayName, setUserDisplayName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    setUserDisplayName(localStorage.getItem('userDisplayName') || '');
    setUserEmail(localStorage.getItem('userEmail') || '');
  }, []);

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Username: {userDisplayName}</p>
      <p>Email: {userEmail}</p>
      {/* Add more profile information or functionality here */}
    </div>
  )
}

export default ProfilePage