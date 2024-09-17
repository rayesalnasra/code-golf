import React, { useState, useEffect } from "react";
import { readData } from "./databaseUtils";

function LeaderboardPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users data from the database
    readData("users", (data) => {
      if (data) {
        // Convert the data object to an array of users
        const usersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        // Sort users by score in descending order
        usersArray.sort((a, b) => b.score - a.score);
        setUsers(usersArray);
      }
    });
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>Rank</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {index + 1}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {user.name}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {user.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderboardPage;
