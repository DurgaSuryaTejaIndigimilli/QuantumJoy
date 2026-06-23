// DevBreak Games - Game Logic for Software Employees
class DevBreakGames {
    constructor() {
        this.modal = document.getElementById('gameModal');
        this.gameContent = document.getElementById('gameContent');
        this.closeBtn = document.querySelector('.close');
        this.scoreBoard = document.getElementById('scoreBoard');
        this.scores = this.loadScores();
        
        this.initializeEventListeners();
        this.updateScoreDisplay();
    }

    initializeEventListeners() {
        // Game card clicks
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const gameType = card.dataset.game;
                this.openGame(gameType);
            });
        });

        // Modal close
        this.closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Score board toggle
        setTimeout(() => {
            this.scoreBoard.classList.add('show');
            setTimeout(() => this.scoreBoard.classList.remove('show'), 3000);
        }, 1000);
    }

    openGame(gameType) {
        this.modal.style.display = 'block';
        this.gameContent.innerHTML = '<div class="loading"></div>';
        
        setTimeout(() => {
            switch(gameType) {
                case 'memory': this.initMemoryGame(); break;
                case 'bughunt': this.initBugHuntGame(); break;
                case 'typing': this.initTypingGame(); break;
                case 'quiz': this.initQuizGame(); break;
                case 'stackoverflow': this.initStackOverflowGame(); break;
                case 'golf': this.initCodeGolfGame(); break;
            }
        }, 500);
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    // Memory Game - Programming Languages
    initMemoryGame() {
        const languages = ['🐍', '☕', '⚛️', '🦀', '💎', '🔥', '⚡', '🐘'];
        const languageNames = ['Python', 'Java', 'React', 'Rust', 'Ruby', 'Swift', 'JS', 'PHP'];
        
        let sequence = [];
        let playerSequence = [];
        let level = 1;
        let score = 0;
        let gameActive = false;

        this.gameContent.innerHTML = `
            <div class="game-container">
                <h2 class="game-title">🧠 Code Memory Challenge</h2>
                <div class="game-stats">
                    <div class="stat">
                        <div class="stat-label">Level</div>
                        <div class="stat-value" id="memoryLevel">1</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Score</div>
                        <div class="stat-value" id="memoryScore">0</div>
                    </div>
                </div>
                <div class="game-area">
                    <div class="memory-grid" id="memoryGrid"></div>
                    <div style="text-align: center; margin-top: 2rem;">
                        <button class="game-btn" id="startMemory">Start Game</button>
                        <p style="margin-top: 1rem; color: var(--text-secondary);">
                            Watch the sequence of programming languages and repeat it!
                        </p>
                    </div>
                </div>
            </div>
        `;

        const grid = document.getElementById('memoryGrid');
        languages.forEach((lang, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.innerHTML = `${lang}<br><small>${languageNames[index]}</small>`;
            card.dataset.index = index;
            grid.appendChild(card);
        });

        const cards = document.querySelectorAll('.memory-card');
        const startBtn = document.getElementById('startMemory');

        startBtn.addEventListener('click', startRound);

        function startRound() {
            if (gameActive) return;
            gameActive = true;
            playerSequence = [];
            
            // Add new step to sequence
            sequence.push(Math.floor(Math.random() * languages.length));
            
            // Show sequence
            showSequence();
        }

        function showSequence() {
            startBtn.textContent = 'Watch...';
            let i = 0;
            
            const interval = setInterval(() => {
                if (i < sequence.length) {
                    flashCard(sequence[i]);
                    i++;
                } else {
                    clearInterval(interval);
                    startBtn.textContent = 'Your Turn!';
                    enablePlayerInput();
                }
            }, 800);
        }

        function flashCard(index) {
            cards[index].classList.add('active');
            setTimeout(() => cards[index].classList.remove('active'), 400);
        }

        function enablePlayerInput() {
            cards.forEach(card => {
                card.addEventListener('click', handleCardClick);
            });
        }

        function handleCardClick(e) {
            if (!gameActive) return;
            
            const index = parseInt(e.currentTarget.dataset.index);
            playerSequence.push(index);
            flashCard(index);
            
            // Check if player is correct so far
            const currentStep = playerSequence.length - 1;
            if (playerSequence[currentStep] !== sequence[currentStep]) {
                gameOver();
                return;
            }
            
            // Check if sequence is complete
            if (playerSequence.length === sequence.length) {
                score += level * 10;
                level++;
                document.getElementById('memoryLevel').textContent = level;
                document.getElementById('memoryScore').textContent = score;
                
                gameActive = false;
                startBtn.textContent = `Level ${level} - Start`;
                
                // Remove event listeners
                cards.forEach(card => {
                    card.removeEventListener('click', handleCardClick);
                });
            }
        }

        function gameOver() {
            gameActive = false;
            startBtn.textContent = 'Game Over - Restart';
            alert(`Game Over! Final Score: ${score}\nLevel Reached: ${level}`);
            
            // Save score
            gameInstance.saveScore('memory', score);
            
            // Reset game
            sequence = [];
            level = 1;
            score = 0;
            document.getElementById('memoryLevel').textContent = level;
            document.getElementById('memoryScore').textContent = score;
            
            cards.forEach(card => {
                card.removeEventListener('click', handleCardClick);
            });
        }

        const gameInstance = this;
    }

    // Bug Hunt Game
    initBugHuntGame() {
        const buggyCode = [
            {
                code: `function calculateSum(a, b) {
    return a + b
}`,
                bugs: ['Missing semicolon on line 2'],
                fixed: `function calculateSum(a, b) {
    return a + b;
}`
            },
            {
                code: `for (let i = 0; i < 10; i++) {
    console.log("Number: " + i;
}`,
                bugs: ['Missing closing parenthesis on line 2'],
                fixed: `for (let i = 0; i < 10; i++) {
    console.log("Number: " + i);
}`
            },
            {
                code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2;
console.log(doubled);`,
                bugs: ['Missing closing parenthesis on line 2'],
                fixed: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled);`
            }
        ];

        let currentBug = 0;
        let score = 0;
        let timeLeft = 60;
        let timer;

        this.gameContent.innerHTML = `
            <div class="game-container">
                <h2 class="game-title">🐛 Bug Hunt</h2>
                <div class="game-stats">
                    <div class="stat">
                        <div class="stat-label">Bugs Fixed</div>
                        <div class="stat-value" id="bugsFixed">0</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Time Left</div>
                        <div class="stat-value" id="timeLeft">60</div>
                    </div>
                </div>
                <div class="game-area">
                    <h3>Find the bug in this code:</h3>
                    <div class="code-area" id="buggyCode"></div>
                    <textarea class="code-input" id="fixedCode" placeholder="Fix the code here..."></textarea>
                    <div style="text-align: center;">
                        <button class="game-btn" id="submitFix">Submit Fix</button>
                        <button class="game-btn" id="skipBug">Skip Bug</button>
                    </div>
                </div>
            </div>
        `;

        const codeDisplay = document.getElementById('buggyCode');
        const fixedCodeInput = document.getElementById('fixedCode');
        const submitBtn = document.getElementById('submitFix');
        const skipBtn = document.getElementById('skipBug');

        function loadBug() {
            if (currentBug >= buggyCode.length) {
                currentBug = 0; // Loop back to beginning
            }
            codeDisplay.textContent = buggyCode[currentBug].code;
            fixedCodeInput.value = '';
        }

        function startTimer() {
            timer = setInterval(() => {
                timeLeft--;
                document.getElementById('timeLeft').textContent = timeLeft;
                if (timeLeft <= 0) {
                    endGame();
                }
            }, 1000);
        }

        function checkFix() {
            const userFix = fixedCodeInput.value.trim();
            const correctFix = buggyCode[currentBug].fixed.trim();
            
            if (userFix === correctFix) {
                score++;
                document.getElementById('bugsFixed').textContent = score;
                alert('🎉 Bug fixed correctly!');
                nextBug();
            } else {
                alert('❌ Not quite right. Try again!');
            }
        }

        function nextBug() {
            currentBug++;
            loadBug();
        }

        function endGame() {
            clearInterval(timer);
            alert(`Time's up! You fixed ${score} bugs!`);
            this.saveScore('bughunt', score);
        }

        submitBtn.addEventListener('click', checkFix);
        skipBtn.addEventListener('click', nextBug);

        loadBug();
        startTimer();
    }

    // Typing Speed Game
    initTypingGame() {
        const codeSnippets = [
            "function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2); }",
            "const quickSort = arr => arr.length <= 1 ? arr : [...quickSort(arr.slice(1).filter(x => x < arr[0])), arr[0], ...quickSort(arr.slice(1).filter(x => x >= arr[0]))];",
            "class BinaryTree { constructor(val) { this.val = val; this.left = this.right = null; } }",
            "const isPalindrome = str => str === str.split('').reverse().join('');",
            "async function fetchData(url) { try { const response = await fetch(url); return await response.json(); } catch (error) { console.error(error); } }"
        ];

        let currentSnippet = '';
        let startTime = 0;
        let isTyping = false;

        this.gameContent.innerHTML = `
            <div class="game-container">
                <h2 class="game-title">⌨️ Code Typing Speed</h2>
                <div class="game-stats">
                    <div class="stat">
                        <div class="stat-label">WPM</div>
                        <div class="stat-value" id="wpm">0</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Accuracy</div>
                        <div class="stat-value" id="accuracy">100%</div>
                    </div>
                </div>
                <div class="game-area">
                    <h3>Type this code as fast as you can:</h3>
                    <div class="code-area" id="codeToType"></div>
                    <textarea class="code-input" id="typingInput" placeholder="Start typing here..."></textarea>
                    <div style="text-align: center;">
                        <button class="game-btn" id="newSnippet">New Code Snippet</button>
                    </div>
                </div>
            </div>
        `;

        const codeDisplay = document.getElementById('codeToType');
        const typingInput = document.getElementById('typingInput');
        const newSnippetBtn = document.getElementById('newSnippet');

        function loadNewSnippet() {
            currentSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
            codeDisplay.textContent = currentSnippet;
            typingInput.value = '';
            isTyping = false;
            document.getElementById('wpm').textContent = '0';
            document.getElementById('accuracy').textContent = '100%';
        }

        function calculateStats() {
            const typed = typingInput.value;
            const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
            
            // Calculate WPM
            const wordsTyped = typed.length / 5; // 5 characters = 1 word
            const wpm = Math.round(wordsTyped / timeElapsed) || 0;
            
            // Calculate accuracy
            let correct = 0;
            for (let i = 0; i < typed.length; i++) {
                if (typed[i] === currentSnippet[i]) correct++;
            }
            const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
            
            document.getElementById('wpm').textContent = wpm;
            document.getElementById('accuracy').textContent = accuracy + '%';
            
            // Check if completed
            if (typed === currentSnippet) {
                alert(`🎉 Completed! WPM: ${wpm}, Accuracy: ${accuracy}%`);
                this.saveScore('typing', wpm);
            }
        }

        typingInput.addEventListener('input', () => {
            if (!isTyping) {
                isTyping = true;
                startTime = Date.now();
            }
            calculateStats();
        });

        newSnippetBtn.addEventListener('click', loadNewSnippet);
        loadNewSnippet();
    }

    // Algorithm Quiz Game
    initQuizGame() {
        const questions = [
            {
                question: "What is the time complexity of binary search?",
                options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                correct: 1,
                explanation: "Binary search divides the search space in half each iteration."
            },
            {
                question: "Which data structure uses LIFO (Last In, First Out)?",
                options: ["Queue", "Stack", "Array", "Linked List"],
                correct: 1,
                explanation: "Stack follows LIFO principle - last element added is first to be removed."
            },
            {
                question: "What is the best case time complexity of QuickSort?",
                options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
                correct: 0,
                explanation: "QuickSort's best case is O(n log n) when pivot divides array evenly."
            },
            {
                question: "Which sorting algorithm is stable?",
                options: ["QuickSort", "HeapSort", "MergeSort", "Selection Sort"],
                correct: 2,
                explanation: "MergeSort maintains relative order of equal elements."
            },
            {
                question: "What does DFS stand for?",
                options: ["Data File System", "Depth-First Search", "Dynamic File Storage", "Direct Function Sort"],
                correct: 1,
                explanation: "DFS is a graph traversal algorithm that goes deep before wide."
            }
        ];

        let currentQuestion = 0;
        let score = 0;
        let answered = false;

        this.gameContent.innerHTML = `
            <div class="game-container">
                <h2 class="game-title">🤔 Algorithm Quiz</h2>
                <div class="game-stats">
                    <div class="stat">
                        <div class="stat-label">Question</div>
                        <div class="stat-value" id="questionNum">1/${questions.length}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Score</div>
                        <div class="stat-value" id="quizScore">0</div>
                    </div>
                </div>
                <div class="game-area">
                    <div class="quiz-question" id="question"></div>
                    <div class="quiz-options" id="options"></div>
                    <div style="text-align: center;">
                        <button class="game-btn" id="nextQuestion" style="display: none;">Next Question</button>
                    </div>
                    <div id="explanation" style="margin-top: 1rem; display: none; padding: 1rem; background: var(--card-bg); border-radius: 8px;"></div>
                </div>
            </div>
        `;

        function loadQuestion() {
            answered = false;
            const q = questions[currentQuestion];
            document.getElementById('question').textContent = q.question;
            document.getElementById('questionNum').textContent = `${currentQuestion + 1}/${questions.length}`;
            
            const optionsDiv = document.getElementById('options');
            optionsDiv.innerHTML = '';
            
            q.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option';
                optionDiv.textContent = option;
                optionDiv.addEventListener('click', () => selectOption(index));
                optionsDiv.appendChild(optionDiv);
            });

            document.getElementById('nextQuestion').style.display = 'none';
            document.getElementById('explanation').style.display = 'none';
        }

        function selectOption(selectedIndex) {
            if (answered) return;
            answered = true;

            const q = questions[currentQuestion];
            const options = document.querySelectorAll('.quiz-option');
            
            options[q.correct].classList.add('correct');
            if (selectedIndex !== q.correct) {
                options[selectedIndex].classList.add('incorrect');
            } else {
                score++;
                document.getElementById('quizScore').textContent = score;
            }

            // Show explanation
            document.getElementById('explanation').textContent = q.explanation;
            document.getElementById('explanation').style.display = 'block';

            // Show next button or finish
            if (currentQuestion < questions.length - 1) {
                document.getElementById('nextQuestion').style.display = 'inline-block';
            } else {
                setTimeout(() => {
                    alert(`Quiz completed! Score: ${score}/${questions.length}`);
                    this.saveScore('quiz', score);
                }, 1000);
            }
        }

        document.getElementById('nextQuestion').addEventListener('click', () => {
            currentQuestion++;
            loadQuestion();
        });

        loadQuestion();
    }

    // Stack Overflow Simulator
    initStackOverflowGame() {
        const questions = [
            {
                title: "How to reverse a string in JavaScript?",
                question: "I need to reverse a string. What's the most efficient way?",
                options: [
                    "str.split('').reverse().join('')",
                    "for loop with concatenation",
                    "Array.from(str).reverse().join('')",
                    "str.charAt() in reverse order"
                ],
                correct: 0,
                points: 10
            },
            {
                title: "What's the difference between == and === in JavaScript?",
                question: "I'm confused about equality operators. Can someone explain?",
                options: [
                    "== checks type, === checks value",
                    "=== checks both type and value, == only value",
                    "They're the same thing",
                    "== is deprecated"
                ],
                correct: 1,
                points: 15
            },
            {
                title: "How to remove duplicates from an array?",
                question: "I have an array with duplicate values. How to remove them?",
                options: [
                    "[...new Set(array)]",
                    "array.filter((item, index) => array.indexOf(item) === index)",
                    "array.reduce((acc, current) => acc.includes(current) ? acc : [...acc, current], [])",
                    "All of the above"
                ],
                correct: 3,
                points: 20
            }
        ];

        let currentQ = 0;
        let reputation = 0;

        this.gameContent.innerHTML = `
            <div class="game-container">
                <h2 class="game-title">📚 Stack Overflow Simulator</h2>
                <div class="game-stats">
                    <div class="stat">
                        <div class="stat-label">Reputation</div>
                        <div class="stat-value" id="reputation">0</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Questions Answered</div>
                        <div class="stat-value" id="questionsAnswered">0</div>
                    </div>
                </div>
                <div class="game-area">
                    <div id="questionCard" style="border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem;">
                        <h3 id="questionTitle" style="color: var(--accent-color); margin-bottom: 1rem;"></h3>
                        <p id="questionText" style="margin-bottom: 1.5rem;"></p>
                        <div id="answerOptions"></div>
                    </div>
                    <div style="text-align: center;">
                        <button class="game-btn" id="nextSOQuestion" style="display: none;">Next Question</button>
                    </div>
                </div>
            </div>
        `;

        function loadSOQuestion() {
            const q = questions[currentQ];
            document.getElementById('questionTitle').textContent = q.title;
            document.getElementById('questionText').textContent = q.question;
            
            const optionsDiv = document.getElementById('answerOptions');
            optionsDiv.innerHTML = '<h4 style="margin-bottom: 1rem;">Choose the best answer:</h4>';
            
            q.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option';
                optionDiv.textContent = option;
                optionDiv.addEventListener('click', () => answerSOQuestion(index, q));
                optionsDiv.appendChild(optionDiv);
            });

            document.getElementById('nextSOQuestion').style.display = 'none';
        }

        function answerSOQuestion(selectedIndex, question) {
            const options = document.querySelectorAll('.quiz-option');
            
            options[question.correct].classList.add('correct');
            if (selectedIndex !== question.correct) {
                options[selectedIndex].classList.add('incorrect');
            } else {
                reputation += question.points;
                document.getElementById('reputation').textContent = reputation;
            }

            document.getElementById('questionsAnswered').textContent = currentQ + 1;

            if (currentQ < questions.length - 1) {
                document.getElementById('nextSOQuestion').style.display = 'inline-block';
            } else {
                setTimeout(() => {
                    alert(`Great job! Final reputation: ${reputation} points`);
                    this.saveScore('stackoverflow', reputation);
                }, 1000);
            }
        }

        document.getElementById('nextSOQuestion').addEventListener('click', () => {
            currentQ++;
            loadSOQuestion();
        });

        loadSOQuestion();
    }

    // Code Golf Game
    initCodeGolfGame() {
        const challenges = [
            {
                title: "Sum of Array",
                description: "Write the shortest code to sum all numbers in an array",
                example: "Input: [1,2,3,4,5] → Output: 15",
                testCases: [
                    { input: "[1,2,3,4,5]", expected: "15" },
                    { input: "[10,20,30]", expected: "60" },
                    { input: "[]", expected: "0" }
                ],
                solution: "a=>a.reduce((s,n)=>s+n,0)"
            },
            {
                title: "Fibonacci Number",
                description: "Return the nth Fibonacci number",
                example: "Input: 6 → Output: 8 (0,1,1,2,3,5,8)",
                testCases: [
                    { input: "6", expected: "8" },
                    { input: "0", expected: "0" },
                    { input: "1", expected: "1" }
                ],
                solution: "f=n=>n<2?n:f(n-1)+f(n-2)"
            }
        ];

        let currentChallenge = 0;

        this.gameContent.innerHTML = `
            <div class="game-container">
                <h2 class="game-title">⛳ Code Golf</h2>
                <div class="game-stats">
                    <div class="stat">
                        <div class="stat-label">Characters Used</div>
                        <div class="stat-value" id="charCount">0</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Best Score</div>
                        <div class="stat-value" id="bestScore">∞</div>
                    </div>
                </div>
                <div class="game-area">
                    <h3 id="challengeTitle"></h3>
                    <p id="challengeDesc" style="margin-bottom: 1rem;"></p>
                    <p id="challengeExample" style="margin-bottom: 1rem; font-style: italic; color: var(--text-secondary);"></p>
                    <textarea class="code-input" id="golfCode" placeholder="Write your shortest code here..." style="height: 100px;"></textarea>
                    <div style="text-align: center;">
                        <button class="game-btn" id="testCode">Test Code</button>
                        <button class="game-btn" id="nextChallenge">Next Challenge</button>
                    </div>
                    <div id="testResults" style="margin-top: 1rem;"></div>
                </div>
            </div>
        `;

        function loadChallenge() {
            const challenge = challenges[currentChallenge];
            document.getElementById('challengeTitle').textContent = challenge.title;
            document.getElementById('challengeDesc').textContent = challenge.description;
            document.getElementById('challengeExample').textContent = challenge.example;
            document.getElementById('golfCode').value = '';
            document.getElementById('charCount').textContent = '0';
            document.getElementById('testResults').innerHTML = '';
        }

        document.getElementById('golfCode').addEventListener('input', (e) => {
            document.getElementById('charCount').textContent = e.target.value.length;
        });

        document.getElementById('testCode').addEventListener('click', () => {
            const code = document.getElementById('golfCode').value;
            const challenge = challenges[currentChallenge];
            
            try {
                // Create function from code
                const func = new Function('return ' + code)();
                let allPassed = true;
                let results = '<h4>Test Results:</h4>';
                
                challenge.testCases.forEach((test, index) => {
                    try {
                        const input = JSON.parse(test.input);
                        const result = Array.isArray(input) ? func(input) : func(input);
                        const passed = result.toString() === test.expected;
                        
                        results += `<div style="color: ${passed ? 'var(--success)' : 'var(--error)'};">
                            Test ${index + 1}: ${passed ? '✅' : '❌'} 
                            Input: ${test.input} → Output: ${result} 
                            ${passed ? '' : `(Expected: ${test.expected})`}
                        </div>`;
                        
                        if (!passed) allPassed = false;
                    } catch (e) {
                        results += `<div style="color: var(--error);">Test ${index + 1}: ❌ Error: ${e.message}</div>`;
                        allPassed = false;
                    }
                });
                
                if (allPassed) {
                    results += `<div style="color: var(--success); font-weight: bold; margin-top: 1rem;">
                        🎉 All tests passed! Code length: ${code.length} characters
                    </div>`;
                    
                    const bestScore = localStorage.getItem(`golf_${currentChallenge}`) || Infinity;
                    if (code.length < bestScore) {
                        localStorage.setItem(`golf_${currentChallenge}`, code.length);
                        document.getElementById('bestScore').textContent = code.length;
                        results += `<div style="color: var(--accent-color);">🏆 New best score!</div>`;
                    }
                }
                
                document.getElementById('testResults').innerHTML = results;
                
            } catch (e) {
                document.getElementById('testResults').innerHTML = 
                    `<div style="color: var(--error);">❌ Syntax Error: ${e.message}</div>`;
            }
        });

        document.getElementById('nextChallenge').addEventListener('click', () => {
            currentChallenge = (currentChallenge + 1) % challenges.length;
            loadChallenge();
        });

        loadChallenge();
    }

    // Score Management
    loadScores() {
        const saved = localStorage.getItem('devbreak_scores');
        return saved ? JSON.parse(saved) : {
            memory: 0,
            bughunt: 0,
            typing: 0,
            quiz: 0,
            stackoverflow: 0,
            golf: 0
        };
    }

    saveScore(game, score) {
        if (score > this.scores[game]) {
            this.scores[game] = score;
            localStorage.setItem('devbreak_scores', JSON.stringify(this.scores));
            this.updateScoreDisplay();
        }
    }

    updateScoreDisplay() {
        const scoresDiv = document.getElementById('scores');
        const gameNames = {
            memory: 'Memory 🧠',
            bughunt: 'Bug Hunt 🐛',
            typing: 'Typing ⌨️',
            quiz: 'Quiz 🤔',
            stackoverflow: 'Stack Overflow 📚',
            golf: 'Code Golf ⛳'
        };

        scoresDiv.innerHTML = Object.entries(this.scores)
            .map(([game, score]) => `
                <div class="score-item">
                    <span>${gameNames[game]}</span>
                    <span>${score}</span>
                </div>
            `).join('');
    }
}

// Initialize games when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DevBreakGames();
}); 