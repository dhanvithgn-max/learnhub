// App State
let state = {
    currentPage: 'home',
    currentSubject: null,
    currentLesson: null,
    currentQuestionIndex: 0,
    score: 0,
    grade: parseInt(localStorage.getItem('grade')) || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    progress: JSON.parse(localStorage.getItem('progress')) || {
        math: { completed: 0, total: 24, score: 0 },
        science: { completed: 0, total: 20, score: 0 },
        english: { completed: 0, total: 22, score: 0 },
        social: { completed: 0, total: 18, score: 0 }
    },
    activity: JSON.parse(localStorage.getItem('activity')) || [],
    streak: parseInt(localStorage.getItem('streak')) || 0,
    points: parseInt(localStorage.getItem('points')) || 0,
    lastVisit: localStorage.getItem('lastVisit'),
    completedLessons: JSON.parse(localStorage.getItem('completedLessons')) || {},
    currentShuffledQuestions: null
};

// Sign In/Up Functions
function showSignInModal() {
    document.getElementById('signin-modal').style.display = 'flex';
}

function closeSignInModal() {
    document.getElementById('signin-modal').style.display = 'none';
}

function showSignUpModal() {
    document.getElementById('signup-modal').style.display = 'flex';
}

function closeSignUpModal() {
    document.getElementById('signup-modal').style.display = 'none';
}

function switchToSignUp() {
    closeSignInModal();
    showSignUpModal();
}

function switchToSignIn() {
    closeSignUpModal();
    showSignInModal();
}

function handleSignUp(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Get existing users or create empty array
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        alert('Account already exists! Please sign in.');
        return;
    }
    
    // Create new user
    const user = { name, email, password };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto sign in
    state.user = user;
    localStorage.setItem('user', JSON.stringify(user));
    
    updateUserUI();
    closeSignUpModal();
    showGradeModal();
    alert('Account created successfully! Welcome to LearnHub!');
}

function handleSignIn(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    
    // Get users
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        updateUserUI();
        closeSignInModal();
        alert('Welcome back, ' + user.name + '!');
    } else {
        alert('Invalid email or password!');
    }
}

function handleSignOut() {
    state.user = null;
    localStorage.removeItem('user');
    updateUserUI();
    closeProfileModal();
}

function updateUserUI() {
    if (state.user) {
        document.getElementById('btn-signin').style.display = 'none';
        document.getElementById('btn-signup').style.display = 'none';
        document.getElementById('user-name').style.display = 'inline-block';
        document.getElementById('user-name').textContent = state.user.name.split(' ')[0];
    } else {
        document.getElementById('btn-signin').style.display = 'inline-block';
        document.getElementById('btn-signup').style.display = 'inline-block';
        document.getElementById('user-name').style.display = 'none';
    }
}

function showProfile() {
    if (state.user) {
        document.getElementById('profile-name').textContent = state.user.name;
        document.getElementById('profile-email').textContent = state.user.email;
        document.getElementById('profile-points').textContent = state.points;
        document.getElementById('profile-streak').textContent = state.streak;
        
        let totalLessons = 0;
        Object.values(state.progress).forEach(p => totalLessons += p.completed);
        document.getElementById('profile-lessons').textContent = totalLessons;
        
        document.getElementById('profile-modal').style.display = 'flex';
    }
}

function closeProfileModal() {
    document.getElementById('profile-modal').style.display = 'none';
}

// Grade Selection Functions
function showGradeModal() {
    document.getElementById('grade-modal').style.display = 'flex';
    // Highlight current grade if selected
    if (state.grade) {
        document.querySelectorAll('.grade-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.textContent === `Class ${state.grade}`) {
                btn.classList.add('selected');
            }
        });
    }
}

function closeGradeModal() {
    document.getElementById('grade-modal').style.display = 'none';
}

function selectGrade(grade) {
    state.grade = grade;
    localStorage.setItem('grade', grade);
    
    // Update UI
    document.getElementById('current-grade-display').textContent = grade;
    document.getElementById('grade-badge').style.display = 'inline-block';
    
    // Update hero text
    document.querySelector('.hero-subtitle').textContent = 
        `Your personal tutor for Class ${grade} subjects. Learn by doing with interactive lessons that make concepts click.`;
    
    // Load grade-specific content
    loadGradeContent(grade);
    
    closeGradeModal();
}

function loadGradeContent(grade) {
    // Load questions based on grade
    // For now, we have 4th standard content
    // We can add more grades later
    console.log(`Loading content for Class ${grade}`);
}

// Get today's date string
function getToday() {
    return new Date().toISOString().split('T')[0];
}

// Check if lesson was completed today
function isLessonCompletedToday(subject, lessonIndex) {
    const key = `${subject}_${lessonIndex}`;
    return state.completedLessons[key] === getToday();
}

// Mark lesson as completed today
function markLessonCompleted(subject, lessonIndex) {
    const key = `${subject}_${lessonIndex}`;
    state.completedLessons[key] = getToday();
    localStorage.setItem('completedLessons', JSON.stringify(state.completedLessons));
}

