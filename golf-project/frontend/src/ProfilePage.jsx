import React, { useState, useEffect } from 'react';
import { readData, updateData } from './databaseUtils'; // Ensure updateData is properly exported
import './ProfilePage.css';

function ProfilePage() {
  const [user, setUser] = useState({
    displayName: '',
    email: '',
    level: 0,
    xp: 0,
    score: 0,
  });

  const [editableUser, setEditableUser] = useState({ displayName: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userUID');
    const storedEmail = localStorage.getItem('userEmail');
    const storedDisplayName = localStorage.getItem('userDisplayName');

    if (userId) {
      readData(`users/${userId}`, (userData) => {
        if (userData) {
          setUser({
            displayName: storedDisplayName || userData.displayName || 'Anonymous User',
            email: storedEmail || userData.email || 'No email provided',
            level: userData.level || 0,
            xp: userData.xp || 0,
            score: userData.score || 0,
          });
          setEditableUser({
            displayName: storedDisplayName || userData.displayName || 'Anonymous User',
            email: storedEmail || userData.email || 'No email provided',
          });
        }
      });
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setEditableUser({
      displayName: user.displayName,
      email: user.email,
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    const userId = localStorage.getItem('userUID');
    if (userId) {
      updateData(`users/${userId}`, editableUser, () => {
        setUser(editableUser);
        setIsEditing(false);
      });
    } else {
      console.error('No user ID found in localStorage');
    }
  };

  return (
    <div className="profile-page">
      <div className="content-container">
        <h1 className="page-title">User Profile 👤</h1>

        <section className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>Username</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="displayName"
                  value={editableUser.displayName}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{user.displayName}</p>
              )}
            </div>
            <div className="info-item">
              <h3>Email</h3>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editableUser.email}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{user.email}</p>
              )}
            </div>
          </div>
          {isEditing ? (
            <div className="button-group">
              <button className="save-button" onClick={handleSaveClick}>Save</button>
              <button className="cancel-button" onClick={handleCancelClick}>Cancel</button>
            </div>
          ) : (
            <button className="edit-button" onClick={handleEditClick}>Edit</button>
          )}
        </section>

        <section className="profile-section">
          <h2>Code Golf Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>Level</h3>
              <p className="stat-value">{user.level}</p>
            </div>
            <div className="stat-item">
              <h3>XP</h3>
              <p className="stat-value">{user.xp} / {100 + (user.level * 50)}</p>
            </div>
            <div className="stat-item">
              <h3>Score</h3>
              <p className="stat-value">{user.score}</p>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2>Recent Activity</h2>
          <p>Coming soon: Your recent problem-solving activity will be displayed here!</p>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;






// import React, { useState, useEffect } from 'react';
// import { readData } from './databaseUtils';
// import './ProfilePage.css';

// function ProfilePage() {
//   const [user, setUser] = useState({
//     displayName: '',
//     email: '',
//     level: 0,
//     xp: 0,
//     score: 0,
//   });

//   useEffect(() => {
//     const userId = localStorage.getItem('userUID');
//     const storedEmail = localStorage.getItem('userEmail');
//     const storedDisplayName = localStorage.getItem('userDisplayName');

//     if (userId) {
//       readData(`users/${userId}`, (userData) => {
//         if (userData) {
//           setUser({
//             displayName: storedDisplayName || userData.displayName || 'Anonymous User',
//             email: storedEmail || userData.email || 'No email provided',
//             level: userData.level || 1,
//             xp: userData.xp || 0,
//             score: userData.score || 0,
//           });
//         }
//       });
//     }
//   }, []);

//   return (
//     <div className="profile-page">
//       <div className="content-container">
//         <h1 className="page-title">User Profile 👤</h1>
        
//         <section className="profile-section">
//           <h2>Personal Information</h2>
//           <div className="info-grid">
//             <div className="info-item">
//               <h3>Username</h3>
//               <p>{user.displayName}</p>
//             </div>
//             <div className="info-item">
//               <h3>Email</h3>
//               <p>{user.email}</p>
//             </div>
//           </div>
//         </section>

//         <section className="profile-section">
//           <h2>Code Golf Stats</h2>
//           <div className="stats-grid">
//             <div className="stat-item">
//               <h3>Level</h3>
//               <p className="stat-value">{user.level}</p>
//             </div>
//             <div className="stat-item">
//               <h3>XP</h3>
//               <p className="stat-value">{user.xp} / {100 + (user.level * 50)}</p>
//             </div>
//             <div className="stat-item">
//               <h3>Score</h3>
//               <p className="stat-value">{user.score}</p>
//             </div>
//           </div>
//         </section>

//         <section className="profile-section">
//           <h2>Recent Activity</h2>
//           <p>Coming soon: Your recent problem-solving activity will be displayed here!</p>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage; 