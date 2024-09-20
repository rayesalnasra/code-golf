import React, { useState, useEffect } from "react";
import { readData } from "../firebase/databaseUtils";
import "./LeaderboardPage.css";

function LeaderboardPage() {
  const [users, setUsers] = useState([]); // State to hold the list of users

  useEffect(() => {
    // Fetch user data from Firebase when the component mounts
    readData("users", (data) => {
      if (data) {
        // Transform data into an array of user objects
        const usersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // Sort users by score in descending order
        usersArray.sort((a, b) => b.score - a.score);
        setUsers(usersArray); // Update state with sorted users
      }
    });
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="leaderboard-page">
      <div className="content-container">
        <h1 className="page-title">Leaderboard 🏆</h1>
        
        <section className="leaderboard-section">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td> {/* Rank (1-based index) */}
                  <td>{user.displayName}</td> {/* User's display name */}
                  <td>{user.score}</td> {/* User's score */}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="leaderboard-info">
          <h2>How to Climb the Ranks 🚀</h2>
          <ul>
            <li>Solve more problems to earn points</li>
            <li>Optimize your solutions for higher scores</li>
            <li>Participate regularly to maintain your rank</li>
            <li>Challenge yourself with harder problems</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default LeaderboardPage;
