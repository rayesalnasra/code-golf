import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { exec } from 'child_process';

// Create an instance of an Express application
const app = express();

// Define the port number for the server
const port = 80;

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Use middleware to parse incoming JSON requests
app.use(express.json());

// Python template to wrap user code for testing
const pythonTemplate = `
import sys
import inspect
import traceback

{user_code}

def run_tests():
    # Find the user-defined function in the code
    user_functions = [obj for name, obj in inspect.getmembers(sys.modules[__name__]) 
                      if inspect.isfunction(obj) and obj.__module__ == __name__]
    
    if not user_functions:
        print("Error: No function defined")
        return
    
    user_function = user_functions[0]  # Use the first defined function
    
    a, b = 2, 3
    expected_result = 5
    
    try:
        # Execute the user-defined function and check results
        actual_result = user_function(a, b)
        print(f"Test input: a={a}, b={b}")
        print(f"Expected output: {expected_result}")
        print(f"Actual output: {actual_result}")
        print(f"Test {'passed' if actual_result == expected_result else 'failed'}")
    except Exception as e:
        print(f"Error during function execution: {str(e)}")
        print(traceback.format_exc())

if __name__ == "__main__":
    try:
        run_tests()
    except SyntaxError as e:
        print(f"Syntax Error: {str(e)}")
        print(traceback.format_exc())
    except Exception as e:
        print(f"Unexpected Error: {str(e)}")
        print(traceback.format_exc())
`;

// Handle POST requests to /python
app.post('/python', (req, res) => { 
    // Extract user code from the request body
    const userCode = req.body.code;

    // Combine the user code with the Python template
    const finalCode = pythonTemplate.replace('{user_code}', userCode);

    // Write the combined code to a Python file
    fs.writeFileSync('test.py', finalCode);

    // Send a response back indicating the file has been written
    res.send('Python code has been written to test.py');
});

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
