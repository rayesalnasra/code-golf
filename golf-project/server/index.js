import express from 'express';
import cors from 'cors';

// Create an instance of an Express application
const app = express();

// Define the port number for the server
const port = 80;

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Use middleware to parse incoming JSON requests
app.use(express.json());

// Define a POST endpoint to receive Python code
app.post('/python', (req, res) => { 
    // Extract the code from the request body
    const userCode = req.body.code;
    
    // Send a response back with the received code
    res.send(`Received code: ${userCode}`);
});

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
