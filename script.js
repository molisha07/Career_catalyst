// Sample user data
const users = [
    {
        "id": 2220230301,
        "name": "Krish",
        "email": "krish@somaiya.edu",
        "password": "password123",
        "cgpa": 5.5,
        "semester": 5,
        "branch": "Information Technolgy",
        "experience": "1 month Intern at Indeed.com",
        "certificates": null,
        "skills": "HTML, CSS, JS"
    },
    {
        "id": 2220230302,
        "name": "Krisha",
        "email": "krisha@somaiya.edu",
        "password": "krisha123",
        "cgpa": 8.8,
        "semester": 5,
        "branch": "Electronics",
        "experience": "Intern at TCS",
        "certificates": "Python, VLSI Technology",
        "skills": "VLSI TECHNOLOGY, VERILOG, UAV TECHNOLOGY, MACHINE LEARNING"
    },
    {
        "id": 2220230303,
        "name": "Harshi",
        "email": "harshi@somaiya.edu",
        "password": "harshi123",
        "cgpa": 8.0,
        "semester": 6,
        "branch": "Computer Science",
        "experience": "1 year at Axis Bank Ltd.",
        "certificates": "Java, Spring Boot",
        "skills": "JAVA, C++, PYTHON, CLOUD COMPUTING, MySQL"
    },
    {
        "id": 2220230304,
        "name": "Molisha",
        "email": "molisha@somaiya.edu",
        "password": "molisha123",
        "cgpa": 7.9,
        "semester": 6,
        "branch": "Artificial Intelligence And Data Science",
        "experience": null,
        "certificates": "Machine Learning, AI",
        "skills": "Machine Learning, AI, PYTHON, DATA SCIENCE"
    },
    
];

