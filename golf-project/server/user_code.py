def is_palindrome(s):
    # Remove non-alphanumeric characters and convert to lowercase
    cleaned_str = ''.join(char.lower() for char in s if char.isalnum())
    
    # Check if the cleaned string is equal to its reverse
    return cleaned_str == cleaned_str[::-1]
