export const premadeQuizzes = {
    python: {
      id: 'python',
      title: "Python Basics Quiz",
      createdAt: new Date('2024-01-01').toISOString(),
      isPremade: true,
      questions: [
        {
          questionText: "Which of the following are valid ways to create a list in Python?",
          questionType: "select-all-that-apply",
          answers: [
            "```python\nmy_list = []\n```",
            "```python\nmy_list = list()\n```",
            "```python\nmy_list = {}\n```",
            "```python\nmy_list = (1, 2, 3)\n```"
          ],
          correctAnswers: [true, true, false, false],
        },
        {
          questionText: "What is the output of the following code?\n```python\nx = [1, 2, 3]\nprint(x[1])\n```",
          questionType: "multiple-choice",
          answers: ["1", "2", "3", "IndexError"],
          correctAnswers: [false, true, false, false],
        },
        {
          questionText: "Which keyword is used to define a function in Python?",
          questionType: "multiple-choice",
          answers: ["def", "func", "lambda", "define"],
          correctAnswers: [true, false, false, false],
        },
        {
          questionText: "What is the correct way to handle exceptions in Python?",
          questionType: "multiple-choice",
          answers: [
            "```python\ntry:\n    x = 1 / 0\nexcept ZeroDivisionError:\n    print('Division by zero!')\n```",
            "```python\ncatch ZeroDivisionError:\n    print('Division by zero!')\n```",
            "```python\nif x == 0:\n    print('Division by zero!')\n```",
            "None of the above"
          ],
          correctAnswers: [true, false, false, false],
        },
        {
          questionText: "What will be the output of the following code?\n```python\nprint(len('Hello'))\n```",
          questionType: "multiple-choice",
          answers: ["5", "4", "6", "Hello"],
          correctAnswers: [true, false, false, false],
        },
        {
          questionText: "Which of the following methods can be used to add an element to a list?",
          questionType: "select-all-that-apply",
          answers: [
            "```python\nlist.append(item)\n```",
            "```python\nlist.add(item)\n```",
            "```python\nlist.insert(index, item)\n```",
            "```python\nlist.extend(iterable)\n```"
          ],
          correctAnswers: [true, false, true, true],
        },
        {
          questionText: "What is the output of the following code?\n```python\nprint('Hello' + ' ' + 'World')\n```",
          questionType: "multiple-choice",
          answers: ["HelloWorld", "Hello World", "SyntaxError", "None of the above"],
          correctAnswers: [false, true, false, false],
        },
        {
          questionText: "What does the 'pass' statement do in Python?",
          questionType: "multiple-choice",
          answers: [
            "It ends the program.",
            "It does nothing.",
            "It raises an exception.",
            "None of the above."
          ],
          correctAnswers: [false, true, false, false],
        },
        {
          questionText: "Which of the following data types is immutable in Python?",
          questionType: "multiple-choice",
          answers: ["List", "Dictionary", "Tuple", "Set"],
          correctAnswers: [false, false, true, false],
        },
        {
          questionText: "How do you create a comment in Python?",
          questionType: "multiple-choice",
          answers: [
            "`// This is a comment`",
            "`# This is a comment`",
            "`/* This is a comment */`",
            "`<!-- This is a comment -->`"
          ],
          correctAnswers: [false, true, false, false],
        },
      ],
    },
    javascript: {
      id: 'javascript',
      title: "JavaScript Basics Quiz",
      createdAt: new Date('2024-01-01').toISOString(),
      isPremade: true,
      questions: [
        {
          questionText: "Which of the following are valid ways to declare a variable in JavaScript?",
          questionType: "select-all-that-apply",
          answers: [
            "```js\nvar x = 10;\n```",
            "```js\nlet x = 10;\n```",
            "```js\nconst x = 10;\n```",
            "```js\nint x = 10;\n```"
          ],
          correctAnswers: [true, true, true, false],
        },
        {
          questionText: "What will be the output of the following code?\n```js\nconsole.log(typeof null);\n```",
          questionType: "multiple-choice",
          answers: ["'null'", "'object'", "'undefined'", "'number'"],
          correctAnswers: [false, true, false, false],
        },
        {
          questionText: "Which keyword is used to define a function in JavaScript?",
          questionType: "multiple-choice",
          answers: ["function", "def", "func", "lambda"],
          correctAnswers: [true, false, false, false],
        },
        {
          questionText: "What will be the output of the following code?\n```js\nconsole.log(0.1 + 0.2 === 0.3);\n```",
          questionType: "multiple-choice",
          answers: ["true", "false"],
          correctAnswers: [false, true],
        },
        {
          questionText: "Which of the following is not a primitive data type in JavaScript?",
          questionType: "multiple-choice",
          answers: ["String", "Number", "Object", "Array"],
          correctAnswers: [false, false, false, true],
        },
        {
          questionText: "What does '===' mean in JavaScript?",
          questionType: "multiple-choice",
          answers: [
            "Strict equality comparison",
            "Assignment",
            "Loose equality comparison",
            "None of the above"
          ],
          correctAnswers: [true, false, false, false],
        },
        {
          questionText: "What will be the output of the following code?\n```js\nconsole.log('5' + 5);\n```",
          questionType: "multiple-choice",
          answers: ["10", "'55'", "'5'", "SyntaxError"],
          correctAnswers: [false, true, false, false],
        },
        {
          questionText: "Which of the following is a correct way to create an array?",
          questionType: "select-all-that-apply",
          answers: [
            "```js\nlet arr = [];\n```",
            "```js\nlet arr = new Array();\n```",
            "```js\nlet arr = [1, 2, 3];\n```",
            "```js\nlet arr = (1, 2, 3);\n```"
          ],
          correctAnswers: [true, true, true, false],
        },
        {
          questionText: "How can you add a comment in JavaScript?",
          questionType: "multiple-choice",
          answers: [
            "`// This is a comment`",
            "`# This is a comment`",
            "`<!-- This is a comment -->`",
            "`/* This is a comment */`"
          ],
          correctAnswers: [true, false, false, true],
        },
        {
          questionText: "What is the purpose of the 'this' keyword in JavaScript?",
          questionType: "multiple-choice",
          answers: [
            "It refers to the global object.",
            "It refers to the calling object.",
            "It refers to the parent object.",
            "None of the above."
          ],
          correctAnswers: [false, true, false, false],
        },
      ],
    },
  };
  
  // Convert the premadeQuizzes object into a list of quizzes
  export const premadeQuizzesList = Object.values(premadeQuizzes);
  