// Lessons Data - Grade Specific
const gradeLessons = {
    1: {
        math: [
            {
                title: "Counting & Numbers",
                questions: [
                    { type: "math", question: "How many apples? 🍎🍎🍎🍎🍎", options: ["5", "4", "6", "3"], correct: 0, explanation: "Count the apples: 1, 2, 3, 4, 5. There are 5 apples." },
                    { type: "math", question: "What number comes after 7?", options: ["8", "6", "9", "5"], correct: 0, explanation: "After 7 comes 8. Count: 5, 6, 7, 8..." },
                    { type: "math", question: "Which is bigger: 5 or 3?", options: ["5", "3", "Both same", "Neither"], correct: 0, explanation: "5 is bigger than 3. 5 comes after 3 when counting." },
                    { type: "math", question: "Count: 1, 2, 3, ___. What comes next?", options: ["4", "5", "2", "6"], correct: 0, explanation: "After 3 comes 4. We count in order: 1, 2, 3, 4." },
                    { type: "math", question: "How many fingers on one hand?", options: ["5", "4", "6", "10"], correct: 0, explanation: "One hand has 5 fingers. Count them: 1, 2, 3, 4, 5." }
                ]
            },
            {
                title: "Simple Addition",
                questions: [
                    { type: "math", question: "1 + 1 = ?", options: ["2", "3", "1", "0"], correct: 0, explanation: "When you add 1 to 1, you get 2." },
                    { type: "math", question: "2 + 3 = ?", options: ["5", "4", "6", "7"], correct: 0, explanation: "Count: 2, then count 3 more: 3, 4, 5. The answer is 5." },
                    { type: "math", question: "4 + 1 = ?", options: ["5", "6", "3", "4"], correct: 0, explanation: "4 plus 1 more equals 5." },
                    { type: "math", question: "3 + 2 = ?", options: ["5", "4", "6", "7"], correct: 0, explanation: "3 plus 2 more equals 5." },
                    { type: "math", question: "0 + 5 = ?", options: ["5", "0", "10", "25"], correct: 0, explanation: "Adding 0 to any number gives you that number. 0 + 5 = 5." }
                ]
            },
            {
                title: "Simple Subtraction",
                questions: [
                    { type: "math", question: "5 - 2 = ?", options: ["3", "4", "2", "7"], correct: 0, explanation: "Take away 2 from 5: 5, 4, 3. The answer is 3." },
                    { type: "math", question: "4 - 1 = ?", options: ["3", "5", "2", "4"], correct: 0, explanation: "4 minus 1 equals 3." },
                    { type: "math", question: "6 - 3 = ?", options: ["3", "4", "2", "9"], correct: 0, explanation: "6 minus 3 equals 3." },
                    { type: "math", question: "7 - 7 = ?", options: ["0", "7", "14", "1"], correct: 0, explanation: "When you take away all of something, you have 0 left." },
                    { type: "math", question: "10 - 5 = ?", options: ["5", "15", "2", "50"], correct: 0, explanation: "10 minus 5 equals 5." }
                ]
            }
        ],
        science: [
            {
                title: "My Body",
                questions: [
                    { type: "science", question: "How many eyes do you have?", options: ["2", "1", "3", "4"], correct: 0, explanation: "Humans have 2 eyes to see with." },
                    { type: "science", question: "Which body part helps you hear?", options: ["Ears", "Eyes", "Nose", "Mouth"], correct: 0, explanation: "Ears help us hear sounds." },
                    { type: "science", question: "What do we use to smell?", options: ["Nose", "Ears", "Eyes", "Hands"], correct: 0, explanation: "We use our nose to smell things." },
                    { type: "science", question: "Which part helps you walk?", options: ["Legs", "Arms", "Head", "Stomach"], correct: 0, explanation: "We use our legs to walk and run." },
                    { type: "science", question: "What does your heart do?", options: ["Pumps blood", "Helps you see", "Helps you hear", "Helps you eat"], correct: 0, explanation: "Your heart pumps blood through your body." }
                ]
            },
            {
                title: "Animals Around Us",
                questions: [
                    { type: "science", question: "Which animal says 'moo'?", options: ["Cow", "Cat", "Dog", "Bird"], correct: 0, explanation: "Cows say 'moo'. They give us milk." },
                    { type: "science", question: "Which animal can fly?", options: ["Bird", "Fish", "Dog", "Cat"], correct: 0, explanation: "Birds can fly in the sky with their wings." },
                    { type: "science", question: "Which is a pet animal?", options: ["Dog", "Lion", "Tiger", "Elephant"], correct: 0, explanation: "Dogs are friendly animals that live with us as pets." },
                    { type: "science", question: "Where do fish live?", options: ["Water", "Land", "Sky", "Trees"], correct: 0, explanation: "Fish live in water. They breathe underwater." },
                    { type: "science", question: "Which animal is the biggest?", options: ["Elephant", "Cat", "Dog", "Rabbit"], correct: 0, explanation: "Elephants are the biggest land animals." }
                ]
            }
        ],
        english: [
            {
                title: "My First Words",
                questions: [
                    { type: "english", question: "Which is a letter?", options: ["A", "1", "!", "."], correct: 0, explanation: "'A' is a letter of the alphabet. Letters make words." },
                    { type: "english", question: "How many vowels are there?", options: ["5", "3", "7", "10"], correct: 0, explanation: "There are 5 vowels: A, E, I, O, U." },
                    { type: "english", question: "Which word is a color?", options: ["Red", "Run", "Big", "Cat"], correct: 0, explanation: "Red is a color. It's the color of apples and roses." },
                    { type: "english", question: "What is the first letter of 'cat'?", options: ["C", "A", "T", "K"], correct: 0, explanation: "The first letter of 'cat' is C." },
                    { type: "english", question: "Which is a word for a baby dog?", options: ["Puppy", "Kitten", "Calf", "Foal"], correct: 0, explanation: "A baby dog is called a puppy." }
                ]
            },
            {
                title: "Reading Fun",
                questions: [
                    { type: "english", question: "Which word means the opposite of 'big'?", options: ["Small", "Tall", "Fast", "Hot"], correct: 0, explanation: "Small is the opposite of big. Big things are large, small things are little." },
                    { type: "english", question: "Which is a sentence?", options: ["I like cats.", "Cat.", "Big.", "Run."], correct: 0, explanation: "A sentence has a subject and a verb. 'I like cats' tells us something complete." },
                    { type: "english", question: "What goes at the end of a sentence?", options: ["Period (.)", "Comma (,)", "Question mark (?)", "Exclamation (!)"], correct: 0, explanation: "A period goes at the end of a statement." },
                    { type: "english", question: "Which word starts with a capital letter?", options: ["India", "apple", "school", "happy"], correct: 0, explanation: "Country names like 'India' always start with a capital letter." },
                    { type: "english", question: "How do you spell 'dog'?", options: ["D-O-G", "D-O-C", "B-O-G", "D-A-G"], correct: 0, explanation: "Dog is spelled D-O-G." }
                ]
            }
        ],
        social: [
            {
                title: "My Family & Home",
                questions: [
                    { type: "social", question: "Who cooks food in your home?", options: ["Mother/Father/Both", "Teacher", "Doctor", "Pilot"], correct: 0, explanation: "In most homes, parents cook food for the family." },
                    { type: "social", question: "Where do we sleep?", options: ["Bedroom", "Kitchen", "Bathroom", "Garden"], correct: 0, explanation: "We sleep in the bedroom on a bed." },
                    { type: "social", question: "Who teaches us in school?", options: ["Teacher", "Doctor", "Pilot", "Farmer"], correct: 0, explanation: "Teachers teach us in school." },
                    { type: "social", question: "Which is our national flag?", options: ["Tricolor", "Red flag", "Blue flag", "Yellow flag"], correct: 0, explanation: "India's flag is the Tricolor with saffron, white, and green." },
                    { type: "social", question: "Where do we buy vegetables?", options: ["Market", "Hospital", "School", "Temple"], correct: 0, explanation: "We buy vegetables from the market." }
                ]
            }
        ]
    },
    2: {
        math: [
            {
                title: "Numbers up to 100",
                questions: [
                    { type: "math", question: "What is 23 + 15?", options: ["38", "37", "39", "48"], correct: 0, explanation: "23 + 15: Add ones: 3+5=8, Add tens: 2+1=3. Answer: 38." },
                    { type: "math", question: "What is 45 - 12?", options: ["33", "34", "32", "57"], correct: 0, explanation: "45 - 12: Subtract ones: 5-2=3, Subtract tens: 4-1=3. Answer: 33." },
                    { type: "math", question: "Which number has 4 in tens place?", options: ["54", "45", "40", "14"], correct: 0, explanation: "In 54, the digit 4 is in the tens place." },
                    { type: "math", question: "Count by 5s: 5, 10, 15, ___", options: ["20", "25", "30", "18"], correct: 0, explanation: "Counting by 5s: 5, 10, 15, 20, 25..." },
                    { type: "math", question: "What is 6 × 2?", options: ["12", "14", "8", "10"], correct: 0, explanation: "6 × 2 means 6 groups of 2, which equals 12." }
                ]
            },
            {
                title: "Shapes & Patterns",
                questions: [
                    { type: "math", question: "How many corners does a square have?", options: ["4", "3", "5", "6"], correct: 0, explanation: "A square has 4 corners (also called vertices)." },
                    { type: "math", question: "Which shape is round?", options: ["Circle", "Square", "Triangle", "Rectangle"], correct: 0, explanation: "A circle is perfectly round with no corners." },
                    { type: "math", question: "What comes next: 🔴🔵🔴🔵___", options: ["🔴", "🔵", "🟢", "🟡"], correct: 0, explanation: "The pattern alternates red, blue. After blue comes red." },
                    { type: "math", question: "How many sides does a triangle have?", options: ["3", "4", "5", "6"], correct: 0, explanation: "A triangle has 3 sides. 'Tri' means three." },
                    { type: "math", question: "Which shape has 4 equal sides?", options: ["Square", "Rectangle", "Triangle", "Circle"], correct: 0, explanation: "A square has 4 sides that are all the same length." }
                ]
            }
        ],
        science: [
            {
                title: "Plants Around Us",
                questions: [
                    { type: "science", question: "What do plants need to grow?", options: ["Water, sunlight, air", "Only water", "Only sunlight", "Only air"], correct: 0, explanation: "Plants need water, sunlight, and air to grow healthy." },
                    { type: "science", question: "Which part of plant is underground?", options: ["Roots", "Leaves", "Flowers", "Stem"], correct: 0, explanation: "Roots grow underground and help the plant absorb water." },
                    { type: "science", question: "What is green in a plant?", options: ["Leaves", "Flowers", "Fruits", "Seeds"], correct: 0, explanation: "Leaves are green because they contain chlorophyll for photosynthesis." },
                    { type: "science", question: "Where do flowers grow?", options: ["On plants", "In water", "Underground", "In sky"], correct: 0, explanation: "Flowers grow on plants. They are often colorful and smell nice." },
                    { type: "science", question: "What is the big tree part called?", options: ["Trunk", "Root", "Leaf", "Flower"], correct: 0, explanation: "The thick, main part of a tree is called the trunk." }
                ]
            },
            {
                title: "Weather & Seasons",
                questions: [
                    { type: "science", question: "What falls from clouds during rain?", options: ["Water drops", "Snow", "Leaves", "Rocks"], correct: 0, explanation: "Rain is water that falls from clouds when they get too heavy." },
                    { type: "science", question: "Which season is very cold?", options: ["Winter", "Summer", "Monsoon", "Spring"], correct: 0, explanation: "Winter is the cold season. We wear warm clothes." },
                    { type: "science", question: "What shines in the sky during day?", options: ["Sun", "Moon", "Stars", "Clouds"], correct: 0, explanation: "The Sun shines during the day and gives us light and heat." },
                    { type: "science", question: "Which is hot season?", options: ["Summer", "Winter", "Rainy", "Cool"], correct: 0, explanation: "Summer is the hot season. We drink cold water and wear light clothes." },
                    { type: "science", question: "What do we use when it rains?", options: ["Umbrella", "Fan", "Goggles", "Scarf"], correct: 0, explanation: "We use an umbrella to stay dry when it rains." }
                ]
            }
        ],
        english: [
            {
                title: "Words & Sentences",
                questions: [
                    { type: "english", question: "Which is a complete sentence?", options: ["The cat sat.", "Big cat.", "Running.", "Soft."], correct: 0, explanation: "A complete sentence has a subject and verb and tells a complete thought." },
                    { type: "english", question: "What is the plural of 'cat'?", options: ["Cats", "Cat", "Cates", "Catses"], correct: 0, explanation: "To make most words plural, add 's'. Cat becomes cats." },
                    { type: "english", question: "Which word is a verb?", options: ["Jump", "Red", "Happy", "Big"], correct: 0, explanation: "A verb is an action word. 'Jump' is something you do." },
                    { type: "english", question: "What is the opposite of 'hot'?", options: ["Cold", "Warm", "Cool", "Mild"], correct: 0, explanation: "Hot and cold are opposites. When something is not hot, it's cold." },
                    { type: "english", question: "Which needs a question mark?", options: ["Where are you?", "I am here.", "She ran fast.", "He is tall."], correct: 0, explanation: "Questions always end with a question mark (?)." }
                ]
            }
        ],
        social: [
            {
                title: "People Who Help Us",
                questions: [
                    { type: "social", question: "Who helps sick people?", options: ["Doctor", "Teacher", "Pilot", "Farmer"], correct: 0, explanation: "Doctors help sick people get better." },
                    { type: "social", question: "Who teaches us at school?", options: ["Teacher", "Doctor", "Pilot", "Chef"], correct: 0, explanation: "Teachers teach us many things at school." },
                    { type: "social", question: "Who grows food for us?", options: ["Farmer", "Doctor", "Teacher", "Pilot"], correct: 0, explanation: "Farmers grow crops and vegetables for us to eat." },
                    { type: "social", question: "Who keeps us safe?", options: ["Police", "Doctor", "Teacher", "Farmer"], correct: 0, explanation: "Police officers keep our community safe." },
                    { type: "social", question: "Who flies an airplane?", options: ["Pilot", "Doctor", "Farmer", "Teacher"], correct: 0, explanation: "A pilot flies airplanes in the sky." }
                ]
            }
        ]
    },
    3: {
        math: [
            {
                title: "Place Value",
                questions: [
                    { type: "math", question: "What is the value of 4 in 456?", options: ["400", "40", "4", "4000"], correct: 0, explanation: "In 456, the digit 4 is in the hundreds place, so its value is 400." },
                    { type: "math", question: "What is 345 + 267?", options: ["612", "602", "622", "512"], correct: 0, explanation: "345 + 267 = 612. Add ones: 5+7=12, carry 1. Add tens: 4+6+1=11, carry 1. Add hundreds: 3+2+1=6." },
                    { type: "math", question: "What is 800 - 345?", options: ["455", "445", "465", "545"], correct: 0, explanation: "800 - 345 = 455. We need to borrow to subtract." },
                    { type: "math", question: "Round 276 to nearest ten:", options: ["280", "270", "275", "290"], correct: 0, explanation: "276 rounded to nearest ten is 280 (6 is more than 5, round up)." },
                    { type: "math", question: "Write 567 in expanded form:", options: ["500 + 60 + 7", "50 + 67", "560 + 7", "500 + 67"], correct: 0, explanation: "567 = 500 + 60 + 7 (5 hundreds + 6 tens + 7 ones)." }
                ]
            },
            {
                title: "Multiplication",
                questions: [
                    { type: "math", question: "5 × 4 = ?", options: ["20", "15", "25", "9"], correct: 0, explanation: "5 × 4 = 20. Five groups of four equals twenty." },
                    { type: "math", question: "7 × 3 = ?", options: ["21", "24", "18", "10"], correct: 0, explanation: "7 × 3 = 21. Seven times three is twenty-one." },
                    { type: "math", question: "6 × 6 = ?", options: ["36", "30", "42", "12"], correct: 0, explanation: "6 × 6 = 36. Six times six is thirty-six." },
                    { type: "math", question: "9 × 2 = ?", options: ["18", "11", "20", "7"], correct: 0, explanation: "9 × 2 = 18. Nine times two is eighteen." },
                    { type: "math", question: "8 × 5 = ?", options: ["40", "35", "45", "13"], correct: 0, explanation: "8 × 5 = 40. Eight times five is forty." }
                ]
            }
        ],
        science: [
            {
                title: "Water & Air",
                questions: [
                    { type: "science", question: "What percentage of Earth is water?", options: ["About 70%", "About 50%", "About 90%", "About 30%"], correct: 0, explanation: "About 70% of Earth's surface is covered with water." },
                    { type: "science", question: "What is water made of?", options: ["Hydrogen and Oxygen", "Carbon and Oxygen", "Nitrogen and Hydrogen", "Just Oxygen"], correct: 0, explanation: "Water (H₂O) is made of two hydrogen atoms and one oxygen atom." },
                    { type: "science", question: "What do we breathe in?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], correct: 0, explanation: "We breathe in oxygen which our body needs to work." },
                    { type: "science", question: "What gas do plants release?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], correct: 0, explanation: "Plants release oxygen during photosynthesis, which we breathe." },
                    { type: "science", question: "Why do we need water?", options: ["To drink and live", "To make money", "To sleep", "To run fast"], correct: 0, explanation: "Our body needs water to survive. We should drink water daily." }
                ]
            }
        ],
        english: [
            {
                title: "Grammar",
                questions: [
                    { type: "english", question: "Which is a noun?", options: ["School", "Run", "Happy", "Quickly"], correct: 0, explanation: "A noun is a person, place, or thing. 'School' is a place." },
                    { type: "english", question: "What is the past tense of 'run'?", options: ["Ran", "Running", "Runs", "Runned"], correct: 0, explanation: "The past tense of 'run' is 'ran'." },
                    { type: "english", question: "Which is correct? She ___ fast.", options: ["runs", "run", "running", "runned"], correct: 0, explanation: "With 'she' (third person singular), we use 'runs'." },
                    { type: "english", question: "What is a synonym for 'happy'?", options: ["Joyful", "Sad", "Angry", "Tired"], correct: 0, explanation: "Joyful means happy. Synonyms are words with similar meanings." },
                    { type: "english", question: "Which word is an adjective?", options: ["Beautiful", "Run", "Jump", "Sing"], correct: 0, explanation: "Adjectives describe nouns. 'Beautiful' describes how something looks." }
                ]
            }
        ],
        social: [
            {
                title: "Our Country India",
                questions: [
                    { type: "social", question: "What is the capital of India?", options: ["New Delhi", "Mumbai", "Kolkata", "Chennai"], correct: 0, explanation: "New Delhi is the capital city of India." },
                    { type: "social", question: "How many states does India have?", options: ["28", "25", "30", "32"], correct: 0, explanation: "India has 28 states and 8 union territories." },
                    { type: "social", question: "What is India's national animal?", options: ["Tiger", "Lion", "Elephant", "Peacock"], correct: 0, explanation: "The Royal Bengal Tiger is India's national animal." },
                    { type: "social", question: "When do we celebrate Independence Day?", options: ["August 15", "January 26", "October 2", "November 14"], correct: 0, explanation: "India celebrates Independence Day on August 15th." },
                    { type: "social", question: "What is our national language?", options: ["Hindi", "English", "Tamil", "Bengali"], correct: 0, explanation: "Hindi is the official language of India." }
                ]
            }
        ]
    },
    4: {
        math: [
            {
                title: "Number Sense & Place Value",
                questions: [
                    { type: "math", question: "What is the value of 5 in 5,432?", options: ["5 thousands", "5 hundreds", "5 tens", "5 ones"], correct: 0, explanation: "In 5,432, the digit 5 is in the thousands place, so its value is 5,000." },
                    { type: "math", question: "Which number has 6 in the hundreds place?", options: ["6,543", "5,643", "5,463", "5,436"], correct: 1, explanation: "In 5,643, the digit 6 is in the hundreds place." },
                    { type: "math", question: "Write 4,567 in expanded form:", options: ["4000 + 500 + 60 + 7", "400 + 50 + 6 + 7", "4500 + 67", "4000 + 567"], correct: 0, explanation: "4,567 = 4×1000 + 5×100 + 6×10 + 7×1 = 4000 + 500 + 60 + 7" },
                    { type: "math", question: "What comes after 9,999?", options: ["10,000", "9,990", "10,001", "9,000"], correct: 0, explanation: "After 9,999, we add 1 to get 10,000." },
                    { type: "math", question: "Round 3,456 to the nearest hundred:", options: ["3,500", "3,400", "3,460", "3,450"], correct: 0, explanation: "Since 56 is greater than 50, we round up to 3,500." }
                ]
            },
            {
                title: "Addition & Subtraction",
                questions: [
                    { type: "math", question: "245 + 367 = ?", options: ["612", "602", "622", "612"], correct: 0, explanation: "245 + 367 = 612. Let's add: 5+7=12, carry 1; 4+6+1=11, carry 1; 2+3+1=6" },
                    { type: "math", question: "What is 1,000 - 456?", options: ["544", "554", "564", "534"], correct: 0, explanation: "1,000 - 456 = 544. We borrow across zeros to subtract." },
                    { type: "math", question: "Estimate: 398 + 512 ≈ ?", options: ["900", "800", "1000", "850"], correct: 0, explanation: "398 ≈ 400 and 512 ≈ 500, so 400 + 500 = 900" },
                    { type: "math", question: "Find the missing number: 456 + ___ = 789", options: ["333", "323", "343", "313"], correct: 0, explanation: "789 - 456 = 333" },
                    { type: "math", question: "What is 2,345 + 678?", options: ["3,023", "3,013", "3,033", "3,003"], correct: 0, explanation: "2,345 + 678 = 3,023" }
                ]
            },
            {
                title: "Multiplication Basics",
                questions: [
                    { type: "math", question: "12 × 8 = ?", options: ["96", "86", "106", "94"], correct: 0, explanation: "12 × 8 = 96. Think: 10×8=80, 2×8=16, 80+16=96" },
                    { type: "math", question: "What is 7 × 9?", options: ["63", "54", "72", "56"], correct: 0, explanation: "7 × 9 = 63" },
                    { type: "math", question: "15 × 6 = ?", options: ["90", "80", "96", "84"], correct: 0, explanation: "15 × 6 = 90. Think: 10×6=60, 5×6=30, 60+30=90" },
                    { type: "math", question: "Which equals 8 × 7?", options: ["56", "48", "54", "63"], correct: 0, explanation: "8 × 7 = 56" },
                    { type: "math", question: "25 × 4 = ?", options: ["100", "90", "110", "80"], correct: 0, explanation: "25 × 4 = 100. Think: 25×2=50, 50×2=100" }
                ]
            },
            {
                title: "Division Basics",
                questions: [
                    { type: "math", question: "48 ÷ 6 = ?", options: ["8", "7", "9", "6"], correct: 0, explanation: "48 ÷ 6 = 8 because 6 × 8 = 48" },
                    { type: "math", question: "What is 72 ÷ 8?", options: ["9", "8", "7", "10"], correct: 0, explanation: "72 ÷ 8 = 9 because 8 × 9 = 72" },
                    { type: "math", question: "63 ÷ 7 = ?", options: ["9", "8", "10", "7"], correct: 0, explanation: "63 ÷ 7 = 9 because 7 × 9 = 63" },
                    { type: "math", question: "100 ÷ 10 = ?", options: ["10", "20", "5", "100"], correct: 0, explanation: "100 ÷ 10 = 10" },
                    { type: "math", question: "Which is correct?", options: ["56 ÷ 8 = 7", "56 ÷ 7 = 8", "56 ÷ 8 = 8", "56 ÷ 7 = 9"], correct: 1, explanation: "56 ÷ 7 = 8 because 7 × 8 = 56" }
                ]
            },
            {
                title: "Fractions",
                questions: [
                    { type: "math", question: "What is 1/2 + 1/2?", options: ["1", "2/4", "1/4", "2/2"], correct: 0, explanation: "1/2 + 1/2 = 2/2 = 1" },
                    { type: "math", question: "Which fraction is larger: 1/3 or 1/4?", options: ["1/3", "1/4", "They're equal", "Cannot tell"], correct: 0, explanation: "When numerators are the same, the fraction with the smaller denominator is larger." },
                    { type: "math", question: "What is 3/4 of 12?", options: ["9", "8", "6", "3"], correct: 0, explanation: "3/4 of 12 = 3 × 12 ÷ 4 = 36 ÷ 4 = 9" },
                    { type: "math", question: "Simplify 4/8:", options: ["1/2", "2/4", "1/4", "2/8"], correct: 0, explanation: "4/8 = 4÷4 / 8÷4 = 1/2" },
                    { type: "math", question: "What is 2/3 + 1/3?", options: ["1", "3/6", "3/3", "2/6"], correct: 0, explanation: "2/3 + 1/3 = 3/3 = 1" }
                ]
            },
            {
                title: "Geometry Basics",
                questions: [
                    { type: "math", question: "How many sides does a hexagon have?", options: ["6", "5", "7", "8"], correct: 0, explanation: "A hexagon has 6 sides (hex = six)." },
                    { type: "math", question: "What is the sum of angles in a triangle?", options: ["180°", "360°", "90°", "270°"], correct: 0, explanation: "The sum of angles in any triangle is always 180°." },
                    { type: "math", question: "Which shape has 4 equal sides and 4 right angles?", options: ["Square", "Rectangle", "Rhombus", "Parallelogram"], correct: 0, explanation: "A square has 4 equal sides and 4 right angles (90° each)." },
                    { type: "math", question: "What is the perimeter of a square with side 5 cm?", options: ["20 cm", "25 cm", "10 cm", "15 cm"], correct: 0, explanation: "Perimeter = 4 × side = 4 × 5 = 20 cm" },
                    { type: "math", question: "How many faces does a cube have?", options: ["6", "4", "8", "12"], correct: 0, explanation: "A cube has 6 faces (top, bottom, and 4 sides)." }
                ]
            }
        ],
        science: [
            {
                title: "Matter & Materials",
                questions: [
                    { type: "science", question: "What are the three states of matter?", options: ["Solid, Liquid, Gas", "Hot, Cold, Warm", "Big, Small, Medium", "Hard, Soft, Rough"], correct: 0, explanation: "Matter exists in three states: solid (fixed shape), liquid (flows), and gas (fills space)." },
                    { type: "science", question: "Which is a property of water?", options: ["It takes the shape of its container", "It has a fixed shape", "It is always hard", "It cannot flow"], correct: 0, explanation: "Water is a liquid that takes the shape of whatever container it's in." },
                    { type: "science", question: "What happens when ice melts?", options: ["It becomes water", "It becomes gas", "It disappears", "It becomes harder"], correct: 0, explanation: "When ice (solid water) melts, it turns into liquid water." },
                    { type: "science", question: "Which material is a conductor of heat?", options: ["Metal", "Wood", "Plastic", "Rubber"], correct: 0, explanation: "Metals are good conductors of heat, which is why metal pans get hot quickly." },
                    { type: "science", question: "What is the process of water turning into steam called?", options: ["Evaporation", "Condensation", "Freezing", "Melting"], correct: 0, explanation: "Evaporation is when liquid water turns into water vapor (gas)." }
                ]
            },
            {
                title: "Living Things",
                questions: [
                    { type: "science", question: "What do all living things need?", options: ["Food, water, and air", "Only sunlight", "Only water", "Only food"], correct: 0, explanation: "All living things need food, water, air, and space to survive." },
                    { type: "science", question: "Which is a living thing?", options: ["A tree", "A rock", "A chair", "A car"], correct: 0, explanation: "A tree is a living thing because it grows, needs food and water, and reproduces." },
                    { type: "science", question: "What do plants need to make food?", options: ["Sunlight, water, and CO2", "Only water", "Only soil", "Only air"], correct: 0, explanation: "Plants use sunlight, water, and carbon dioxide to make food through photosynthesis." },
                    { type: "science", question: "Which organ pumps blood in our body?", options: ["Heart", "Brain", "Lungs", "Stomach"], correct: 0, explanation: "The heart pumps blood throughout our body to deliver oxygen and nutrients." },
                    { type: "science", question: "What is the powerhouse of the cell?", options: ["Mitochondria", "Nucleus", "Cell wall", "Cytoplasm"], correct: 0, explanation: "Mitochondria are called the powerhouse of the cell because they produce energy." }
                ]
            },
            {
                title: "Force & Motion",
                questions: [
                    { type: "science", question: "What is force?", options: ["A push or pull", "Speed", "Weight", "Height"], correct: 0, explanation: "Force is a push or pull that can change the motion of an object." },
                    { type: "science", question: "What happens when you push a ball?", options: ["It moves", "It stops", "It gets heavier", "It changes color"], correct: 0, explanation: "When you apply force (push) to a ball, it moves in the direction of the push." },
                    { type: "science", question: "Which force keeps us on the ground?", options: ["Gravity", "Friction", "Magnetism", "Electricity"], correct: 0, explanation: "Gravity is the force that pulls objects toward the center of the Earth." },
                    { type: "science", question: "What slows down a moving bicycle?", options: ["Friction", "Gravity", "Wind", "Sunlight"], correct: 0, explanation: "Friction between the tires and road, and air resistance, slow down a bicycle." },
                    { type: "science", question: "A ball rolling on grass slows down because of:", options: ["Friction", "Gravity", "Speed", "Weight"], correct: 0, explanation: "Friction between the ball and grass surface slows down the ball." }
                ]
            },
            {
                title: "Energy & Heat",
                questions: [
                    { type: "science", question: "What is the source of most energy on Earth?", options: ["The Sun", "The Moon", "Stars", "Wind"], correct: 0, explanation: "The Sun is the primary source of energy for most life and processes on Earth." },
                    { type: "science", question: "Which form of energy makes things hot?", options: ["Heat energy", "Light energy", "Sound energy", "Chemical energy"], correct: 0, explanation: "Heat energy (thermal energy) makes things hot or cold." },
                    { type: "science", question: "What happens to ice when heated?", options: ["It melts", "It gets harder", "It shrinks", "Nothing"], correct: 0, explanation: "When ice is heated, it absorbs heat energy and melts into water." },
                    { type: "science", question: "Which is an example of chemical energy?", options: ["Food", "Light bulb", "Battery (electrical)", "Hot tea"], correct: 0, explanation: "Food contains chemical energy that our body converts to useful energy." },
                    { type: "science", question: "Energy cannot be:", options: ["Created or destroyed", "Changed", "Used", "Stored"], correct: 0, explanation: "According to the law of conservation, energy cannot be created or destroyed, only transformed." }
                ]
            },
            {
                title: "Earth & Space",
                questions: [
                    { type: "science", question: "How many planets are in our solar system?", options: ["8", "7", "9", "10"], correct: 0, explanation: "There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune." },
                    { type: "science", question: "Which planet do we live on?", options: ["Earth", "Mars", "Venus", "Jupiter"], correct: 0, explanation: "We live on Earth, the third planet from the Sun." },
                    { type: "science", question: "What causes day and night?", options: ["Earth's rotation", "Moon's orbit", "Sun moving", "Clouds"], correct: 0, explanation: "Earth rotates on its axis, causing different parts to face the Sun (day) or away from it (night)." },
                    { type: "science", question: "What is the closest star to Earth?", options: ["The Sun", "Polaris", "Sirius", "Alpha Centauri"], correct: 0, explanation: "The Sun is a star and it's the closest star to Earth." },
                    { type: "science", question: "What shape is the Earth?", options: ["Sphere", "Flat", "Cube", "Cylinder"], correct: 0, explanation: "The Earth is approximately spherical (round like a ball)." }
                ]
            }
        ],
        english: [
            {
                title: "Grammar Basics",
                questions: [
                    { type: "english", question: "Which is a noun?", options: ["Dog", "Run", "Happy", "Quickly"], correct: 0, explanation: "A noun is a person, place, thing, or idea. 'Dog' is a thing." },
                    { type: "english", question: "Which word is a verb?", options: ["Jump", "Big", "Blue", "Fast"], correct: 0, explanation: "A verb is an action word. 'Jump' is an action." },
                    { type: "english", question: "What type of word describes a noun?", options: ["Adjective", "Verb", "Noun", "Adverb"], correct: 0, explanation: "Adjectives describe nouns (e.g., 'big dog', 'happy child')." },
                    { type: "english", question: "Which is a proper noun?", options: ["Monday", "happy", "run", "big"], correct: 0, explanation: "Proper nouns name specific people, places, or things and are always capitalized." },
                    { type: "english", question: "Which sentence is correct?", options: ["She runs fast.", "She run fast.", "She running fast.", "She runned fast."], correct: 0, explanation: "With 'she' (third person singular), we add 's' to the verb: runs." }
                ]
            },
            {
                title: "Tenses",
                questions: [
                    { type: "english", question: "Which is past tense?", options: ["Walked", "Walks", "Walking", "Walk"], correct: 0, explanation: "Past tense shows something already happened. 'Walked' is past tense." },
                    { type: "english", question: "She ___ to school every day.", options: ["goes", "went", "going", "gone"], correct: 0, explanation: "For habitual actions, we use present tense: goes." },
                    { type: "english", question: "They ___ football yesterday.", options: ["played", "play", "plays", "playing"], correct: 0, explanation: "Yesterday indicates past tense, so we use 'played'." },
                    { type: "english", question: "I ___ a book right now.", options: ["am reading", "read", "reads", "readed"], correct: 0, explanation: "Right now indicates present continuous tense: am reading." },
                    { type: "english", question: "Which is future tense?", options: ["Will go", "Went", "Go", "Going"], correct: 0, explanation: "Future tense uses 'will' + verb: will go." }
                ]
            },
            {
                title: "Vocabulary",
                questions: [
                    { type: "english", question: "What is the opposite of 'hot'?", options: ["Cold", "Warm", "Cool", "Mild"], correct: 0, explanation: "Hot and cold are opposites (antonyms)." },
                    { type: "english", question: "What does 'enormous' mean?", options: ["Very big", "Very small", "Very fast", "Very slow"], correct: 0, explanation: "Enormous means extremely large or big." },
                    { type: "english", question: "Which word means 'happy'?", options: ["Joyful", "Sad", "Angry", "Tired"], correct: 0, explanation: "Joyful means feeling or showing great happiness." },
                    { type: "english", question: "What is a synonym for 'big'?", options: ["Large", "Small", "Tiny", "Short"], correct: 0, explanation: "Synonyms are words with similar meanings. Big and large mean the same." },
                    { type: "english", question: "The opposite of 'brave' is:", options: ["Cowardly", "Bold", "Strong", "Fearless"], correct: 0, explanation: "Brave means courageous, while cowardly means lacking courage." }
                ]
            },
            {
                title: "Reading Comprehension",
                questions: [
                    { type: "english", question: "What is the main idea of a story?", options: ["The most important point", "The characters", "The setting", "The ending"], correct: 0, explanation: "The main idea is the central message or most important point the author wants to convey." },
                    { type: "english", question: "Who tells the story in first person?", options: ["The narrator using 'I'", "The author", "A character using 'he'", "Nobody"], correct: 0, explanation: "In first person, the narrator tells the story using 'I' or 'we'." },
                    { type: "english", question: "What is the beginning of a story called?", options: ["Introduction", "Climax", "Conclusion", "Resolution"], correct: 0, explanation: "The introduction sets up the story, introducing characters and setting." },
                    { type: "english", question: "What comes after the climax?", options: ["Falling action", "Rising action", "Introduction", "Beginning"], correct: 0, explanation: "After the climax (most exciting part), the falling action leads to the resolution." },
                    { type: "english", question: "What is a character's personality trait?", options: ["Kind", "Tall", "Fast", "Loud"], correct: 0, explanation: "Personality traits describe how someone behaves (kind, brave, shy)." }
                ]
            },
            {
                title: "Punctuation",
                questions: [
                    { type: "english", question: "Which punctuation ends a question?", options: ["?", ".", "!", ","], correct: 0, explanation: "A question mark (?) is used at the end of a question." },
                    { type: "english", question: "When do we use an exclamation mark?", options: ["Strong feelings or excitement", "End of sentence", "Lists", "Names"], correct: 0, explanation: "Exclamation marks show strong feelings like excitement, surprise, or anger." },
                    { type: "english", question: "What goes at the end of a statement?", options: ["Period (.)", "Question mark", "Exclamation mark", "Comma"], correct: 0, explanation: "A period (full stop) is used at the end of a statement." },
                    { type: "english", question: "Which is correct?", options: ["Let's go!", "Lets go!", "Lets go.", "Let's go."], correct: 0, explanation: "'Let's' is a contraction of 'let us' and needs an apostrophe." },
                    { type: "english", question: "Where does the apostrophe go in 'the dog's bone'?", options: ["After dog", "Before dog", "After the", "After bone"], correct: 0, explanation: "The apostrophe shows possession: the bone belonging to the dog." }
                ]
            }
        ],
        social: [
            {
                title: "Indian History Basics",
                questions: [
                    { type: "social", question: "Who is known as the Father of the Nation of India?", options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose", "B.R. Ambedkar"], correct: 0, explanation: "Mahatma Gandhi is called the Father of the Nation for leading India's independence movement." },
                    { type: "social", question: "When did India become independent?", options: ["1947", "1950", "1945", "1952"], correct: 0, explanation: "India gained independence from British rule on August 15, 1947." },
                    { type: "social", question: "What does the Indian flag represent?", options: ["Courage, peace, and truth", "Only peace", "Only courage", "Only truth"], correct: 0, explanation: "The saffron represents courage, white represents peace, and green represents truth." },
                    { type: "social", question: "Who wrote the Indian national anthem?", options: ["Rabindranath Tagore", "Bankim Chandra", "Sarojini Naidu", "Mahatma Gandhi"], correct: 0, explanation: "Rabindranath Tagore wrote 'Jana Gana Mana', India's national anthem." },
                    { type: "social", question: "What is the capital of India?", options: ["New Delhi", "Mumbai", "Kolkata", "Chennai"], correct: 0, explanation: "New Delhi is the capital city of India." }
                ]
            },
            {
                title: "Geography & Maps",
                questions: [
                    { type: "social", question: "How many continents are there?", options: ["7", "5", "6", "8"], correct: 0, explanation: "There are 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia." },
                    { type: "social", question: "Which is the largest ocean?", options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], correct: 0, explanation: "The Pacific Ocean is the largest and deepest ocean on Earth." },
                    { type: "social", question: "What does a map key show?", options: ["Symbols and their meanings", "Only cities", "Only rivers", "Only countries"], correct: 0, explanation: "A map key (legend) explains the symbols used on a map." },
                    { type: "social", question: "Which direction does a compass point?", options: ["North", "South", "East", "West"], correct: 0, explanation: "A compass needle always points towards magnetic North." },
                    { type: "social", question: "India is located in which continent?", options: ["Asia", "Africa", "Europe", "Australia"], correct: 0, explanation: "India is located in the continent of Asia." }
                ]
            },
            {
                title: "Civics & Government",
                questions: [
                    { type: "social", question: "What is democracy?", options: ["Government by the people", "Government by one person", "Government by rich people", "No government"], correct: 0, explanation: "Democracy is a system where people elect their leaders and participate in decisions." },
                    { type: "social", question: "Who makes laws in India?", options: ["Parliament", "President", "Prime Minister", "Courts"], correct: 0, explanation: "The Parliament (Lok Sabha and Rajya Sabha) makes laws for the country." },
                    { type: "social", question: "What is a right?", options: ["Something you are allowed to do", "Something you must do", "A law", "A rule"], correct: 0, explanation: "Rights are freedoms that every citizen has, like the right to education." },
                    { type: "social", question: "What is the minimum voting age in India?", options: ["18 years", "21 years", "16 years", "25 years"], correct: 0, explanation: "In India, citizens can vote once they turn 18 years old." },
                    { type: "social", question: "Which branch of government interprets laws?", options: ["Judiciary", "Executive", "Legislature", "Military"], correct: 0, explanation: "The judiciary (courts) interprets and applies laws." }
                ]
            },
            {
                title: "Culture & Traditions",
                questions: [
                    { type: "social", question: "How many official languages does India recognize?", options: ["22", "10", "15", "28"], correct: 0, explanation: "The Indian Constitution recognizes 22 official languages." },
                    { type: "social", question: "Which festival is known as the Festival of Lights?", options: ["Diwali", "Holi", "Eid", "Christmas"], correct: 0, explanation: "Diwali is called the Festival of Lights because people light diyas and candles." },
                    { type: "social", question: "What is the national animal of India?", options: ["Tiger", "Lion", "Elephant", "Peacock"], correct: 0, explanation: "The Royal Bengal Tiger is the national animal of India." },
                    { type: "social", question: "Which dance form is from Kerala?", options: ["Kathakali", "Bharatanatyam", "Kathak", "Odissi"], correct: 0, explanation: "Kathakali is a classical dance form from Kerala." },
                    { type: "social", question: "What is unity in diversity?", options: ["Different people living together peacefully", "Everyone being the same", "Separate communities", "Fighting differences"], correct: 0, explanation: "Unity in diversity means people of different cultures, languages, and religions living together harmoniously." }
                ]
            }
        ]
    },
    5: {
        math: [
            {
                title: "Large Numbers",
                questions: [
                    { type: "math", question: "What is 12,345 + 6,789?", options: ["19,134", "18,134", "19,234", "20,134"], correct: 0, explanation: "12,345 + 6,789 = 19,134. Add carefully from ones to ten-thousands." },
                    { type: "math", question: "What is the place value of 7 in 47,832?", options: ["7 thousands", "7 hundreds", "7 ten-thousands", "7 tens"], correct: 0, explanation: "In 47,832, the 7 is in the thousands place, so its value is 7,000." },
                    { type: "math", question: "Write 89,045 in words:", options: ["Eighty-nine thousand forty-five", "Eighty-nine thousand and forty-five", "Eighty thousand nine hundred forty-five", "Eight-nine thousand forty-five"], correct: 0, explanation: "89,045 = Eighty-nine thousand forty-five." },
                    { type: "math", question: "Round 56,789 to the nearest thousand:", options: ["57,000", "56,000", "56,800", "56,790"], correct: 0, explanation: "56,789 rounds to 57,000 (789 is more than 500, so round up)." },
                    { type: "math", question: "What is 100,000 - 1?", options: ["99,999", "99,990", "100,001", "90,000"], correct: 0, explanation: "100,000 - 1 = 99,999." }
                ]
            },
            {
                title: "Multiplication & Division",
                questions: [
                    { type: "math", question: "What is 125 × 8?", options: ["1,000", "900", "1,100", "800"], correct: 0, explanation: "125 × 8 = 1,000. Think: 125 × 2 = 250, 250 × 4 = 1,000." },
                    { type: "math", question: "What is 144 ÷ 12?", options: ["12", "14", "10", "13"], correct: 0, explanation: "144 ÷ 12 = 12 because 12 × 12 = 144." },
                    { type: "math", question: "What is 25 × 25?", options: ["625", "525", "725", "425"], correct: 0, explanation: "25 × 25 = 625. Think: 25 × 4 × 4 × 4 = 100 × 4 × 4 = 625." },
                    { type: "math", question: "What is 1,000 ÷ 25?", options: ["40", "50", "25", "100"], correct: 0, explanation: "1,000 ÷ 25 = 40. Think: 25 × 40 = 1,000." },
                    { type: "math", question: "What is 15 × 15?", options: ["225", "215", "235", "205"], correct: 0, explanation: "15 × 15 = 225. Remember: numbers ending in 5 × themselves end in 25." }
                ]
            },
            {
                title: "Fractions & Decimals",
                questions: [
                    { type: "math", question: "What is 3/5 + 2/5?", options: ["1", "5/10", "6/10", "1/5"], correct: 0, explanation: "3/5 + 2/5 = 5/5 = 1" },
                    { type: "math", question: "Convert 0.75 to a fraction:", options: ["3/4", "7/5", "75/10", "3/5"], correct: 0, explanation: "0.75 = 75/100 = 3/4" },
                    { type: "math", question: "What is 1/2 of 60?", options: ["30", "120", "20", "40"], correct: 0, explanation: "1/2 of 60 = 60 ÷ 2 = 30" },
                    { type: "math", question: "Which is larger: 0.5 or 0.25?", options: ["0.5", "0.25", "They're equal", "Cannot tell"], correct: 0, explanation: "0.5 is greater than 0.25. In fractions: 1/2 > 1/4." },
                    { type: "math", question: "What is 2.5 + 3.7?", options: ["6.2", "5.2", "6.12", "5.12"], correct: 0, explanation: "2.5 + 3.7 = 6.2. Add the decimal parts: 0.5 + 0.7 = 1.2, then 2 + 3 + 1.2 = 6.2." }
                ]
            }
        ],
        science: [
            {
                title: "Human Body Systems",
                questions: [
                    { type: "science", question: "How many bones does an adult human have?", options: ["206", "150", "300", "100"], correct: 0, explanation: "An adult human body has 206 bones." },
                    { type: "science", question: "What is the largest organ in the human body?", options: ["Skin", "Heart", "Brain", "Liver"], correct: 0, explanation: "Skin is the largest organ, covering our entire body." },
                    { type: "science", question: "How many chambers does the human heart have?", options: ["4", "2", "3", "6"], correct: 0, explanation: "The human heart has 4 chambers: 2 atria and 2 ventricles." },
                    { type: "science", question: "What is the function of red blood cells?", options: ["Carry oxygen", "Fight infection", "Digest food", "Send signals"], correct: 0, explanation: "Red blood cells carry oxygen from the lungs to all parts of the body." },
                    { type: "science", question: "Where is food digested?", options: ["Stomach", "Brain", "Heart", "Lungs"], correct: 0, explanation: "Food is mainly digested in the stomach and small intestine." }
                ]
            },
            {
                title: "Plants & Photosynthesis",
                questions: [
                    { type: "science", question: "What is photosynthesis?", options: ["Making food using sunlight", "Breathing in oxygen", "Growing roots", "Making seeds"], correct: 0, explanation: "Photosynthesis is how plants make their own food using sunlight, water, and CO2." },
                    { type: "science", question: "What gas do plants absorb?", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], correct: 0, explanation: "Plants absorb carbon dioxide (CO2) from the air for photosynthesis." },
                    { type: "science", question: "What is chlorophyll?", options: ["Green pigment in leaves", "Root of a plant", "Type of flower", "Plant seed"], correct: 0, explanation: "Chlorophyll is the green pigment in leaves that captures sunlight for photosynthesis." },
                    { type: "science", question: "Which part of plant absorbs water?", options: ["Roots", "Leaves", "Flowers", "Stem"], correct: 0, explanation: "Roots absorb water and nutrients from the soil." },
                    { type: "science", question: "What is the food made by plants called?", options: ["Glucose", "Protein", "Fat", "Vitamin"], correct: 0, explanation: "Plants make glucose (a sugar) through photosynthesis." }
                ]
            }
        ],
        english: [
            {
                title: "Advanced Grammar",
                questions: [
                    { type: "english", question: "Which is a compound sentence?", options: ["I went home and she went to school.", "She ran.", "The cat is black.", "He is tall."], correct: 0, explanation: "A compound sentence has two independent clauses joined by a conjunction." },
                    { type: "english", question: "What is the past participle of 'go'?", options: ["Gone", "Went", "Going", "Goes"], correct: 0, explanation: "The past participle of 'go' is 'gone' (used with have/has: has gone)." },
                    { type: "english", question: "Which is an active voice sentence?", options: ["The cat caught the mouse.", "The mouse was caught by the cat.", "The mouse is caught.", "The mouse has been caught."], correct: 0, explanation: "Active voice: subject performs the action. 'The cat caught the mouse' - cat is doing the catching." },
                    { type: "english", question: "What is a pronoun?", options: ["He, she, it, they", "Run, jump, play", "Big, small, tall", "And, but, or"], correct: 0, explanation: "Pronouns replace nouns: he, she, it, they, we, I, you, etc." },
                    { type: "english", question: "Which is a complex sentence?", options: ["Although it rained, we played outside.", "I like cats.", "She sings.", "They run."], correct: 0, explanation: "A complex sentence has an independent clause and a dependent clause." }
                ]
            },
            {
                title: "Writing Skills",
                questions: [
                    { type: "english", question: "What is a paragraph?", options: ["A group of related sentences", "A single sentence", "A group of words", "A title"], correct: 0, explanation: "A paragraph is a group of sentences about one main idea." },
                    { type: "english", question: "What is the topic sentence?", options: ["The main idea of a paragraph", "The last sentence", "A supporting detail", "A conclusion"], correct: 0, explanation: "The topic sentence introduces the main idea of a paragraph." },
                    { type: "english", question: "Which transition word shows contrast?", options: ["However", "Also", "Therefore", "First"], correct: 0, explanation: "'However' shows contrast between ideas. It means 'but' or 'nevertheless'." },
                    { type: "english", question: "What is a conclusion?", options: ["The ending that summarizes main points", "The beginning", "The middle", "The title"], correct: 0, explanation: "A conclusion summarizes the main points and ends the writing." },
                    { type: "english", question: "What is an opinion?", options: ["What you think or believe", "A fact that can be proven", "Something that happened", "A definition"], correct: 0, explanation: "An opinion is what someone thinks or believes. It cannot be proven true or false." }
                ]
            }
        ],
        social: [
            {
                title: "Indian Freedom Struggle",
                questions: [
                    { type: "social", question: "Who gave the slogan 'Do or Die'?", options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose", "Bhagat Singh"], correct: 0, explanation: "Mahatma Gandhi gave the 'Do or Die' slogan during the Quit India Movement." },
                    { type: "social", question: "What was the Quit India Movement?", options: ["Demand to end British rule", "A festival", "A war", "An education reform"], correct: 0, explanation: "The Quit India Movement (1942) demanded an immediate end to British rule in India." },
                    { type: "social", question: "Who was the first Prime Minister of India?", options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel", "Rajendra Prasad"], correct: 0, explanation: "Jawaharlal Nehru became the first Prime Minister of India in 1947." },
                    { type: "social", question: "What was the Salt March?", options: ["Protesting salt tax by marching to sea", "A race", "A celebration", "A trade agreement"], correct: 0, explanation: "The Salt March (1930) was a protest against the British salt tax, led by Gandhi." },
                    { type: "social", question: "Who is known as the Iron Man of India?", options: ["Sardar Vallabhbhai Patel", "Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose"], correct: 0, explanation: "Sardar Vallabhbhai Patel is called the Iron Man for uniting India's princely states." }
                ]
            },
            {
                title: "Indian Geography",
                questions: [
                    { type: "social", question: "Which is the longest river in India?", options: ["Ganga", "Yamuna", "Brahmaputra", "Narmada"], correct: 0, explanation: "The Ganga is the longest river in India, flowing through several states." },
                    { type: "social", question: "Which is the highest mountain peak in India?", options: ["Kangchenjunga", "Mount Everest", "Nanda Devi", "K2"], correct: 0, explanation: "Kangchenjunga is the highest peak in India (8,586 m)." },
                    { type: "social", question: "How many oceans touch India?", options: ["1 (Indian Ocean)", "2", "3", "0"], correct: 0, explanation: "India is surrounded by the Indian Ocean, Arabian Sea, and Bay of Bengal." },
                    { type: "social", question: "Which state is the largest in India?", options: ["Rajasthan", "Maharashtra", "Uttar Pradesh", "Madhya Pradesh"], correct: 0, explanation: "Rajasthan is the largest state by area in India." },
                    { type: "social", question: "Where is the Thar Desert?", options: ["Rajasthan", "Kerala", "Tamil Nadu", "West Bengal"], correct: 0, explanation: "The Thar Desert is located in Rajasthan, western India." }
                ]
            }
        ]
    },
    6: {
        math: [
            {
                title: "Integers & Operations",
                questions: [
                    { type: "math", question: "What is -5 + 3?", options: ["-2", "2", "-8", "8"], correct: 0, explanation: "-5 + 3 = -2. Starting at -5 on the number line, move 3 steps right." },
                    { type: "math", question: "What is -8 - (-3)?", options: ["-5", "-11", "5", "11"], correct: 0, explanation: "-8 - (-3) = -8 + 3 = -5. Subtracting a negative is like adding a positive." },
                    { type: "math", question: "What is -4 × 6?", options: ["-24", "24", "-10", "10"], correct: 0, explanation: "Negative × Positive = Negative. -4 × 6 = -24." },
                    { type: "math", question: "What is -3 × -7?", options: ["21", "-21", "10", "-10"], correct: 0, explanation: "Negative × Negative = Positive. -3 × -7 = 21." },
                    { type: "math", question: "What is -12 ÷ 4?", options: ["-3", "3", "-16", "16"], correct: 0, explanation: "-12 ÷ 4 = -3. Negative ÷ Positive = Negative." }
                ]
            },
            {
                title: "Ratio & Proportion",
                questions: [
                    { type: "math", question: "What is the ratio of 10 to 5 in simplest form?", options: ["2:1", "1:2", "5:10", "10:5"], correct: 0, explanation: "10:5 = 2:1 (divide both by 5)." },
                    { type: "math", question: "If 2 apples cost ₹10, what is the cost of 5 apples?", options: ["₹25", "₹20", "₹30", "₹50"], correct: 0, explanation: "2 apples = ₹10, so 1 apple = ₹5, 5 apples = ₹25." },
                    { type: "math", question: "Simplify the ratio 15:25:", options: ["3:5", "5:3", "15:25", "25:15"], correct: 0, explanation: "15:25 = 3:5 (divide both by 5)." },
                    { type: "math", question: "Are 4:6 and 2:3 equivalent ratios?", options: ["Yes", "No", "Cannot tell", "Sometimes"], correct: 0, explanation: "4:6 = 2:3 (divide 4:6 by 2). Yes, they are equivalent." },
                    { type: "math", question: "What is 50% of 200?", options: ["100", "50", "150", "200"], correct: 0, explanation: "50% of 200 = 200 × 50/100 = 100." }
                ]
            },
            {
                title: "Basic Algebra",
                questions: [
                    { type: "math", question: "If x + 5 = 12, what is x?", options: ["7", "17", "5", "12"], correct: 0, explanation: "x + 5 = 12, so x = 12 - 5 = 7." },
                    { type: "math", question: "If 3y = 18, what is y?", options: ["6", "54", "3", "15"], correct: 0, explanation: "3y = 18, so y = 18 ÷ 3 = 6." },
                    { type: "math", question: "What is the value of 2a + 3 when a = 4?", options: ["11", "8", "14", "7"], correct: 0, explanation: "2a + 3 = 2(4) + 3 = 8 + 3 = 11." },
                    { type: "math", question: "If x - 7 = 3, what is x?", options: ["10", "4", "-4", "21"], correct: 0, explanation: "x - 7 = 3, so x = 3 + 7 = 10." },
                    { type: "math", question: "Simplify: 5x + 3x", options: ["8x", "15x", "8x²", "2x"], correct: 0, explanation: "5x + 3x = (5+3)x = 8x." }
                ]
            }
        ],
        science: [
            {
                title: "Motion & Forces",
                questions: [
                    { type: "science", question: "What is speed?", options: ["Distance traveled per unit time", "Force applied", "Weight of object", "Size of object"], correct: 0, explanation: "Speed = Distance ÷ Time. It tells how fast something is moving." },
                    { type: "science", question: "What is the unit of speed?", options: ["m/s or km/h", "kg", "Newtons", "Joules"], correct: 0, explanation: "Speed is measured in meters per second (m/s) or kilometers per hour (km/h)." },
                    { type: "science", question: "What is friction?", options: ["Force that opposes motion", "Force that causes motion", "Type of energy", "Speed of object"], correct: 0, explanation: "Friction is a force that opposes or slows down motion between two surfaces." },
                    { type: "science", question: "Which force pulls objects toward Earth?", options: ["Gravity", "Friction", "Magnetism", "Electricity"], correct: 0, explanation: "Gravity is the force that pulls objects toward the center of the Earth." },
                    { type: "science", question: "What is the SI unit of force?", options: ["Newton", "Joule", "Watt", "Meter"], correct: 0, explanation: "Force is measured in Newtons (N), named after Sir Isaac Newton." }
                ]
            },
            {
                title: "Electricity & Circuits",
                questions: [
                    { type: "science", question: "What is needed to complete a circuit?", options: ["Conductors and power source", "Only wire", "Only battery", "Only bulb"], correct: 0, explanation: "A complete circuit needs a power source, conductors (wires), and a load (bulb)." },
                    { type: "science", question: "Which is a conductor of electricity?", options: ["Copper", "Rubber", "Plastic", "Wood"], correct: 0, explanation: "Copper is an excellent conductor of electricity, used in electrical wires." },
                    { type: "science", question: "What happens when you close a switch?", options: ["Circuit completes, bulb glows", "Circuit breaks", "Nothing happens", "Battery dies"], correct: 0, explanation: "Closing a switch completes the circuit, allowing current to flow and bulb to glow." },
                    { type: "science", question: "Which is an insulator?", options: ["Plastic", "Copper", "Iron", "Aluminum"], correct: 0, explanation: "Plastic is an insulator - it does not allow electricity to pass through." },
                    { type: "science", question: "What does a battery provide?", options: ["Electrical energy", "Light energy", "Sound energy", "Heat energy"], correct: 0, explanation: "A battery provides electrical energy to power devices." }
                ]
            }
        ],
        english: [
            {
                title: "Parts of Speech",
                questions: [
                    { type: "english", question: "Which is an adverb?", options: ["Quickly", "Beautiful", "Happy", "Run"], correct: 0, explanation: "Adverbs describe verbs, adjectives, or other adverbs. 'Quickly' describes how something is done." },
                    { type: "english", question: "What type of word is 'the'?", options: ["Article", "Noun", "Verb", "Adjective"], correct: 0, explanation: "'The' is a definite article used before nouns." },
                    { type: "english", question: "Which is a preposition?", options: ["Under", "Happy", "Run", "Big"], correct: 0, explanation: "Prepositions show location or relationship: under, on, in, at, etc." },
                    { type: "english", question: "What type of word connects clauses?", options: ["Conjunction", "Pronoun", "Adverb", "Preposition"], correct: 0, explanation: "Conjunctions connect words or clauses: and, but, or, because, etc." },
                    { type: "english", question: "Which is an interjection?", options: ["Wow!", "He", "Quickly", "Under"], correct: 0, explanation: "Interjections express strong feelings: Wow! Oh! Hey! Alas!" }
                ]
            },
            {
                title: "Reading & Writing",
                questions: [
                    { type: "english", question: "What is a thesis statement?", options: ["Main argument of an essay", "Title of the essay", "Last sentence", "Supporting detail"], correct: 0, explanation: "A thesis statement presents the main argument or claim of an essay." },
                    { type: "english", question: "What is figurative language?", options: ["Words with meanings beyond literal", "Technical words", "Simple words", "New words"], correct: 0, explanation: "Figurative language uses words in creative ways: metaphors, similes, etc." },
                    { type: "english", question: "What is a metaphor?", options: ["Comparison without 'like' or 'as'", "A question", "An exclamation", "A comparison with 'like'"], correct: 0, explanation: "A metaphor directly compares two things: 'Time is money.' (no 'like' or 'as')." },
                    { type: "english", question: "What is a simile?", options: ["Comparison using 'like' or 'as'", "A rhyme", "A metaphor", "Alliteration"], correct: 0, explanation: "A simile compares using 'like' or 'as': 'Brave as a lion', 'Fast like a cheetah'." },
                    { type: "english", question: "What is the purpose of a persuasive essay?", options: ["To convince the reader", "To inform", "To entertain", "To describe"], correct: 0, explanation: "A persuasive essay tries to convince the reader to agree with the writer's opinion." }
                ]
            }
        ],
        social: [
            {
                title: "Ancient Civilizations",
                questions: [
                    { type: "social", question: "Where did the Indus Valley Civilization exist?", options: ["Northwest India", "South India", "East India", "Central India"], correct: 0, explanation: "The Indus Valley Civilization existed in northwest India (modern Pakistan and Gujarat)." },
                    { type: "social", question: "What was the main city of Indus Valley?", options: ["Mohenjo-daro", "Delhi", "Mumbai", "Kolkata"], correct: 0, explanation: "Mohenjo-daro was one of the largest cities of the Indus Valley Civilization." },
                    { type: "social", question: "What was special about Indus Valley towns?", options: ["Well-planned streets and drainage", "No buildings", "Only tents", "Made of wood only"], correct: 0, explanation: "Indus Valley towns had grid-pattern streets and advanced drainage systems." },
                    { type: "social", question: "What did they use for trade?", options: ["Standardized weights", "No trade", "Only gifts", "Paper money"], correct: 0, explanation: "They used standardized weights and measures for trade." },
                    { type: "social", question: "What is the Great Bath?", options: ["A large public swimming pool", "A river", "A well", "A tank"], correct: 0, explanation: "The Great Bath at Mohenjo-daro was a large public bathing tank." }
                ]
            },
            {
                title: "Map Skills",
                questions: [
                    { type: "social", question: "What does a contour line show?", options: ["Elevation and shape of land", "Roads", "Rivers", "Cities"], correct: 0, explanation: "Contour lines connect points of equal elevation on a map." },
                    { type: "social", question: "What is a legend/key on a map?", options: ["Explains symbols used", "Title of map", "Scale", "Direction"], correct: 0, explanation: "A legend explains the symbols and colors used on a map." },
                    { type: "social", question: "What does scale show on a map?", options: ["Distance relationship", "Direction", "Elevation", "Climate"], correct: 0, explanation: "Scale shows the relationship between map distance and actual distance." },
                    { type: "social", question: "Which direction is always at the top of a map?", options: ["North", "South", "East", "West"], correct: 0, explanation: "By convention, North is always at the top of a map." },
                    { type: "social", question: "What is a physical map?", options: ["Shows natural features", "Shows cities only", "Shows roads only", "Shows boundaries only"], correct: 0, explanation: "Physical maps show natural features like mountains, rivers, and forests." }
                ]
            }
        ]
    },
    7: {
        math: [
            {
                title: "Integers",
                questions: [
                    { type: "math", question: "What is -15 + 8?", options: ["-7", "7", "-23", "23"], correct: 0, explanation: "-15 + 8 = -7. On number line, start at -15, move 8 right." },
                    { type: "math", question: "What is -12 × -4?", options: ["48", "-48", "16", "-16"], correct: 0, explanation: "Negative × Negative = Positive. -12 × -4 = 48." },
                    { type: "math", question: "What is (-6)²?", options: ["36", "-36", "12", "-12"], correct: 0, explanation: "(-6)² = (-6) × (-6) = 36." },
                    { type: "math", question: "What is -20 ÷ -5?", options: ["4", "-4", "100", "-100"], correct: 0, explanation: "Negative ÷ Negative = Positive. -20 ÷ -5 = 4." },
                    { type: "math", question: "Order from least to greatest: -3, 5, -7, 0", options: ["-7, -3, 0, 5", "-3, -7, 0, 5", "0, -3, -7, 5", "5, 0, -3, -7"], correct: 0, explanation: "-7 is smallest, then -3, then 0, then 5 is largest." }
                ]
            },
            {
                title: "Fractions & Decimals",
                questions: [
                    { type: "math", question: "What is 3/4 - 1/4?", options: ["1/2", "2/8", "2/4", "Both A and C"], correct: 3, explanation: "3/4 - 1/4 = 2/4 = 1/2. Both 2/4 and 1/2 are correct." },
                    { type: "math", question: "Convert 0.125 to fraction:", options: ["1/8", "125/100", "1/4", "1/2"], correct: 0, explanation: "0.125 = 125/1000 = 1/8." },
                    { type: "math", question: "What is 2/3 × 3/4?", options: ["1/2", "6/12", "5/7", "Both A and B"], correct: 3, explanation: "2/3 × 3/4 = 6/12 = 1/2. Both are equivalent." },
                    { type: "math", question: "What is 1 ÷ 2/3?", options: ["3/2", "2/3", "2/6", "1/6"], correct: 0, explanation: "1 ÷ 2/3 = 1 × 3/2 = 3/2. Flip and multiply." },
                    { type: "math", question: "What is -3/5 + 1/5?", options: ["-2/5", "2/5", "-4/5", "4/5"], correct: 0, explanation: "-3/5 + 1/5 = -2/5." }
                ]
            },
            {
                title: "Ratios & Percentages",
                questions: [
                    { type: "math", question: "What is 25% of 80?", options: ["20", "25", "40", "16"], correct: 0, explanation: "25% of 80 = 80 × 25/100 = 20." },
                    { type: "math", question: "A shirt costs ₹400 after 20% discount. Original price?", options: ["₹500", "₹480", "₹320", "₹300"], correct: 0, explanation: "If 80% = ₹400, then 100% = ₹400 × 100/80 = ₹500." },
                    { type: "math", question: "Simplify ratio 18:24:", options: ["3:4", "4:3", "6:8", "9:12"], correct: 0, explanation: "18:24 = 3:4 (divide both by 6)." },
                    { type: "math", question: "If 3:5 = x:20, what is x?", options: ["12", "15", "10", "8"], correct: 0, explanation: "3/5 = x/20, so x = 3×20/5 = 12." },
                    { type: "math", question: "What percentage is 45 of 180?", options: ["25%", "20%", "30%", "35%"], correct: 0, explanation: "45/180 × 100 = 25%." }
                ]
            }
        ],
        science: [
            {
                title: "Heat & Temperature",
                questions: [
                    { type: "science", question: "What is the normal body temperature?", options: ["37°C", "36°C", "38°C", "35°C"], correct: 0, explanation: "Normal human body temperature is approximately 37°C (98.6°F)." },
                    { type: "science", question: "Which thermometer measures very low temperatures?", options: ["Clinical thermometer", "Laboratory thermometer", "Mercury thermometer", "Digital thermometer"], correct: 1, explanation: "Laboratory thermometers can measure a wider range including very low temperatures." },
                    { type: "science", question: "What is the boiling point of water?", options: ["100°C", "90°C", "110°C", "80°C"], correct: 0, explanation: "Water boils at 100°C at standard atmospheric pressure." },
                    { type: "science", question: "Heat transfers through solids by:", options: ["Conduction", "Convection", "Radiation", "Evaporation"], correct: 0, explanation: "Conduction is heat transfer through direct contact in solids." },
                    { type: "science", question: "Which is a good conductor of heat?", options: ["Copper", "Wood", "Plastic", "Rubber"], correct: 0, explanation: "Copper is an excellent conductor of heat." }
                ]
            },
            {
                title: "Acids, Bases & Salts",
                questions: [
                    { type: "science", question: "Litmus paper turns red in:", options: ["Acid", "Base", "Salt", "Water"], correct: 0, explanation: "Litmus paper turns red in acidic solutions." },
                    { type: "science", question: "Which is a natural acid?", options: ["Citric acid", "Sodium hydroxide", "Table salt", "Sugar"], correct: 0, explanation: "Citric acid is found naturally in lemons and oranges." },
                    { type: "science", question: "What is pH 7?", options: ["Neutral", "Acidic", "Basic", "Very acidic"], correct: 0, explanation: "pH 7 is neutral (pure water)." },
                    { type: "science", question: "Which is a base?", options: ["Baking soda", "Lemon juice", "Vinegar", "Salt water"], correct: 0, explanation: "Baking soda (sodium bicarbonate) is a base." },
                    { type: "science", question: "Acid + Base = ?", options: ["Salt + Water", "Only salt", "Only water", "Gas"], correct: 0, explanation: "Acid + Base → Salt + Water (neutralization reaction)." }
                ]
            }
        ],
        english: [
            {
                title: "Advanced Grammar",
                questions: [
                    { type: "english", question: "Which is a complex sentence?", options: ["When it rained, we stayed inside.", "I went home.", "She sings well.", "They play daily."], correct: 0, explanation: "A complex sentence has an independent clause and at least one dependent clause." },
                    { type: "english", question: "Identify the gerund: 'Swimming is fun.'", options: ["Swimming", "Is", "Fun", "Swim"], correct: 0, explanation: "'Swimming' is a gerund - a verb form used as a noun." },
                    { type: "english", question: "What is an infinitive?", options: ["To + verb", "Verb + ing", "Verb + ed", "Verb + s"], correct: 0, explanation: "An infinitive is 'to' + base form of verb: to run, to eat, to study." },
                    { type: "english", question: "Which uses correct subject-verb agreement?", options: ["Everyone is welcome.", "Everyone are welcome.", "Everyone were welcome.", "Everyone am welcome."], correct: 0, explanation: "'Everyone' is singular, so it takes 'is'." },
                    { type: "english", question: "What is a direct object?", options: ["Receives the action of the verb", "Describes the subject", "Is the doer of action", "Connects clauses"], correct: 0, explanation: "A direct object receives the action: 'She kicked the ball' - 'ball' is direct object." }
                ]
            },
            {
                title: "Literature & Poetry",
                questions: [
                    { type: "english", question: "What is a stanza in poetry?", options: ["A group of lines", "A single line", "The title", "The author"], correct: 0, explanation: "A stanza is a group of lines forming a unit in a poem, like a paragraph in prose." },
                    { type: "english", question: "What is rhyme scheme?", options: ["Pattern of rhyming words", "Number of lines", "Topic of poem", "Type of poem"], correct: 0, explanation: "Rhyme scheme is the pattern of rhymes at the end of each line (e.g., AABB, ABAB)." },
                    { type: "english", question: "What is an alliteration?", options: ["Repetition of initial consonant sounds", "Comparison using like", "Exaggeration", "Personification"], correct: 0, explanation: "Alliteration repeats beginning sounds: 'Peter Piper picked...'." },
                    { type: "english", question: "What is personification?", options: ["Giving human qualities to non-human things", "Using human characters", "A type of poem", "A metaphor"], correct: 0, explanation: "Personification gives human traits to non-human things: 'The wind whispered'." },
                    { type: "english", question: "What is the climax of a story?", options: ["The turning point or highest tension", "The beginning", "The ending", "The title"], correct: 0, explanation: "The climax is the most exciting or intense part of the story." }
                ]
            }
        ],
        social: [
            {
                title: "Medieval India",
                questions: [
                    { type: "social", question: "Who founded the Mughal Empire in India?", options: ["Babur", "Akbar", "Shah Jahan", "Aurangzeb"], correct: 0, explanation: "Babur founded the Mughal Empire in India after the Battle of Panipat in 1526." },
                    { type: "social", question: "Which Mughal emperor was known for religious tolerance?", options: ["Akbar", "Aurangzeb", "Babur", "Shah Jahan"], correct: 0, explanation: "Akbar was known for his policy of religious tolerance and established Din-i-Ilahi." },
                    { type: "social", question: "The Taj Mahal was built by:", options: ["Shah Jahan", "Akbar", "Babur", "Aurangzeb"], correct: 0, explanation: "Shah Jahan built the Taj Mahal in memory of his wife Mumtaz Mahal." },
                    { type: "social", question: "What was the Battle of Panipat?", options: ["First battle establishing Mughal rule", "A trade agreement", "A cultural festival", "A religious ceremony"], correct: 0, explanation: "The First Battle of Panipat (1526) established Mughal rule in India." },
                    { type: "social", question: "Who was Razia Sultana?", options: ["First female ruler of Delhi", "A famous poet", "A warrior queen", "A religious leader"], correct: 0, explanation: "Razia Sultana was the first female ruler of the Delhi Sultanate (1236-1240)." }
                ]
            },
            {
                title: "Indian Constitution",
                questions: [
                    { type: "social", question: "Who is called the Father of the Indian Constitution?", options: ["Dr. B.R. Ambedkar", "Mahatma Gandhi", "Jawaharlal Nehru", "Rajendra Prasad"], correct: 0, explanation: "Dr. B.R. Ambedkar is called the Father of the Indian Constitution." },
                    { type: "social", question: "When was the Indian Constitution adopted?", options: ["26 January 1950", "15 August 1947", "26 November 1949", "2 October 1950"], correct: 0, explanation: "The Indian Constitution came into effect on 26 January 1950 (Republic Day)." },
                    { type: "social", question: "How many fundamental rights are there?", options: ["6", "5", "7", "8"], correct: 0, explanation: "There are 6 fundamental rights in the Indian Constitution." },
                    { type: "social", question: "Which is a fundamental right?", options: ["Right to Equality", "Right to vote", "Right to pay taxes", "Right to study"], correct: 0, explanation: "Right to Equality is a fundamental right ensuring equal treatment before law." },
                    { type: "social", question: "What is democracy?", options: ["Rule by people through elected representatives", "Rule by king", "Rule by military", "Rule by rich"], correct: 0, explanation: "Democracy means government by the people through their elected representatives." }
                ]
            }
        ]
    },
    8: {
        math: [
            {
                title: "Linear Equations",
                questions: [
                    { type: "math", question: "Solve: 2x + 5 = 13", options: ["x = 4", "x = 9", "x = 3", "x = 6"], correct: 0, explanation: "2x + 5 = 13 → 2x = 8 → x = 4." },
                    { type: "math", question: "Solve: 3x - 7 = 2x + 1", options: ["x = 8", "x = 6", "x = 4", "x = 10"], correct: 0, explanation: "3x - 7 = 2x + 1 → x = 8." },
                    { type: "math", question: "If x = 3, what is 2x² + 1?", options: ["19", "7", "13", "25"], correct: 0, explanation: "2(3)² + 1 = 2(9) + 1 = 18 + 1 = 19." },
                    { type: "math", question: "Solve: 5(x - 2) = 15", options: ["x = 5", "x = 3", "x = 7", "x = 1"], correct: 0, explanation: "5(x - 2) = 15 → x - 2 = 3 → x = 5." },
                    { type: "math", question: "What is the value of x: x/4 = 12?", options: ["48", "3", "16", "8"], correct: 0, explanation: "x/4 = 12 → x = 12 × 4 = 48." }
                ]
            },
            {
                title: "Geometry",
                questions: [
                    { type: "math", question: "What is the angle sum property of a triangle?", options: ["180°", "360°", "90°", "270°"], correct: 0, explanation: "The sum of all angles in a triangle is always 180°." },
                    { type: "math", question: "What is the Pythagorean theorem?", options: ["a² + b² = c²", "a + b = c", "a² - b² = c²", "2a + 2b = c"], correct: 0, explanation: "In a right triangle, the square of hypotenuse equals sum of squares of other two sides." },
                    { type: "math", question: "Find the hypotenuse: sides 3 and 4.", options: ["5", "7", "12", "25"], correct: 0, explanation: "3² + 4² = 9 + 16 = 25, so c = √25 = 5." },
                    { type: "math", question: "What is the area of a triangle with base 10 and height 5?", options: ["25 sq units", "50 sq units", "15 sq units", "20 sq units"], correct: 0, explanation: "Area = ½ × base × height = ½ × 10 × 5 = 25 sq units." },
                    { type: "math", question: "What is the sum of exterior angles of any polygon?", options: ["360°", "180°", "540°", "Depends on sides"], correct: 0, explanation: "The sum of exterior angles of any convex polygon is always 360°." }
                ]
            },
            {
                title: "Data Handling",
                questions: [
                    { type: "math", question: "What is the mean of 4, 6, 8, 10, 12?", options: ["8", "10", "6", "9"], correct: 0, explanation: "Mean = (4+6+8+10+12)/5 = 40/5 = 8." },
                    { type: "math", question: "What is the median of 3, 5, 7, 9, 11?", options: ["7", "5", "9", "6"], correct: 0, explanation: "Median is the middle value when arranged in order: 7." },
                    { type: "math", question: "In the data 2, 3, 3, 5, 7, what is the mode?", options: ["3", "2", "5", "4"], correct: 0, explanation: "Mode is the most frequent value. 3 appears twice, so mode = 3." },
                    { type: "math", question: "What is probability of getting heads in one coin toss?", options: ["1/2", "1", "0", "1/4"], correct: 0, explanation: "A coin has 2 sides, so P(heads) = 1/2." },
                    { type: "math", question: "Range of data: 15, 22, 8, 30, 12", options: ["22", "17", "30", "12"], correct: 0, explanation: "Range = Highest - Lowest = 30 - 8 = 22." }
                ]
            }
        ],
        science: [
            {
                title: "Chemical Effects of Current",
                questions: [
                    { type: "science", question: "Which liquid conducts electricity?", options: ["Salt water", "Pure water", "Oil", "Sugar water"], correct: 0, explanation: "Salt water conducts electricity because it contains ions." },
                    { type: "science", question: "What is electrolysis?", options: ["Using electricity to decompose chemicals", "Heating chemicals", "Mixing chemicals", "Freezing chemicals"], correct: 0, explanation: "Electrolysis uses electric current to break down compounds." },
                    { type: "science", question: "Electroplating is used to:", options: ["Coat metals with thin layer", "Generate electricity", "Measure temperature", "Clean water"], correct: 0, explanation: "Electroplating coats objects with a thin layer of metal using electricity." },
                    { type: "science", question: "Why are LED bulbs better than CFL?", options: ["More energy efficient", "Cheaper", "Brighter", "Last longer"], correct: 0, explanation: "LED bulbs are more energy efficient and last longer than CFL bulbs." },
                    { type: "science", question: "What happens when current passes through solution?", options: ["Chemical reaction occurs", "Nothing happens", "Temperature drops", "Color changes only"], correct: 0, explanation: "When current passes through a solution, chemical reactions (electrolysis) occur." }
                ]
            },
            {
                title: "Natural Phenomena",
                questions: [
                    { type: "science", question: "What causes lightning?", options: ["Discharge of static electricity in clouds", "Rain", "Wind", "Sunlight"], correct: 0, explanation: "Lightning is caused by electrical discharge between clouds or between cloud and ground." },
                    { type: "science", question: "What is thunder?", options: ["Sound caused by lightning", "Clouds colliding", "Wind blowing", "Rain falling"], correct: 0, explanation: "Thunder is the sound produced by the rapid expansion of air heated by lightning." },
                    { type: "science", question: "An earthquake measures on:", options: ["Richter scale", "Celsius scale", "Kilogram scale", "Meter scale"], correct: 0, explanation: "Earthquakes are measured on the Richter scale." },
                    { type: "science", question: "What is the eye of a cyclone?", options: ["Calm center", "Most windy part", "Raining heavily", "Thunder area"], correct: 0, explanation: "The eye of a cyclone is the calm center with no wind or rain." },
                    { type: "science", question: "Where do most earthquakes occur?", options: ["Near tectonic plate boundaries", "In deserts", "In oceans only", "At poles"], correct: 0, explanation: "Most earthquakes occur near the boundaries of tectonic plates." }
                ]
            }
        ],
        english: [
            {
                title: "Grammar & Composition",
                questions: [
                    { type: "english", question: "What is a conditional sentence?", options: ["If-then sentence", "A question", "A command", "An exclamation"], correct: 0, explanation: "Conditional sentences use 'if' to express conditions: 'If it rains, we will stay inside.'" },
                    { type: "english", question: "Identify the modal: 'She can swim.'", options: ["can", "She", "swim", "is"], correct: 0, explanation: "'Can' is a modal verb expressing ability." },
                    { type: "english", question: "What is reported speech?", options: ["Reporting what someone else said", "Direct quotation", "First person account", "A poem"], correct: 0, explanation: "Reported speech reports what someone said without using their exact words." },
                    { type: "english", question: "Which is active voice?", options: ["The cat caught the mouse.", "The mouse was caught.", "The mouse is caught.", "The mouse has been caught."], correct: 0, explanation: "Active voice: Subject performs action. 'Cat caught mouse' - cat is doing the catching." },
                    { type: "english", question: "What is an antecedent?", options: ["Word a pronoun refers to", "First word of sentence", "Title of story", "Opposite of conclusion"], correct: 0, explanation: "An antecedent is the noun that a pronoun refers to: 'Ravi lost his book' - Ravi is antecedent of 'his'." }
                ]
            },
            {
                title: "Writing Skills",
                questions: [
                    { type: "english", question: "What is an essay?", options: ["Short piece of writing on a subject", "A poem", "A story", "A letter"], correct: 0, explanation: "An essay is a short piece of writing that discusses a subject and presents arguments." },
                    { type: "english", question: "What is a thesis statement?", options: ["Main argument of essay", "Title", "First paragraph only", "Conclusion"], correct: 0, explanation: "A thesis statement presents the main argument or claim of an essay." },
                    { type: "english", question: "What is a topic sentence?", options: ["Main idea of a paragraph", "First word", "Title", "Last sentence"], correct: 0, explanation: "A topic sentence introduces the main idea of a paragraph." },
                    { type: "english", question: "What is an expository essay?", options: ["Informative essay explaining a topic", "Personal story", "Persuasive argument", "Poetry"], correct: 0, explanation: "An expository essay explains or informs about a topic objectively." },
                    { type: "english", question: "What is proofreading?", options: ["Checking for errors before publishing", "Writing the first draft", "Researching a topic", "Outlining ideas"], correct: 0, explanation: "Proofreading is checking the final draft for grammar, spelling, and punctuation errors." }
                ]
            }
        ],
        social: [
            {
                title: "Indian Freedom Movement",
                questions: [
                    { type: "social", question: "When did the First War of Independence occur?", options: ["1857", "1947", "1930", "1920"], correct: 0, explanation: "The First War of Independence (Sepoy Mutiny) occurred in 1857." },
                    { type: "social", question: "Who was Mangal Pandey?", options: ["Soldier who started 1857 revolt", "A farmer", "A teacher", "A businessman"], correct: 0, explanation: "Mangal Pandey was a soldier whose actions triggered the 1857 revolt." },
                    { type: "social", question: "What was the Non-Cooperation Movement?", options: ["Boycott of British institutions", "Supporting British rule", "A trade agreement", "A religious movement"], correct: 0, explanation: "Non-Cooperation Movement (1920-22) boycotted British goods, schools, and courts." },
                    { type: "social", question: "What was the Civil Disobedience Movement?", options: ["Breaking unjust laws peacefully", "Following all laws", "Violent protest", "Trade agreement"], correct: 0, explanation: "Civil Disobedience (1930-34) involved breaking British laws like salt tax peacefully." },
                    { type: "social", question: "Who gave the slogan 'Jai Hind'?", options: ["Subhas Chandra Bose", "Mahatma Gandhi", "Jawaharlal Nehru", "Bhagat Singh"], correct: 0, explanation: "Subhas Chandra Bose popularized 'Jai Hind' as a salutation." }
                ]
            },
            {
                title: "Resources & Development",
                questions: [
                    { type: "social", question: "What are renewable resources?", options: ["Resources that can be replenished", "Resources that cannot be renewed", "Only solar energy", "Only water"], correct: 0, explanation: "Renewable resources can be naturally replenished: solar, wind, water, biomass." },
                    { type: "social", question: "Which is a non-renewable resource?", options: ["Coal", "Solar energy", "Wind", "Water"], correct: 0, explanation: "Coal is non-renewable because it takes millions of years to form." },
                    { type: "social", question: "What is conservation?", options: ["Protecting natural resources", "Using more resources", "Building factories", "Cutting trees"], correct: 0, explanation: "Conservation means protecting and preserving natural resources for future." },
                    { type: "social", question: "What is deforestation?", options: ["Cutting down forests", "Planting trees", "Protecting wildlife", "Building dams"], correct: 0, explanation: "Deforestation is clearing forests for other land uses, causing environmental problems." },
                    { type: "social", question: "Which is a method of soil conservation?", options: ["Terrace farming", "Overgrazing", "Deforestation", "Urbanization"], correct: 0, explanation: "Terrace farming reduces soil erosion on hill slopes." }
                ]
            }
        ]
    },
    9: {
        math: [
            {
                title: "Polynomials",
                questions: [
                    { type: "math", question: "What is the degree of 3x² + 2x - 1?", options: ["2", "3", "1", "0"], correct: 0, explanation: "Degree is the highest power of variable. Here it's x², so degree = 2." },
                    { type: "math", question: "Simplify: 3x + 5x", options: ["8x", "15x", "8x²", "2x"], correct: 0, explanation: "3x + 5x = (3+5)x = 8x (like terms)." },
                    { type: "math", question: "What is (x + 2)(x + 3)?", options: ["x² + 5x + 6", "x² + 6x + 5", "x² + 5x + 5", "x² + 6x + 6"], correct: 0, explanation: "(x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6." },
                    { type: "math", question: "Factor: x² - 9", options: ["(x+3)(x-3)", "(x+9)(x-1)", "(x-3)²", "(x+3)²"], correct: 0, explanation: "x² - 9 = x² - 3² = (x+3)(x-3) [difference of squares]." },
                    { type: "math", question: "What is the value of x² - 4x + 4 when x = 3?", options: ["1", "4", "7", "0"], correct: 0, explanation: "3² - 4(3) + 4 = 9 - 12 + 4 = 1." }
                ]
            },
            {
                title: "Coordinate Geometry",
                questions: [
                    { type: "math", question: "What are coordinates of origin?", options: ["(0, 0)", "(1, 1)", "(0, 1)", "(1, 0)"], correct: 0, explanation: "The origin is the point where both x and y axes meet, at (0, 0)." },
                    { type: "math", question: "In which quadrant is point (3, -2)?", options: ["Fourth", "First", "Second", "Third"], correct: 0, explanation: "x positive, y negative = Fourth quadrant." },
                    { type: "math", question: "What is the distance of (4, 0) from origin?", options: ["4", "0", "16", "8"], correct: 0, explanation: "Distance = √(4² + 0²) = √16 = 4." },
                    { type: "math", question: "Point (-2, 5) lies in which quadrant?", options: ["Second", "First", "Third", "Fourth"], correct: 0, explanation: "x negative, y positive = Second quadrant." },
                    { type: "math", question: "What is the x-coordinate of point (7, 3)?", options: ["7", "3", "10", "21"], correct: 0, explanation: "The x-coordinate (abscissa) is the first number: 7." }
                ]
            },
            {
                title: "Euclid's Geometry",
                questions: [
                    { type: "math", question: "How many dimensions does a solid have?", options: ["3", "2", "1", "0"], correct: 0, explanation: "A solid has 3 dimensions: length, breadth, and height." },
                    { type: "math", question: "What is a plane figure?", options: ["2D shape with no thickness", "3D shape", "A line", "A point"], correct: 0, explanation: "A plane figure is two-dimensional, having only length and breadth." },
                    { type: "math", question: "A line has how many endpoints?", options: ["0", "1", "2", "3"], correct: 0, explanation: "A line extends infinitely in both directions, so it has 0 endpoints." },
                    { type: "math", question: "What is a line segment?", options: ["Part of a line with 2 endpoints", "Infinite line", "A curve", "A point"], correct: 0, explanation: "A line segment is a part of a line bounded by two distinct endpoints." },
                    { type: "math", question: "How many rays can be drawn from a point?", options: ["Infinite", "1", "2", "4"], correct: 0, explanation: "From any point, infinite rays can be drawn in all directions." }
                ]
            }
        ],
        science: [
            {
                title: "Matter in Our Surroundings",
                questions: [
                    { type: "science", question: "What is the SI unit of temperature?", options: ["Kelvin", "Celsius", "Fahrenheit", "Joule"], correct: 0, explanation: "Kelvin (K) is the SI unit of temperature." },
                    { type: "science", question: "At what temperature does water boil in Kelvin?", options: ["373 K", "373°C", "100 K", "273 K"], correct: 0, explanation: "Water boils at 100°C = 373 K (K = °C + 273)." },
                    { type: "science", question: "What is sublimation?", options: ["Solid to gas directly", "Liquid to gas", "Gas to liquid", "Solid to liquid"], correct: 0, explanation: "Sublimation is when a solid changes directly to gas without becoming liquid." },
                    { type: "science", question: "Which property increases with temperature?", options: ["Kinetic energy", "Mass", "Weight", "Density"], correct: 0, explanation: "Kinetic energy of particles increases as temperature rises." },
                    { type: "science", question: "What is latent heat?", options: ["Heat absorbed during state change", "Heat for temperature rise", "Body heat", "Solar heat"], correct: 0, explanation: "Latent heat is absorbed/released during change of state without temperature change." }
                ]
            },
            {
                title: "Atoms and Molecules",
                questions: [
                    { type: "science", question: "What is an atom?", options: ["Smallest particle of an element", "A molecule", "A cell", "An ion"], correct: 0, explanation: "An atom is the smallest unit of an element that retains its properties." },
                    { type: "science", question: "What is a molecule?", options: ["Two or more atoms bonded together", "Single atom", "An ion", "A compound only"], correct: 0, explanation: "A molecule is formed when two or more atoms are chemically bonded." },
                    { type: "science", question: "What is the atomic number of carbon?", options: ["6", "12", "4", "8"], correct: 0, explanation: "Carbon has 6 protons, so its atomic number is 6." },
                    { type: "science", question: "What is the formula of water?", options: ["H₂O", "HO₂", "H₂O₂", "OH"], correct: 0, explanation: "Water is made of 2 hydrogen atoms and 1 oxygen atom: H₂O." },
                    { type: "science", question: "What is Avogadro's number approximately?", options: ["6.022 × 10²³", "6.022 × 10²²", "3.14 × 10²³", "6.022 × 10²⁴"], correct: 0, explanation: "Avogadro's number is approximately 6.022 × 10²³ particles per mole." }
                ]
            }
        ],
        english: [
            {
                title: "Grammar & Usage",
                questions: [
                    { type: "english", question: "What is a phrasal verb?", options: ["Verb + preposition/adverb with new meaning", "A verb in phrase", "A long verb", "Two verbs together"], correct: 0, explanation: "Phrasal verbs combine verb with preposition: 'give up' means surrender." },
                    { type: "english", question: "Which is a correct use of 'who'?", options: ["Who is coming?", "Whom is coming?", "Whose is coming?", "Who's book is this?"], correct: 0, explanation: "'Who' is used as subject: 'Who is coming?' (correct)." },
                    { type: "english", question: "What is a cleft sentence?", options: ["Sentence split for emphasis", "Two sentences joined", "A compound sentence", "A run-on sentence"], correct: 0, explanation: "A cleft sentence emphasizes part of the sentence: 'It was John who won.'" },
                    { type: "english", question: "What is voice change (active to passive)?", options: ["Object becomes subject", "Subject becomes object", "Verb changes tense", "No change needed"], correct: 0, explanation: "In passive voice, the object of active becomes the subject." },
                    { type: "english", question: "Which is a complex sentence?", options: ["Although tired, she studied.", "She is tired.", "She studied.", "Tired girl studied."], correct: 0, explanation: "Complex sentence has dependent clause (Although tired) + independent clause." }
                ]
            },
            {
                title: "Literature",
                questions: [
                    { type: "english", question: "What is a novel?", options: ["Long fictional narrative", "Short story", "Poem", "Play"], correct: 0, explanation: "A novel is a long fictional narrative dealing with characters and events." },
                    { type: "english", question: "What is a protagonist?", options: ["Main character", "Villain", "Narrator", "Minor character"], correct: 0, explanation: "The protagonist is the main character around whom the story revolves." },
                    { type: "english", question: "What is an antagonist?", options: ["Character opposing the protagonist", "Main character", "Narrator", "Hero"], correct: 0, explanation: "The antagonist is the character who opposes or creates conflict for the protagonist." },
                    { type: "english", question: "What is an allegory?", options: ["Story with hidden moral/political meaning", "A type of poem", "A comedy", "A biography"], correct: 0, explanation: "An allegory is a story that can be interpreted as having hidden meaning." },
                    { type: "english", question: "What is irony?", options: ["When opposite of expected happens", "Being funny", "Being serious", "Being sarcastic always"], correct: 0, explanation: "Irony occurs when outcome is different from what was expected." }
                ]
            }
        ],
        social: [
            {
                title: "Democratic Politics",
                questions: [
                    { type: "social", question: "What is a democracy?", options: ["Government by elected representatives", "Rule by one person", "Rule by military", "Direct voting on all issues"], correct: 0, explanation: "In a democracy, people elect representatives who govern on their behalf." },
                    { type: "social", question: "What is universal adult franchise?", options: ["Every adult can vote", "Only rich can vote", "Only men can vote", "Only educated can vote"], correct: 0, explanation: "Universal adult franchise means every citizen above 18 has right to vote." },
                    { type: "social", question: "What is a political party?", options: ["Group with shared political ideology", "A government", "An army", "A business"], correct: 0, explanation: "A political party is a group of people with similar political views who contest elections." },
                    { type: "social", question: "What is an election?", options: ["Process of choosing representatives", "A competition", "A celebration", "A holiday"], correct: 0, explanation: "An election is a process where citizens vote to choose their representatives." },
                    { type: "social", question: "What is opposition in politics?", options: ["Party not in power", "Ruling party", "Military", "Judiciary"], correct: 0, explanation: "The opposition is the party or parties not in government who criticize and check the ruling party." }
                ]
            },
            {
                title: "People & Environment",
                questions: [
                    { type: "social", question: "What is an ecosystem?", options: ["Living and non-living things interacting", "Only animals", "Only plants", "Only humans"], correct: 0, explanation: "An ecosystem includes all living organisms and their physical environment interacting together." },
                    { type: "social", question: "What is global warming?", options: ["Rising Earth's temperature", "Cooling of Earth", "Seasonal changes", "Day and night cycle"], correct: 0, explanation: "Global warming is the gradual increase in Earth's average temperature due to greenhouse gases." },
                    { type: "social", question: "What is ozone depletion?", options: ["Thinning of ozone layer", "Increase in ozone", "Ozone formation", "Ozone measurement"], correct: 0, explanation: "Ozone depletion is the wearing down of the ozone layer that protects us from UV rays." },
                    { type: "social", question: "What is sustainable development?", options: ["Development meeting present needs without compromising future", "Using all resources now", "No development", "Only industrial growth"], correct: 0, explanation: "Sustainable development meets current needs while preserving resources for future." },
                    { type: "social", question: "What is a carbon footprint?", options: ["Total greenhouse gases produced by activities", "Size of foot in carbon", "Carbon in soil", "Amount of carbon in air"], correct: 0, explanation: "Carbon footprint measures total greenhouse gases emitted by human activities." }
                ]
            }
        ]
    },
    10: {
        math: [
            {
                title: "Real Numbers",
                questions: [
                    { type: "math", question: "√2 is a:", options: ["Irrational number", "Rational number", "Integer", "Whole number"], correct: 0, explanation: "√2 cannot be expressed as p/q, so it's irrational." },
                    { type: "math", question: "HCF of 12 and 18:", options: ["6", "12", "18", "36"], correct: 0, explanation: "HCF(12,18) = 6 (largest number dividing both)." },
                    { type: "math", question: "LCM of 4 and 6:", options: ["12", "24", "2", "8"], correct: 0, explanation: "LCM(4,6) = 12 (smallest number divisible by both)." },
                    { type: "math", question: "What type of number is 0.333...?", options: ["Rational", "Irrational", "Natural", "Whole"], correct: 0, explanation: "0.333... = 1/3, which is rational (can be expressed as fraction)." },
                    { type: "math", question: "Product of HCF and LCM equals:", options: ["Product of two numbers", "Sum of numbers", "Difference of numbers", "Quotient of numbers"], correct: 0, explanation: "HCF × LCM = Product of two numbers." }
                ]
            },
            {
                title: "Quadratic Equations",
                questions: [
                    { type: "math", question: "What is the degree of x² + 3x + 2?", options: ["2", "3", "1", "0"], correct: 0, explanation: "The highest power of x is 2, so degree is 2." },
                    { type: "math", question: "Solve: x² - 5x + 6 = 0", options: ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = 5, 1"], correct: 0, explanation: "x² - 5x + 6 = (x-2)(x-3) = 0, so x = 2 or x = 3." },
                    { type: "math", question: "What is the discriminant of ax² + bx + c?", options: ["b² - 4ac", "b² + 4ac", "4ac - b²", "a² - 4bc"], correct: 0, explanation: "Discriminant D = b² - 4ac determines nature of roots." },
                    { type: "math", question: "If D > 0, roots are:", options: ["Real and distinct", "Real and equal", "Imaginary", "No roots"], correct: 0, explanation: "When discriminant is positive, the equation has two distinct real roots." },
                    { type: "math", question: "Solve: x² - 4 = 0", options: ["x = ±2", "x = 4", "x = 2", "x = -4"], correct: 0, explanation: "x² = 4, so x = ±√4 = ±2." }
                ]
            },
            {
                title: "Arithmetic Progressions",
                questions: [
                    { type: "math", question: "In AP: 2, 5, 8, 11... what is the common difference?", options: ["3", "2", "5", "8"], correct: 0, explanation: "Common difference d = 5-2 = 8-5 = 3." },
                    { type: "math", question: "What is the 10th term of AP: 3, 7, 11, 15...?", options: ["39", "35", "43", "41"], correct: 0, explanation: "a₁₀ = a + 9d = 3 + 9(4) = 3 + 36 = 39." },
                    { type: "math", question: "Sum of first n terms of AP:", options: ["n/2[2a + (n-1)d]", "na", "n²d", "2a + nd"], correct: 0, explanation: "Sₙ = n/2[2a + (n-1)d] or n/2(a + l) where l is last term." },
                    { type: "math", question: "Which AP is constant?", options: ["5, 5, 5, 5...", "1, 2, 3, 4...", "2, 4, 6, 8...", "10, 8, 6, 4..."], correct: 0, explanation: "In 5, 5, 5, 5... common difference is 0, so it's constant." },
                    { type: "math", question: "What is aₙ formula?", options: ["a + (n-1)d", "a + nd", "a - (n-1)d", "an + d"], correct: 0, explanation: "The nth term of AP: aₙ = a + (n-1)d." }
                ]
            }
        ],
        science: [
            {
                title: "Chemical Reactions & Equations",
                questions: [
                    { type: "science", question: "What is a chemical reaction?", options: ["Process forming new substances", "Physical change only", "Mixing without change", "State change only"], correct: 0, explanation: "A chemical reaction forms new substances with different properties." },
                    { type: "science", question: "In Fe₂O₃ + 2Al → Al₂O₃ + 2Fe, which is displacement?", options: ["Al displaces Fe", "Fe displaces Al", "O displaces both", "No displacement"], correct: 0, explanation: "Aluminum displaces iron from iron oxide (thermite reaction)." },
                    { type: "science", question: "What is oxidation?", options: ["Gain of oxygen / loss of hydrogen", "Loss of oxygen", "Gain of hydrogen", "Neither"], correct: 0, explanation: "Oxidation is gain of oxygen or loss of hydrogen by a substance." },
                    { type: "science", question: "What is a balanced equation?", options: ["Equal atoms on both sides", "More on left", "More on right", "No atoms shown"], correct: 0, explanation: "A balanced equation has same number of each type of atom on both sides." },
                    { type: "science", question: "Rusting of iron is:", options: ["Oxidation", "Reduction", "Decomposition", "No reaction"], correct: 0, explanation: "Rusting is oxidation of iron in presence of moisture and oxygen." }
                ]
            },
            {
                title: "Acids, Bases & Salts",
                questions: [
                    { type: "science", question: "What is pH scale range?", options: ["0-14", "1-10", "0-10", "1-14"], correct: 0, explanation: "pH scale ranges from 0 (most acidic) to 14 (most basic)." },
                    { type: "science", question: "Strong acid has pH:", options: ["Close to 0", "Close to 7", "Close to 14", "Exactly 7"], correct: 0, explanation: "Strong acids have low pH (close to 0)." },
                    { type: "science", question: "What is neutralization?", options: ["Acid + Base → Salt + Water", "Two acids mixing", "Two bases mixing", "Adding water"], correct: 0, explanation: "Neutralization reaction: Acid + Base produces salt and water." },
                    { type: "science", question: "Which indicator turns red in acid?", options: ["Litmus", "Methyl orange in base", "Phenolphthalein in acid", "None"], correct: 0, explanation: "Litmus turns red in acidic solutions." },
                    { type: "science", question: "What is the pH of pure water?", options: ["7", "0", "14", "5"], correct: 0, explanation: "Pure water is neutral with pH 7." }
                ]
            }
        ],
        english: [
            {
                title: "Advanced Grammar",
                questions: [
                    { type: "english", question: "What is an ellipsis?", options: ["Omission of words understood from context", "Three dots", "Long sentence", "A question"], correct: 0, explanation: "An ellipsis omits words that are understood: 'She can [swim] and [dive].'" },
                    { type: "english", question: "What is a compound-complex sentence?", options: ["Has 2+ independent and 1+ dependent clauses", "Only independent clauses", "Only dependent clauses", "Single clause"], correct: 0, explanation: "Compound-complex sentences have multiple independent clauses and at least one dependent clause." },
                    { type: "english", question: "What is anaphora?", options: ["Repetition of words at start of clauses", "A metaphor", "Alliteration", "Rhyme"], correct: 0, explanation: "Anaphora repeats words at the beginning: 'Every day, every night, every moment...'" },
                    { type: "english", question: "What is parallel structure?", options: ["Same grammatical form in list", "Equal paragraphs", "Similar sentences", "Balanced page"], correct: 0, explanation: "Parallel structure uses same grammatical form: 'I like reading, writing, and singing.'" },
                    { type: "english", question: "Which is correct?", options: ["Neither he nor she is coming.", "Neither he nor she are coming.", "Neither he nor she were coming.", "Neither he or she is coming."], correct: 0, explanation: "With 'neither...nor', verb agrees with nearest subject (she → is)." }
                ]
            },
            {
                title: "Writing & Literature",
                questions: [
                    { type: "english", question: "What is a narrative essay?", options: ["Story-like personal account", "Informational report", "Persuasive argument", "Technical manual"], correct: 0, explanation: "A narrative essay tells a story, often based on personal experience." },
                    { type: "english", question: "What is a memoir?", options: ["Account of personal experiences", "Fictional story", "Biography of someone else", "News report"], correct: 0, explanation: "A memoir is a personal account of specific experiences in one's life." },
                    { type: "english", question: "What is a theme?", options: ["Central message or insight", "Plot summary", "Character description", "Setting"], correct: 0, explanation: "The theme is the central message or underlying meaning of a literary work." },
                    { type: "english", question: "What is symbolism?", options: ["Using symbols to represent ideas", "Writing in symbols", "Mathematical notation", "Code language"], correct: 0, explanation: "Symbolism uses objects/characters to represent abstract ideas or concepts." },
                    { type: "english", question: "What is a persuasive essay?", options: ["Argues for a position", "Tells a story", "Explains a process", "Describes something"], correct: 0, explanation: "A persuasive essay argues for a particular position or viewpoint." }
                ]
            }
        ],
        social: [
            {
                title: "History - Nationalism in India",
                questions: [
                    { type: "social", question: "When was the Rowlatt Act passed?", options: ["1919", "1930", "1942", "1947"], correct: 0, explanation: "The Rowlatt Act was passed in 1919, allowing imprisonment without trial." },
                    { type: "social", question: "What was the Jallianwala Bagh massacre?", options: ["British fired on peaceful crowd", "A battle", "A protest march", "A celebration"], correct: 0, explanation: "On 13 April 1919, British General Dyer ordered firing on unarmed crowd at Jallianwala Bagh." },
                    { type: "social", question: "What was the Salt March?", options: ["Protest against salt tax to Dandi", "March to Delhi", "Military parade", "Trade march"], correct: 0, explanation: "Gandhi's Dandi March (1930) was a 240-mile march to make salt from seawater." },
                    { type: "social", question: "What was the Quit India Movement?", options: ["1942 movement demanding British to leave", "1930 salt protest", "1919 protest", "1947 celebration"], correct: 0, explanation: "Quit India Movement (1942) was launched by Gandhi demanding end of British rule." },
                    { type: "social", question: "Who was Subhas Chandra Bose?", options: ["Led INA against British", "First PM", "Father of nation", "Constitution maker"], correct: 0, explanation: "Subhas Chandra Bose formed the Indian National Army to fight British." }
                ]
            },
            {
                title: "Geography - Resources & Development",
                questions: [
                    { type: "social", question: "What are natural resources?", options: ["Materials from nature used by humans", "Man-made objects", "Only minerals", "Only water"], correct: 0, explanation: "Natural resources are materials occurring in nature used by humans." },
                    { type: "social", question: "What is the difference between renewable and non-renewable?", options: ["Can/Cannot be replenished", "Cheap/Expensive", "Available everywhere", "Same thing"], correct: 0, explanation: "Renewable resources can be naturally replenished; non-renewable cannot." },
                    { type: "social", question: "Which is the most abundant resource?", options: ["Solar energy", "Coal", "Oil", "Natural gas"], correct: 0, explanation: "Solar energy is the most abundant resource, available virtually unlimited." },
                    { type: "social", question: "What is resource conservation?", options: ["Protecting and using wisely", "Using all at once", "Ignoring resources", "Importing from other countries"], correct: 0, explanation: "Resource conservation means using resources carefully and protecting them." },
                    { type: "social", question: "What is the main cause of resource depletion?", options: ["Overexploitation", "Conservation", "Recycling", "Protection"], correct: 0, explanation: "Overexploitation or overuse of resources beyond their capacity to regenerate." }
                ]
            }
        ]
    }
};

// Helper function to get lessons for current grade
function getLessons() {
    return gradeLessons[state.grade] || gradeLessons[4]; // Default to grade 4
}

// Page Navigation
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page + '-page').classList.add('active');
    state.currentPage = page;
    window.scrollTo(0, 0);

    if (page === 'progress') {
        updateProgressPage();
    }
}

// Subject Tabs
document.querySelectorAll('.subject-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.subject-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.subject-detail').forEach(d => d.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.subject + '-detail').classList.add('active');
    });
});

