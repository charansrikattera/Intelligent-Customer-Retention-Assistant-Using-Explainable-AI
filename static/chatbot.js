// let step = 0;
// let data = {};
// const questions = [
//     "What is your age?",
//     "What is your CIBIL score?",
//     "What is your monthly income?",
//     "Employment type? (Salaried/Self)",
//     "Required loan amount?"
// ];

// function sendMessage() {
//     const input = document.getElementById("userInput");
//     const msg = input.value;
//     if (!msg) return;

//     addMessage(msg, "user");
//     input.value = "";

//     storeAnswer(msg);

//     if (step < questions.length) {
//         botReply(questions[step]);
//         step++;
//     } else {
//         evaluateLoan();
//     }
// }

// function addMessage(text, sender) {
//     const box = document.getElementById("chatbox");
//     const div = document.createElement("div");
//     div.className = sender;
//     div.innerText = text;
//     box.appendChild(div);
//     box.scrollTop = box.scrollHeight;

//     speak(text);
// }

// function botReply(text) {
//     addMessage(text, "bot");
// }

// function storeAnswer(msg) {
//     if (step === 0) data.age = msg;
//     if (step === 1) data.cibil = msg;
//     if (step === 2) data.income = msg;
//     if (step === 3) data.job = msg;
//     if (step === 4) data.loan = msg;
// }



// function evaluateLoan() {
//     let eligible = true;
//     let tips = [];

//     if (data.cibil < 650) {
//         eligible = false;
//         tips.push("Improve CIBIL score above 650.");
//     }

//     if (data.income < 25000) {
//         eligible = false;
//         tips.push("Increase income or add co-applicant.");
//     }

//     if (data.age < 21 || data.age > 60) {
//         eligible = false;
//         tips.push("Age must be between 21–60.");
//     }

//     if (eligible) {
//         botReply("✅ Loan approved!");
//     } else {
//         botReply("❌ Loan not approved.");
//         tips.forEach(t => botReply("💡 " + t));
//     }
// }

// function startVoice() {
//     const recognition = new webkitSpeechRecognition();
//     recognition.lang = "en-IN";

//     recognition.onresult = function(event) {
//         document.getElementById("userInput").value =
//             event.results[0][0].transcript;
//         sendMessage();
//     };
//     recognition.start();
// }

// function speak(text) {
//     const speech = new SpeechSynthesisUtterance(text);
//     speech.lang = "en-IN";
//     window.speechSynthesis.speak(speech);
// }



let step = 0;
let data = {};

const questions = [
    "What is your age?",
    "What is your CIBIL score?",
    "What is your monthly income?",
    "Employment type? (Salaried/Self)",
    "what type of loan do you want?",
    "Required loan amount?"
];

function sendMessage() {
    const input = document.getElementById("userInput");
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, "user");
    input.value = "";

    storeAnswer(msg);
    step++;

    if (step < questions.length) {
        botReply(questions[step]);
    } else {
        evaluateLoan();
    }
}

function addMessage(text, sender) {
    const box = document.getElementById("chatbox");
    const div = document.createElement("div");
    div.className = sender;
    div.innerText = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;

    speak(text);
}

function botReply(text) {
    addMessage(text, "bot");
}

function storeAnswer(msg) {
    if (step === 0) data.age = Number(msg);
    if (step === 1) data.cibil = Number(msg);
    if (step === 2) data.income = Number(msg);
    if (step === 3) data.job = msg.toLowerCase();
    if (step === 4) data.loan = Number(msg.replace(/,/g, ""));
}

function evaluateLoan() {
    let eligible = true;
    let reasons = [];
    let maxLoan = 0;

    // Age rule
    if (data.age < 21 || data.age > 60) {
        eligible = false;
        reasons.push("Age must be between 21 and 60 years.");
    }

    // CIBIL rule
    if (data.cibil < 650) {
        eligible = false;
        reasons.push("CIBIL score must be at least 650.");
    }

    // Income rule
    if (data.income < 25000) {
        eligible = false;
        reasons.push("Monthly income should be ₹25,000 or more.");
    }

    // Employment-based loan limit
    if (data.job === "salaried") {
        maxLoan = data.income * 10;
    } else if (data.job === "self") {
        maxLoan = data.income * 8;
    } else {
        eligible = false;
        reasons.push("Employment type must be Salaried or Self.");
    }

    if (step === 0) {
        userData.name = input;
        botReply("What type of loan do you need? (Home / Personal / Car / Education)");
        step = 1;
    }
    // Loan amount check
    if (data.loan > maxLoan) {
        eligible = false;
        reasons.push(
            `Requested loan exceeds your eligible limit of ₹${maxLoan.toLocaleString()}.`
        );
    }

    // FINAL BANK-STYLE RESPONSE
    if (eligible) {
        botReply("✅ Loan Approved!");

        botReply(
            `💰 You are eligible for a maximum loan of ₹${maxLoan.toLocaleString()}.`
        );

        botReply(
            `📄 Reason: Good CIBIL score, sufficient income, and stable employment as a ${data.job}.`
        );
    } else {
        botReply("❌ Loan Not Approved.");

        reasons.forEach(r => botReply("💡 " + r));

        if (maxLoan > 0) {
            botReply(
                `📌 Based on your income, your maximum eligible loan is ₹${maxLoan.toLocaleString()}.`
            );
        }
    }
}

function startVoice() {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-IN";

    recognition.onresult = function (event) {
        document.getElementById("userInput").value =
            event.results[0][0].transcript;
        sendMessage();
    };
    recognition.start();
}

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    window.speechSynthesis.speak(speech);
}
