// import React, { useState, useEffect } from 'react';

// function ProfilePage() {
//   const [userDisplayName, setUserDisplayName] = useState('');
//   const [userEmail, setUserEmail] = useState('');

//   useEffect(() => {
//     setUserDisplayName(localStorage.getItem('userDisplayName') || '');
//     setUserEmail(localStorage.getItem('userEmail') || '');
//   }, []);

//   return (
//     <div>
//       <h1>Profile Page</h1>
//       <p>Username: {userDisplayName}</p>
//       <p>Email: {userEmail}</p>
//       {/* Add more profile information or functionality here */}
//     </div>
//   )
// }

// export default ProfilePage

import React, { useState, useEffect } from 'react';
import './ProfilePage.css'; // Import the CSS file for styling

const Profile = () => {
  // Load profile data from localStorage if available, else use default values
  const savedProfileData = JSON.parse(localStorage.getItem('profileData')) || {
    name: "John Doe",
    bio: "A brief bio about John Doe, including interests, background, and any other relevant information.",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    address: "123 Main Street, Anytown, USA",
    profilePicture: "profile-picture.jpg" // Default profile picture
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isPrivate, setIsPrivate] = useState(JSON.parse(localStorage.getItem('isPrivate')) || false); // Load privacy status from localStorage
  const [profileData, setProfileData] = useState(savedProfileData);
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  // UseEffect to save profile data to localStorage whenever it's updated
  useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify(profileData));
  }, [profileData]);

  // UseEffect to save privacy status to localStorage
  useEffect(() => {
    localStorage.setItem('isPrivate', JSON.stringify(isPrivate));
  }, [isPrivate]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    if (newProfilePicture) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prevData) => ({
          ...prevData,
          profilePicture: reader.result // Save the Base64 image string to localStorage
        }));
      };
      reader.readAsDataURL(newProfilePicture);
    }
    setIsEditing(false);
    alert('Profile updated successfully');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfilePicture(e.target.files[0]);
    }
  };

  const togglePrivacy = () => {
    setIsPrivate(!isPrivate);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={profileData.profilePicture} alt="Profile" className="profile-picture" />
        <h1 className="profile-name">{profileData.name}</h1>
        <p className="profile-bio">{profileData.bio}</p>
      </div>

      {isPrivate ? (
        <div className="private-message">
          <h3>This profile is private.</h3>
        </div>
      ) : (
        <div className="profile-details">
          <h2>Contact Information</h2>
          <p>Email: {profileData.email}</p>
          <p>Phone: {profileData.phone}</p>
          <p>Address: {profileData.address}</p>
        </div>
      )}

      <div className="profile-actions">
        <button className="action-button" onClick={handleEditProfile}>Edit Profile</button>
        <button className="action-button" onClick={togglePrivacy}>
          {isPrivate ? "Make Profile Public" : "Make Profile Private"}
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="edit-modal">
          <h3 className="edit-title">Edit Profile</h3>
          <form className="edit-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                className="input-field textarea"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="profilePicture">Profile Picture</label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handlePictureChange}
                className="input-field"
              />
              {newProfilePicture && (
                <img
                  src={URL.createObjectURL(newProfilePicture)}
                  alt="New Profile Preview"
                  className="profile-picture-preview"
                />
              )}
            </div>
            <div className="edit-form-actions">
              <button type="button" className="action-button save-button" onClick={handleSaveProfile}>
                Save
              </button>
              <button type="button" className="action-button cancel-button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