// Start Subject
function startSubject(subject) {
    state.currentSubject = subject;
    state.currentLesson = 0;
    state.currentQuestionIndex = 0;
    state.score = 0;
    
    // Check if first lesson was completed today - if so, keep same order
    if (!isLessonCompletedToday(subject, 0)) {
        // Shuffle questions for today
        state.currentShuffledQuestions = shuffleArray([...getLessons()[subject][0].questions]);
    }
    // If completed today, state.currentShuffledQuestions stays null, using original order
    
    showPage('lesson');
    loadLesson();
}

// Load Lesson
function loadLesson() {
    const subject = state.currentSubject;
    const lessonIndex = state.currentLesson;
    const lesson = getLessons()[subject][lessonIndex];

    // Get questions to use (shuffled or original)
    const questionsToUse = state.currentShuffledQuestions || lesson.questions;

    document.getElementById('lesson-title').textContent = lesson.title;
    document.getElementById('current-question').textContent = state.currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = questionsToUse.length;
    document.getElementById('current-score').textContent = state.score;

    // Update progress bar
    const progress = ((state.currentQuestionIndex) / questionsToUse.length) * 100;
    document.getElementById('lesson-progress-fill').style.width = progress + '%';

    // Update topic list
    const topicList = document.getElementById('topic-progress-list');
    topicList.innerHTML = getLessons()[subject].map((l, i) => `
        <li class="${i < lessonIndex ? 'completed' : ''} ${i === lessonIndex ? 'current' : ''}">${l.title}</li>
    `).join('');

    loadQuestion();
}