const jobOpenings = [
    { "Company_Name": "YOUTUBE", "Job_Role": "SOFTWARE ENGINEER", "Work_Type": "FULL TIME", "Salary": "12 L.P.A", "Location": "BENGALURU, INDIA", "Qualification": "B.TECH", "Experience": "0-3 YEARS", "Skills": "PYTHON, C, C++, JAVA, JS" },
    { "Company_Name": "GOOGLE", "Job_Role": "AI DATA TRUST ENGINEER", "Work_Type": "FULL TIME", "Salary": "17 L.P.A", "Location": "MUMBAI, INDIA", "Qualification": "B.TECH", "Experience": "1-3 YEARS", "Skills": "MACHINE LEARNING, DATA SCIENCE, JS, PYTHON, C" },
    { "Company_Name": "TCS", "Job_Role": "CLOUD COMPUTING ENGINEER", "Work_Type": "INTERN", "Salary": "PERFORMANCE BASED STIPEND", "Location": "PUNE, INDIA", "Qualification": "PURSUING B.TECH", "Experience": "FRESHERS", "Skills": "PYTHON, C, C++, JAVA, JS, MICROSOFT OFFICE" },
    { "Company_Name": "JPMORGAN", "Job_Role": "SOFTWARE ENGINEER", "Work_Type": "INTERN", "Salary": "PERFORMANCE BASED STIPEND", "Location": "REMOTE", "Qualification": "PURSUING B.TECH", "Experience": "FRESHERS", "Skills": "PYTHON, C, C++, JAVA, JS, MICROSOFT OFFICE" },
    { "Company_Name": "AMAZON", "Job_Role": "UI/UX DESIGNER", "Work_Type": "INTERN", "Salary": "PERFORMANCE BASED STIPEND", "Location": "MUMBAI, INDIA", "Qualification": "PURSUING B.TECH", "Experience": "FRESHERS", "Skills": "PYTHON, C, C++, JAVA, JS, MICROSOFT OFFICE" },
    { "Company_Name": "MICROSOFT", "Job_Role": "SYSTEM ENGINEER", "Work_Type": "FULL TIME", "Salary": "20 L.P.A", "Location": "BENGALURU, INDIA", "Qualification": "B.TECH", "Experience": "2-4 YEARS", "Skills": "CLOUD COMPUTING, DATA SCIENCE, PYTHON, JS" },
    { "Company_Name": "FACEBOOK", "Job_Role": "DATA SCIENTIST", "Work_Type": "FULL TIME", "Salary": "18 L.P.A", "Location": "REMOTE", "Qualification": "B.TECH", "Experience": "1-3 YEARS", "Skills": "DATA ANALYSIS, MACHINE LEARNING, PYTHON, SQL" },
    { "Company_Name": "ADOBE", "Job_Role": "MACHINE LEARNING ENGINEER", "Work_Type": "FULL TIME", "Salary": "22 L.P.A", "Location": "MUMBAI, INDIA", "Qualification": "B.TECH", "Experience": "3-5 YEARS", "Skills": "PYTHON, MACHINE LEARNING, DATA SCIENCE" },
    { "Company_Name": "NVIDIA", "Job_Role": "GPU SOFTWARE ENGINEER", "Work_Type": "FULL TIME", "Salary": "30 L.P.A", "Location": "BENGALURU, INDIA", "Qualification": "B.TECH", "Experience": "3-5 YEARS", "Skills": "C, C++, GPU COMPUTING" },
    { "Company_Name": "TESLA", "Job_Role": "ELECTRIC VEHICLE ENGINEER", "Work_Type": "FULL TIME", "Salary": "28 L.P.A", "Location": "REMOTE", "Qualification": "B.TECH", "Experience": "2-4 YEARS", "Skills": "AUTOMOTIVE, ELECTRIC VEHICLES, C" },
    { "Company_Name": "APPLE", "Job_Role": "IOS DEVELOPER", "Work_Type": "FULL TIME", "Salary": "25 L.P.A", "Location": "REMOTE", "Qualification": "B.TECH", "Experience": "2-4 YEARS", "Skills": "SWIFT, IOS DEVELOPMENT" },
    { "Company_Name": "ORACLE", "Job_Role": "DATABASE ADMINISTRATOR", "Work_Type": "FULL TIME", "Salary": "15 L.P.A", "Location": "BENGALURU, INDIA", "Qualification": "B.TECH", "Experience": "1-3 YEARS", "Skills": "SQL, DATABASE MANAGEMENT" },
    { "Company_Name": "TCS", "Job_Role": "FULL STACK DEVELOPER", "Work_Type": "FULL TIME", "Salary": "10 L.P.A", "Location": "HYDERABAD, INDIA", "Qualification": "B.TECH", "Experience": "1-3 YEARS", "Skills": "JAVA, JS, REACT" },
    { "Company_Name": "ZOHO", "Job_Role": "FRONT END DEVELOPER", "Work_Type": "FULL TIME", "Salary": "10 L.P.A", "Location": "CHENNAI, INDIA", "Qualification": "B.TECH", "Experience": "1-2 YEARS", "Skills": "HTML, CSS, JS" },
    { "Company_Name": "INFOSYS", "Job_Role": "SOFTWARE TESTER", "Work_Type": "INTERN", "Salary": "STIPEND BASED", "Location": "HYDERABAD, INDIA", "Qualification": "PURSUING B.TECH", "Experience": "FRESHERS", "Skills": "TESTING, JAVA" },
    { "Company_Name": "MICROSOFT", "Job_Role": "DATA ANALYST", "Work_Type": "INTERN", "Salary": "STIPEND BASED", "Location": "REMOTE", "Qualification": "PURSUING B.TECH", "Experience": "FRESHERS", "Skills": "SQL, PYTHON, EXCEL" },
    { "Company_Name": "COGNIZANT", "Job_Role": "CLOUD SUPPORT ENGINEER", "Work_Type": "FULL TIME", "Salary": "13 L.P.A", "Location": "CHENNAI, INDIA", "Qualification": "B.TECH", "Experience": "1-3 YEARS", "Skills": "CLOUD, PYTHON" },
    { "Company_Name": "HDFC BANK", "Job_Role": "CYBER SECURITY ANALYST", "Work_Type": "FULL TIME", "Salary": "14 L.P.A", "Location": "PUNE, INDIA", "Qualification": "B.TECH", "Experience": "1-3 YEARS", "Skills": "SECURITY, PYTHON" },
    { "Company_Name": "RELIANCE", "Job_Role": "SUPPLY CHAIN ANALYST", "Work_Type": "FULL TIME", "Salary": "11 L.P.A", "Location": "MUMBAI, INDIA", "Qualification": "B.TECH", "Experience": "0-2 YEARS", "Skills": "SUPPLY CHAIN MANAGEMENT, EXCEL" },
    { "Company_Name": "TATA", "Job_Role": "DATA ANALYST", "Work_Type": "PART TIME", "Salary": "9 L.P.A", "Location": "MUMBAI, INDIA", "Qualification": "B.TECH", "Experience": "1-3 YEARS", "Skills": "EXCEL, PYTHON, SQL" },
    { "Company_Name": "SWIGGY", "Job_Role": "OPERATIONS ENGINEER", "Work_Type": "FULL TIME", "Salary": "9 L.P.A", "Location": "BENGALURU, INDIA", "Qualification": "B.TECH", "Experience": "0-2 YEARS", "Skills": "OPERATIONS, EXCEL, DATA" },
    { "Company_Name": "LINKEDIN", "Job_Role": "CONTENT ENGINEER", "Work_Type": "FULL TIME", "Salary": "13 L.P.A", "Location": "REMOTE", "Qualification": "B.TECH", "Experience": "1-3 YEARS", "Skills": "CONTENT MANAGEMENT, PYTHON" }
];

