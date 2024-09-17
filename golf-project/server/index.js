import fs from 'fs';
import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { getTestCases } from './firebase.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/python', async (req, res) => { 
    const { code, problem } = req.body;

    try {
        // Get test cases from Firebase for the specific problem
        const testCases = await getTestCases(problem);
        console.log('Fetched test cases:', testCases);

        if (!testCases || testCases.length === 0) {
            throw new Error('No test cases fetched for the selected problem');
        }

        // Write the user's code to a file
        fs.writeFileSync('user_code.py', code);

        // Execute the Python script using child_process.exec
        exec(`python3 test.py '${JSON.stringify(testCases)}'`, (error, stdout, stderr) => {
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
    console.log(`Example app listening on port ${port}`);
});