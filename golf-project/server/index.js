import fs from 'fs'; // File system operations
import express from 'express'; // Web framework
import cors from 'cors'; // CORS middleware
import { exec } from 'child_process'; // To execute shell commands
import { getTestCases } from './firebase.js'; // Importing function to fetch test cases

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

app.post('/run-code', async (req, res) => { 
    const { code, problem, language, testCases } = req.body;

    try {
        // Check if test cases are provided
        if (!testCases || testCases.length === 0) {
            throw new Error('No test cases fetched for the selected problem');
        }

        let fileName, command;
        // Determine the file name and command based on the programming language
        if (language === 'python') {
            fileName = 'user_code.py';
            command = `python3 test.py '${JSON.stringify(testCases)}'`;
        } else if (language === 'javascript') {
            fileName = 'user_code.js';
            command = `node test.js '${JSON.stringify(testCases)}'`;
        } else {
            throw new Error('Unsupported language');
        }

        // Write the user's code to a file
        fs.writeFileSync(fileName, code);

        // Execute the script using child_process.exec
        exec(command, (error, stdout, stderr) => {
            let results;
            // Try to parse the output from the executed command
            try {
                results = JSON.parse(stdout);
            } catch (e) {
                console.error('Error parsing stdout:', e);
                console.error('stdout:', stdout);
                results = [{ error: 'Failed to parse test results', stdout: stdout, passed: false }];
            }

            const allPassed = results.every(result => result.passed);
            
            // Respond with the results and overall pass/fail status
            res.json({ 
                results: results,
                passOrFail: allPassed ? 'passed' : 'failed'
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'An error occurred while processing your request: ' + error.message,
            passOrFail: 'failed'
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
