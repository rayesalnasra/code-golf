
import sys
import inspect
import traceback

print("hello world")

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
