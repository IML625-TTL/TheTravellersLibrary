const API_KEY = "AIzaSyB11abzY0-TzUX807vxPw0dTEU7K8ChQ6Y";

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('active');
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const chatBody = document.getElementById('chatBody');
    const userText = input.value.trim();

    if (userText === "") return;

    // 1. Add User Bubble
    const userDiv = document.createElement('div');
    userDiv.className = 'msg user';
    userDiv.textContent = userText;
    chatBody.appendChild(userDiv);

    input.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    // 2. Add "Typing" Bubble
    const botDiv = document.createElement('div');
    botDiv.className = 'msg bot';
    botDiv.textContent = "Sam is typing...";
    chatBody.appendChild(botDiv);

    try {
        // 3. The API Call (Fixed Structure)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: userText }]
                }]
            })
        });

        const data = await response.json();
        
        // 4. Handle Response
        if (data.candidates && data.candidates[0].content) {
            botDiv.textContent = data.candidates[0].content.parts[0].text;
        } else {
            botDiv.textContent = "I'm sorry, I couldn't process that. Please try again!";
        }

    } catch (error) {
        botDiv.textContent = "Connection error. Please check your internet.";
        console.error(error);
    }
    
    chatBody.scrollTop = chatBody.scrollHeight;
}

// 5. Enter Key Support
document.getElementById("userInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});