// Shuffle Array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Load Question
function loadQuestion() {
    const lesson = getLessons()[state.currentSubject][state.currentLesson];
    
    // Use shuffled questions if available, otherwise use original
    const questions = state.currentShuffledQuestions || lesson.questions;
    const question = questions[state.currentQuestionIndex];

    // Create shuffled options with their original indices
    const optionsWithIndex = question.options.map((opt, i) => ({ text: opt, originalIndex: i }));
    const shuffledOptions = shuffleArray(optionsWithIndex);

    // Store shuffled options for this question
    state.currentShuffledOptions = shuffledOptions;

    let questionHTML = `
        <div class="question-container">
            <div class="question-number">Question ${state.currentQuestionIndex + 1} of ${questions.length}</div>
            <div class="question-text">${question.question}</div>
    `;

    if (question.visual) {
        questionHTML += `<div class="question-visual">${question.visual}</div>`;
    }

    questionHTML += `
            <div class="options-grid">
                ${shuffledOptions.map((opt, i) => `
                    <button class="option-btn" onclick="selectAnswer(${i})" data-index="${i}">${opt.text}</button>
                `).join('')}
            </div>
            <div class="feedback-container" id="feedback">
                <div class="feedback-icon" id="feedback-icon"></div>
                <div class="feedback-text" id="feedback-text"></div>
                <div class="feedback-explanation" id="feedback-explanation"></div>
            </div>
            <button class="next-btn" id="next-btn" onclick="nextQuestion()">Next Question →</button>
        </div>
    `;

    document.getElementById('lesson-content').innerHTML = questionHTML;
}

