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

def run_tests(test_cases):
    # Read the user's code from the file
    with open('user_code.py', 'r') as file:
        user_code = file.read()

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
    try:
        run_tests(test_cases)
    except Exception as e:
        print(json.dumps([{
            'error': str(e),
            'traceback': traceback.format_exc(),
            'passed': False
        }]))