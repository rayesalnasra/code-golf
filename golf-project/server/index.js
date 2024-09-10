import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { exec } from 'child_process';
import { getTestCases } from './firebase.js';

// Create an instance of an Express application
const app = express();

// Define the port number for the server
const port = 80;

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Use middleware to parse incoming JSON requests
app.use(express.json());

// Python template to wrap user code and add test functionality
const pythonTemplate = `
import sys
import json
import traceback

def capture_print(func):
    from io import StringIO
    import sys

    def wrapper(*args, **kwargs):
        old_stdout = sys.stdout
        sys.stdout = StringIO()
        try:
            result = func(*args, **kwargs)
            printed_output = sys.stdout.getvalue()
            return result, printed_output
        finally:
            sys.stdout = old_stdout

    return wrapper

@capture_print
def run_user_code(user_code, inputs):
    # Create a new namespace to execute the user's code
    namespace = {}
    exec(user_code, namespace)
    
    # Find the user-defined function
    user_functions = [obj for name, obj in namespace.items() if callable(obj)]
    
    if not user_functions:
        print("Error: No function defined")
        return None
    
    user_function = user_functions[0]  # Take the first function defined
    return user_function(*inputs)

def run_tests(test_cases, user_code):
    results = []
    for test_case in test_cases:
        try:
            inputs = test_case['inputs']
            expected_output = test_case['expected_output']
            actual_output, printed_output = run_user_code(user_code, inputs)
            
            passed = actual_output == expected_output
            results.append({
                'inputs': inputs,
                'expected_output': expected_output,
                'actual_output': actual_output,
                'printed_output': printed_output,
                'passed': passed
            })
        except Exception as e:
            results.append({
                'inputs': inputs,
                'error': str(e),
                'traceback': traceback.format_exc(),
                'passed': False
            })
    
    print(json.dumps(results))

if __name__ == "__main__":
    test_cases = json.loads(sys.argv[1])
    user_code = sys.argv[2]
    try:
        run_tests(test_cases, user_code)
    except Exception as e:
        print(json.dumps([{
            'error': str(e),
            'traceback': traceback.format_exc(),
            'passed': False
        }]))
`;

// Handle POST requests to /python
app.post('/python', async (req, res) => { 
    const userCode = req.body.code;

    try {
        // Get test cases from Firebase
        const testCases = await getTestCases();
        console.log('Fetched test cases:', testCases);

        if (!testCases || testCases.length === 0) {
            throw new Error('No test cases fetched');
        }

        // Write the Python template to a file
        fs.writeFileSync('test.py', pythonTemplate);

        // Execute the Python script using child_process.exec
        exec(`python3 test.py '${JSON.stringify(testCases)}' '${userCode.replace(/'/g, "\\'")}'`, (error, stdout, stderr) => {
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

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