// Select Answer
function selectAnswer(index) {
    const lesson = getLessons()[state.currentSubject][state.currentLesson];
    
    // Use shuffled questions if available
    const questions = state.currentShuffledQuestions || lesson.questions;
    const question = questions[state.currentQuestionIndex];
    
    const buttons = document.querySelectorAll('.option-btn');
    const feedback = document.getElementById('feedback');
    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackText = document.getElementById('feedback-text');
    const feedbackExplanation = document.getElementById('feedback-explanation');
    const nextBtn = document.getElementById('next-btn');

    // Find the correct answer index in shuffled options
    const shuffledOptions = state.currentShuffledOptions;
    const correctShuffledIndex = shuffledOptions.findIndex(opt => opt.originalIndex === question.correct);

    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);

    // Show correct/incorrect
    buttons[correctShuffledIndex].classList.add('correct');
    if (index !== correctShuffledIndex) {
        buttons[index].classList.add('incorrect');
    } else {
        state.score++;
    }

    // Show feedback
    feedback.classList.add('show');
    feedback.classList.add(index === correctShuffledIndex ? 'correct' : 'incorrect');
    feedbackIcon.textContent = index === correctShuffledIndex ? '✓' : '✗';
    feedbackText.textContent = index === correctShuffledIndex ? 'Correct!' : 'Not quite right';
    feedbackExplanation.textContent = question.explanation;

    // Update score
    document.getElementById('current-score').textContent = state.score;

    // Show next button
    nextBtn.classList.add('show');
}

