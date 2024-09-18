const fs = require('fs');

function capture_console(func) {
    return function(...args) {
        let oldConsoleLog = console.log;
        let output = "";
        console.log = function(message) {
            output += message + "\n";
        };
        const result = func(...args);
        console.log = oldConsoleLog;
        return { result, output };
    };
}

function run_user_code(user_code, inputs) {
    const func = new Function('return ' + user_code)();
    const wrapped_func = capture_console(func);
    return wrapped_func(...inputs);
}

function run_tests(test_cases) {
    // Read the user's code from the file
    const user_code = fs.readFileSync('user_code.js', 'utf8');

    const results = test_cases.map(test_case => {
        try {
            const inputs = test_case.inputs;
            const expected_output = test_case.expected_output;
            const { result: actual_output, output: printed_output } = run_user_code(user_code, inputs);
            
            const passed = JSON.stringify(actual_output) === JSON.stringify(expected_output);
            return {
                inputs,
                expected_output,
                actual_output,
                printed_output: printed_output.trim(),
                passed
            };
        } catch (e) {
            return {
                inputs: test_case.inputs,
                error: e.toString(),
                passed: false
            };
        }
    });
    
    console.log(JSON.stringify(results));
}

if (require.main === module) {
    const test_cases = JSON.parse(process.argv[2]);
    try {
        run_tests(test_cases);
    } catch (e) {
        console.log(JSON.stringify([{
            error: e.toString(),
            passed: false
        }]));
    }
}