import React, { useState, useEffect } from "react";
import { readData } from "../firebase/databaseUtils";
import "./LeaderboardPage.css";

function LeaderboardPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    readData("users", (data) => {
      if (data) {
        const usersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        usersArray.sort((a, b) => b.score - a.score);
        setUsers(usersArray);
      }
    });
  }, []);

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
                  <td>{index + 1}</td>
                  <td>{user.displayName}</td>
                  <td>{user.score}</td>
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