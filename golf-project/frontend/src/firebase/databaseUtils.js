import { ref, set, push, onValue, update, remove } from "firebase/database";
import { database } from "./firebase"; // Ensure the path is correct

// Function to add data to the database
export const addData = (path, data) => {
  const dbRef = ref(database, path);
  return set(dbRef, data);
};

// Function to remove data from the database
export const removeData = (path) => {
  const dbRef = ref(database, path);
  return remove(dbRef);
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


// Function to read data from the database
export const readProfileData = async (path) => {
  const dbRef = ref(database, path);
  
  return new Promise((resolve, reject) => {
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        resolve(data);
      } else {
        resolve(null); // Resolve with null if no data is found
      }
    }, (error) => {
      reject(error);
    });
  });
};


// Function to update data in the database
export const updateData = (path, data) => {
  const dbRef = ref(database, path);
  return update(dbRef, data);
};
        