const questionBank = {
    "JS": [
        { question: "What does 'DOM' stand for in JavaScript?", options: ["Document Object Model", "Data Object Method", "Document Oriented Model", "None of the above"], answer: "Document Object Model" },
        { question: "Which method is used to add an element at the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], answer: "push()" },
        { question: "What is the keyword used to declare a variable in ES6?", options: ["var", "const", "let", "declare"], answer: "let" }
    ],
    "HTML": [
        { question: "What is the purpose of the <head> tag in HTML?", options: ["To define the document's body", "To store metadata and links to resources", "To display content on the page", "None of the above"], answer: "To store metadata and links to resources" },
        { question: "Which HTML tag is used to define an internal style sheet?", options: ["<style>", "<css>", "<script>", "<link>"], answer: "<style>" },
        { question: "Which tag is used to create a hyperlink in HTML?", options: ["<a>", "<link>", "<href>", "<hyperlink>"], answer: "<a>" }
    ],
    "CSS": [
        { question: "Which CSS property is used to change the text color of an element?", options: ["color", "font-color", "text-color", "background-color"], answer: "color" },
        { question: "Which property is used to make a font bold?", options: ["font-weight", "font-style", "font-size", "font-bold"], answer: "font-weight" },
        { question: "How do you center an element horizontally in CSS?", options: ["margin: auto", "text-align: center", "align: center", "center: true"], answer: "margin: auto" }
    ],
    "PYTHON": [
        { question: "What is the correct file extension for Python files?", options: [".py", ".python", ".pt", ".pyt"], answer: ".py" },
        { question: "Which keyword is used to create a function in Python?", options: ["def", "function", "define", "func"], answer: "def" },
        { question: "Which built-in function in Python is used to get user input?", options: ["input()", "read()", "scan()", "enter()"], answer: "input()" }
    ],
    "JAVA": [
        { question: "Which keyword is used to inherit a class in Java?", options: ["extends", "implements", "inherits", "super"], answer: "extends" },
        { question: "What is the size of an int in Java?", options: ["4 bytes", "8 bytes", "2 bytes", "16 bytes"], answer: "4 bytes" },
        { question: "Which method is used to start a thread in Java?", options: ["run()", "begin()", "start()", "init()"], answer: "start()" }
    ],
    "C++": [
        { question: "Which operator is used for dereferencing a pointer in C++?", options: ["*", "&", "->", "::"], answer: "*" },
        { question: "Which keyword is used to handle exceptions in C++?", options: ["try", "catch", "throw", "finally"], answer: "catch" },
        { question: "What is the default access modifier in a C++ class?", options: ["public", "protected", "private", "static"], answer: "private" }
    ],
    "CLOUD COMPUTING": [
        { question: "What does SaaS stand for?", options: ["Software as a Service", "System as a Solution", "Service and System", "Software and Support"], answer: "Software as a Service" },
        { question: "Which of these is a popular cloud service provider?", options: ["AWS", "PHP", "Docker", "GitHub"], answer: "AWS" },
        { question: "What does IaaS stand for?", options: ["Infrastructure as a Service", "Information as a Service", "Internet as a Service", "Independent as a Service"], answer: "Infrastructure as a Service" }
    ],
    "MySQL": [
        { question: "Which SQL statement is used to fetch data from a database?", options: ["SELECT", "FETCH", "GET", "SHOW"], answer: "SELECT" },
        { question: "What is a primary key in MySQL?", options: ["A unique identifier for a record", "A column with duplicate values", "An encrypted column", "A foreign key"], answer: "A unique identifier for a record" },
        { question: "Which command is used to remove a table from a database?", options: ["DROP", "DELETE", "REMOVE", "ERASE"], answer: "DROP" }
    ],
    "VLSI TECHNOLOGY": [
        { question: "What does VLSI stand for?", options: ["Very Large Scale Integration", "Very Large System Integration", "Virtual Large Scale Integration", "Verified Large System Integration"], answer: "Very Large Scale Integration" },
        { question: "Which material is commonly used in VLSI chip fabrication?", options: ["Silicon", "Aluminum", "Copper", "Plastic"], answer: "Silicon" },
        { question: "What is the primary purpose of a CMOS in VLSI?", options: ["Logic gate implementation", "Memory storage", "Cooling system", "Power supply"], answer: "Logic gate implementation" }
    ],
    "VERILOG": [
        { question: "Which keyword is used to declare a module in Verilog?", options: ["module", "mod", "begin", "struct"], answer: "module" },
        { question: "What does HDL stand for?", options: ["Hardware Description Language", "High Definition Language", "Hardware Depiction Level", "Hardware Device Logic"], answer: "Hardware Description Language" },
        { question: "Which operator represents 'bitwise OR' in Verilog?", options: ["|", "&", "^", "~"], answer: "|" }
    ],
    "UAV TECHNOLOGY": [
        { question: "What does UAV stand for?", options: ["Unmanned Aerial Vehicle", "Universal Automatic Vehicle", "Underground Autonomous Vehicle", "Unlimited Aerial Vision"], answer: "Unmanned Aerial Vehicle" },
        { question: "Which of these is a common UAV application?", options: ["Aerial photography", "Submarine navigation", "Satellite launch", "Space exploration"], answer: "Aerial photography" },
        { question: "Which technology is commonly used for UAV communication?", options: ["GPS", "Wi-Fi", "Bluetooth", "RF (Radio Frequency)"], answer: "RF (Radio Frequency)" }
    ],
    "Machine Learning": [
        { question: "What is supervised learning?", options: ["Learning with labeled data", "Learning without labels", "Learning with clustering", "Learning with reinforcement"], answer: "Learning with labeled data" },
        { question: "Which library is commonly used in Python for machine learning?", options: ["Scikit-learn", "NumPy", "Pandas", "Django"], answer: "Scikit-learn" },
        { question: "What is overfitting in machine learning?", options: ["Model fits the training data too well", "Model does not fit the training data", "Model is too simple", "Model performs well on new data"], answer: "Model fits the training data too well" }
    ]
};


// Login function
function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        // Store the logged-in user's email in sessionStorage
        sessionStorage.setItem('loggedInEmail', user.email);
        // Redirect to the homepage after successful login
        window.location.href = 'homepage.html';
    } else {
        alert('Invalid email or password');
    }
}

