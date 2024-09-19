import { ref, set, push, onValue, update } from "firebase/database";
import { database } from "./firebase"; // Ensure the path is correct

// Function to add data to the database
export const addData = (path, data) => {
  const dbRef = ref(database, path);
  return set(dbRef, data);
};

// Function to push data to a list in the database
export const pushData = (path, data) => {
  const dbRef = ref(database, path);
  return push(dbRef, data);
};

// Function to read data from the database
export const readData = (path, callback) => {
  const dbRef = ref(database, path);
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

// Function to update data in the database
export const updateData = (path, data) => {
  const dbRef = ref(database, path);
  return update(dbRef, data);
};
        