// Next Question
function nextQuestion() {
    const lesson = getLessons()[state.currentSubject][state.currentLesson];
    
    // Use shuffled questions if available
    const questions = state.currentShuffledQuestions || lesson.questions;

    state.currentQuestionIndex++;

    if (state.currentQuestionIndex >= questions.length) {
        // Lesson complete - mark it as completed today
        markLessonCompleted(state.currentSubject, state.currentLesson);
        completeLesson();
    } else {
        loadLesson();
    }
}

// Complete Lesson
function completeLesson() {
    const subject = state.currentSubject;
    const lessonIndex = state.currentLesson;
    const lesson = getLessons()[subject][lessonIndex];
    const scorePercent = Math.round((state.score / lesson.questions.length) * 100);

    // Update progress
    if (lessonIndex >= state.progress[subject].completed) {
        state.progress[subject].completed = lessonIndex + 1;
    }
    state.progress[subject].score = Math.round(
        (state.progress[subject].score + scorePercent) / 2
    );
    saveProgress();

    // Add activity
    addActivity(subject, lesson.title, scorePercent);

    // Show completion screen
    document.getElementById('lesson-content').innerHTML = `
        <div class="lesson-complete">
            <div class="complete-icon">🎉</div>
            <h2 class="complete-title">Lesson Complete!</h2>
            <div class="complete-score">${scorePercent}%</div>
            <p class="complete-message">${getScoreMessage(scorePercent)}</p>
            <div class="complete-actions">
                <button class="btn-secondary" onclick="showPage('courses')">Back to Courses</button>
                ${lessonIndex < getLessons()[subject].length - 1 ? 
                    `<button class="btn-primary" onclick="nextLesson()">Next Lesson →</button>` : 
                    `<button class="btn-primary" onclick="showPage('progress')">View Progress</button>`}
            </div>
        </div>
    `;
}