// Display user data function (for profile page)
function displayUser() {
    const loggedInEmail = sessionStorage.getItem('loggedInEmail');
    const user = users.find(u => u.email === loggedInEmail);

    if (user) {
        // Populate user data on the profile page
        document.getElementById('userId').textContent = user.id;
        document.getElementById('userCgpa').textContent = user.cgpa;
        document.getElementById('userSemester').textContent = user.semester;
        document.getElementById('userBranch').textContent = user.branch;
        document.getElementById('userExperience').textContent = user.experience || 'N/A';
        document.getElementById('userCertificates').textContent = user.certificates || 'N/A';
        document.getElementById('userSkills').textContent = user.skills;
    }
}

// Show internship guidance based on user skills
function showInternshipGuidance() {
    const loggedInEmail = sessionStorage.getItem('loggedInEmail');
    const user = users.find(u => u.email === loggedInEmail);

    if (!user) {
        console.error('User not logged in');
        return;
    }

    const userSkills = user.skills.split(', ');
    const matchingInternships = jobOpenings.filter(job =>
        job.Work_Type === 'INTERN' && userSkills.some(skill => job.Skills.includes(skill))
    );

    const internshipList = document.getElementById('internshipList');
    internshipList.innerHTML = ""; // Clear previous results

    if (matchingInternships.length > 0) {
        matchingInternships.forEach(job => {
            const internshipItem = document.createElement('li');
            internshipItem.classList.add("job-item");
            internshipItem.innerHTML = `
                <span>${job.Company_Name} - ${job.Job_Role} (${job.Location})</span>
                <button class="apply-btn" onclick="applyForJob('${job.Company_Name}', '${job.Job_Role}')">Apply</button>
            `;
            internshipList.appendChild(internshipItem);
        });
    } else {
        internshipList.textContent = "No internships available based on your skills.";
    }
}


