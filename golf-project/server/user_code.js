function isPalindrome(s) {
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return s === s.split('').reverse().join('');
}