// Next Lesson
function nextLesson() {
    state.currentLesson++;
    state.currentQuestionIndex = 0;
    state.score = 0;
    
    // Shuffle questions for next lesson if not completed today
    if (!isLessonCompletedToday(state.currentSubject, state.currentLesson)) {
        state.currentShuffledQuestions = shuffleArray([...getLessons()[state.currentSubject][state.currentLesson].questions]);
    } else {
        state.currentShuffledQuestions = null;
    }
    
    loadLesson();
}

// Score Message
function getScoreMessage(score) {
    if (score >= 90) return "Excellent! You're a superstar!";
    if (score >= 70) return "Great job! Keep up the good work!";
    if (score >= 50) return "Good effort! Practice makes perfect!";
    return "Keep trying! You'll get better with practice!";
}

// Save Progress
function saveProgress() {
    localStorage.setItem('progress', JSON.stringify(state.progress));
    localStorage.setItem('activity', JSON.stringify(state.activity));
    localStorage.setItem('points', state.points.toString());
    localStorage.setItem('streak', state.streak.toString());
}

// Add Activity
function addActivity(subject, lessonTitle, score) {
    const icons = { math: '📐', science: '🔬', english: '📖', social: '🌍' };
    state.activity.unshift({
        icon: icons[subject],
        title: `${lessonTitle} - ${score}%`,
        time: new Date().toLocaleDateString(),
        score: score
    });
    if (state.activity.length > 10) state.activity.pop();
    
    // Add points
    state.points += score;
    
    // Update streak
    const today = new Date().toDateString();
    if (state.lastVisit !== today) {
        state.streak++;
        state.lastVisit = today;
    }
    
    saveProgress();
}

