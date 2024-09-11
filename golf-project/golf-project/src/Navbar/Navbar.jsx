import React, { useState } from 'react';
import './Navbar.css'; // Import the CSS file for styling
import logo from './logo.jpg';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    const content = document.querySelectorAll('.content');
    
    content.forEach(item => {
      if (item.textContent.toLowerCase().includes(query)) {
        item.style.display = 'block'; // Show items that match the query
      } else {
        item.style.display = 'none'; // Hide items that don't match
      }
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    document.body.classList.toggle('dark-mode');
    
    // Add dark mode class to navbar and dropdown content
    const navbar = document.querySelector('.navbar');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    if (navbar) navbar.classList.toggle('dark-mode');
    if (dropdownContent) dropdownContent.classList.toggle('dark-mode');
    
    // Update search bar input field in dark mode
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) searchInput.classList.toggle('dark-mode');
  };

  const handleSignOut = () => {
    // Handle sign out logic here
    alert('Sign Out button clicked');
  };
  return (
    <div className="navbar">
      <div className="logo">
        <img src={logo} alt="Code Golf Logo" className="logo-img" />
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearch}
        />
      </div>
      <div className="dropdown">
        <button className="dropbtn">
          <div className="hamburger-icon">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </button>
        <div className="dropdown-content">
          <a href="#home">Home</a>
          <a href="profile.jsx">Profile</a>
          <a href="#scoreboard">Scoreboard</a>
          <a href="#history.jsx">History</a>
          <a href="#discussion.jsx">Discussion</a>
          <a href="Documentation.jsx">Documentation</a>
          <a href="#tutorial.jsx">Tutorial</a>
          <a href="#" className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </a>
          <a href="#" onClick={handleSignOut}>
            Sign Out
          </a>
        </div>
      </div>
    </div>
  );
};


export default Navbar;