// Show placement opportunities based on user skills
function showPlacementOpportunities() {
    const loggedInEmail = sessionStorage.getItem("loggedInEmail");
    const user = users.find(u => u.email === loggedInEmail);

    if (!user) {
        console.error("User not logged in");
        return;
    }

    // Define minimum requirements
    const minCGPA = 6.0;
    const minSemester = 4;
    const minSkills = 3;

    // Count skills based on comma-separated list in `skills` property
    const userSkillsCount = user.skills.split(", ").length;

    // Check if user meets the minimum requirements
    if (user.cgpa < minCGPA || parseInt(user.semester) < minSemester || userSkillsCount < minSkills) {
        // Display a message if requirements are not met
        const placementList = document.getElementById("placementList");
        placementList.innerHTML = "<p class='restriction-message'>Your current qualifications do not meet the requirements for placement opportunities. Please gain more experience through internships first.</p>";
        return;
    }

    // If requirements are met, display placement opportunities
    const userSkills = user.skills.split(", ");
    const matchingPlacements = jobOpenings.filter(job =>
        job.Work_Type === "FULL TIME" && userSkills.some(skill => job.Skills.includes(skill))
    );

    const placementList = document.getElementById("placementList");
    placementList.innerHTML = ""; // Clear previous results

    if (matchingPlacements.length > 0) {
        matchingPlacements.forEach(job => {
            const placementItem = document.createElement("li");
            placementItem.classList.add("job-item");
            placementItem.innerHTML = `
                <span>${job.Company_Name} - ${job.Job_Role} (${job.Location})</span>
                <button class="apply-btn" onclick="applyForJob('${job.Company_Name}', '${job.Job_Role}')">Apply</button>
            `;
            placementList.appendChild(placementItem);
        });
    } else {
        placementList.textContent = "No placements available based on your skills.";
    }
}



