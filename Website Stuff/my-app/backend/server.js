const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./config/login-auth-8e5a9-firebase-adminsdk-7i2ko-d75e01914c.json');
/********************************************************************
*   Ensure that the API Keys are not uploaded on GitHub!            *
*   If they are inform the individual responsible for the mistake   *
********************************************************************/


// --- Initialize Firebase Admin SDK ---
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = 3001; // Port 3001 is used as another server is likely to be running on Port 3000

// --- Middleware ---
// Used as this helps with handling JSON and URL-encoded data
// Simplifies handling form submissions and API Requests
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

// --- API Routes ---

    // --- Login ---
    // Verify Tokens Server Side 
    app.post('/api/login', (req, res) => {
        const { token } = req.body;

        admin.auth().verifyIdToken(token) // Checks if the tokens are valid
        .then((decodedToken) => {
            res.status(200).json({ message: 'Logged in successfully' });
            // Allows user to go to /home
        })
        .catch((error) => {
            console.error('Token verification error:', error);
            res.status(401).json({ error: 'Invalid token' });
            // Invalid Token - Prevent user from going to /home
        });
    });

    // --- Register ---
    // Creates user Server Side
    app.post('/api/register', (req, res) => {
        const { email, password, username } = req.body;

        admin.auth().createUser({
            email: email,
            password: password,
            displayName: username,
            // Create User with set Data
        })
        .then((userRecord) => admin.auth().createCustomToken(userRecord.uid)) // Create Token that Login can use to verify
        .then((token) => {
            res.status(200).json({ message: 'Registered and logged in successfully' });
            // Allows user to go to /home
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
            // Error in creating the Account - Prevent user from going to /home
        });
    });

// --- Serve React App ---
// Allows backend  to serve both API and frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));

// React's index.html is served for unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
