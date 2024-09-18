import fs from 'fs';
import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { getTestCases } from './firebase.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/run-code', async (req, res) => { 
    const { code, problem, language, testCases } = req.body;

    try {
        if (!testCases || testCases.length === 0) {
            throw new Error('No test cases fetched for the selected problem');
        }

        let fileName, command;
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
            try {
                results = JSON.parse(stdout);
            } catch (e) {
                console.error('Error parsing stdout:', e);
                console.error('stdout:', stdout);
                results = [{ error: 'Failed to parse test results', stdout: stdout, passed: false }];
            }

            const allPassed = results.every(result => result.passed);
            
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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});