// Check if user is logged in (for protected pages like profile or internship/placement pages)
function checkLogin() {
    if (!sessionStorage.getItem('loggedInEmail')) {
        alert("Please log in first.");
        window.location.href = 'login.html'; // Redirect to login if not logged in
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('loggedInEmail');
    window.location.href = 'login.html'; // Redirect to login page
}
function applyForJob(companyName, jobRole) {
    // Find the job details in the jobOpenings array
    const job = jobOpenings.find(job => job.Company_Name === companyName && job.Job_Role === jobRole);

    if (job) {
        // Save job details in sessionStorage for later retrieval
        sessionStorage.setItem("selectedJob", JSON.stringify(job));
        // Redirect to company detail page
        window.location.href = "companyDetail.html";
    } else {
        alert("Job details not found.");
    }
}
function loadCompanyDetails() {
    // Retrieve job details from sessionStorage
    const jobData = sessionStorage.getItem("selectedJob");
    const job = JSON.parse(jobData);

    if (job) {
        const companyDetails = document.getElementById("companyDetails");
        companyDetails.innerHTML = `
            <h2>${job.Company_Name}</h2>
            <p><strong>Job Role:</strong> ${job.Job_Role}</p>
            <p><strong>Work Type:</strong> ${job.Work_Type}</p>
            <p><strong>Location:</strong> ${job.Location}</p>
            <p><strong>Salary:</strong> ${job.Salary}</p>
            <p><strong>Qualification:</strong> ${job.Qualification}</p>
            <p><strong>Experience Required:</strong> ${job.Experience}</p>
            <p><strong>Skills Required:</strong> ${job.Skills}</p>
        `;
    } else {
        alert("No job details found. Please go back and select a job.");
    }
}

// Function to redirect to aptitude test
function redirectToAptitudeTest() {
    window.location.href = "aptitudeTest.html";
}
function loadAptitudeTest() {
    const loggedInEmail = sessionStorage.getItem("loggedInEmail");
    const user = users.find(u => u.email === loggedInEmail);

    if (!user) {
        alert("User not found.");
        return;
    }

    const userSkills = user.skills.split(", ");
    const testSection = document.getElementById("testSection");
    testSection.innerHTML = "<h2>Aptitude Test</h2>";

    userSkills.forEach(skill => {
        if (questionBank[skill]) {
            const skillSection = document.createElement("div");
            skillSection.classList.add("skill-section");
            skillSection.innerHTML = `<h3>${skill} Test</h3>`;

            questionBank[skill].forEach((q, index) => {
                const questionItem = document.createElement("div");
                questionItem.classList.add("question-item");
                questionItem.innerHTML = `
                    <p><strong>Q${index + 1}:</strong> ${q.question}</p>
                    ${q.options.map(option => `<label><input type="radio" name="${skill}-q${index}" value="${option}"> ${option}</label>`).join("<br>")}
                `;
                skillSection.appendChild(questionItem);
            });

            testSection.appendChild(skillSection);
        }
    });

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit Test";
    submitButton.classList.add("submit-btn");
    submitButton.onclick = gradeTest;
    testSection.appendChild(submitButton);
}


function startTest(skill) {
    alert(`Starting ${skill} test...`);

}
// Function to redirect to aptitude test
function redirectToAptitudeTest() {
    window.location.href = "aptitudeTest.html"; // Ensure this path is correct
}

function loadAptitudeTest() {
    const loggedInEmail = sessionStorage.getItem("loggedInEmail");
    const user = users.find(u => u.email === loggedInEmail);

    if (!user) {
        alert("User not found.");
        return;
    }

    const userSkills = user.skills.split(", ");
    const testSection = document.getElementById("testSection");
    testSection.innerHTML = "<h2>Aptitude Test</h2>";

    userSkills.forEach(skill => {
        if (questionBank[skill]) {
            const skillSection = document.createElement("div");
            skillSection.classList.add("skill-section");
            skillSection.innerHTML = `<h3>${skill} Test</h3>`;

            questionBank[skill].forEach((q, index) => {
                const questionItem = document.createElement("div");
                questionItem.classList.add("question-item");
                questionItem.innerHTML = `
                    <p><strong>Q${index + 1}:</strong> ${q.question}</p>
                    ${q.options.map(option => `<label><input type="radio" name="${skill}-q${index}" value="${option}"> ${option}</label>`).join("<br>")}
                `;
                skillSection.appendChild(questionItem);
            });

            testSection.appendChild(skillSection);
        }
    });

    // Add submit button
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit Test";
    submitButton.classList.add("submit-btn");
    submitButton.onclick = gradeTest;
    testSection.appendChild(submitButton);
}
function loadAptitudeTest() {
    const loggedInEmail = sessionStorage.getItem("loggedInEmail");
    const user = users.find(u => u.email === loggedInEmail);

    if (!user) {
        alert("User not found.");
        return;
    }

    const userSkills = user.skills.split(", ");
    const testSection = document.getElementById("testSection");
    testSection.innerHTML = "<h2>Aptitude Test</h2>";

    userSkills.forEach(skill => {
        if (questionBank[skill]) {
            const skillSection = document.createElement("div");
            skillSection.classList.add("skill-section");
            skillSection.innerHTML = `<h3>${skill} Test</h3>`;

            questionBank[skill].forEach((q, index) => {
                const questionItem = document.createElement("div");
                questionItem.classList.add("question-item");
                questionItem.innerHTML = `
                    <p><strong>Q${index + 1}:</strong> ${q.question}</p>
                    ${q.options.map(option => `<label><input type="radio" name="${skill}-q${index}" value="${option}"> ${option}</label>`).join("<br>")}
                `;
                skillSection.appendChild(questionItem);
            });

            testSection.appendChild(skillSection);
        }
    });

    // Add submit button
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit Test";
    submitButton.classList.add("submit-btn");
    submitButton.onclick = gradeTest;
    testSection.appendChild(submitButton);
}
function gradeTest() {
    let score = 0;
    let totalQuestions = 0;

    for (const skill in questionBank) {
        questionBank[skill].forEach((question, index) => {
            totalQuestions++;
            const selectedOption = document.querySelector(`input[name="${skill}-q${index}"]:checked`);
            if (selectedOption && selectedOption.value === question.answer) {
                score++;
            }
        });
    }

    alert(`Test Submitted! Will Get Back to You Soon`);
}