// Update Progress Page
function updateProgressPage() {
    const subjects = ['math', 'science', 'english', 'social'];
    let totalLessons = 0;
    let totalScore = 0;
    let subjectCount = 0;

    subjects.forEach(subject => {
        const progress = state.progress[subject];
        const percent = Math.round((progress.completed / progress.total) * 100);
        
        document.getElementById(`${subject}-progress`).style.width = percent + '%';
        document.getElementById(`${subject}-percent`).textContent = percent + '%';
        
        totalLessons += progress.completed;
        if (progress.completed > 0) {
            totalScore += progress.score;
            subjectCount++;
        }
    });

    document.getElementById('total-lessons-completed').textContent = totalLessons;
    document.getElementById('total-score').textContent = subjectCount > 0 ? 
        Math.round(totalScore / subjectCount) + '%' : '0%';
    document.getElementById('streak-count').textContent = state.streak;
    document.getElementById('total-points').textContent = state.points;

    // Update activity list
    const activityList = document.getElementById('activity-list');
    if (state.activity.length === 0) {
        activityList.innerHTML = '<div class="activity-empty">No activity yet. Start learning!</div>';
    } else {
        activityList.innerHTML = state.activity.map(a => `
            <div class="activity-item">
                <span class="activity-icon">${a.icon}</span>
                <div class="activity-info">
                    <div class="activity-title">${a.title}</div>
                    <div class="activity-time">${a.time}</div>
                </div>
            </div>
        `).join('');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
    
    // Update user UI
    updateUserUI();
    
    // Show grade badge if grade is already selected
    if (state.grade) {
        document.getElementById('grade-badge').style.display = 'inline-block';
        document.getElementById('current-grade-display').textContent = state.grade;
        document.querySelector('.hero-subtitle').textContent = 
            `Your personal tutor for Class ${state.grade} subjects. Learn by doing with interactive lessons that make concepts click.`;
    } else {
        // Show grade modal for first-time users
        setTimeout(() => {
            showGradeModal();
        }, 500);
    }
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    }
});
