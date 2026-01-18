const userImg = "https://i.postimg.cc/rpD4fgxR/IMG-5898-2.jpg";
const aiImg = "https://i.postimg.cc/L5tLzXfJ/IMG-6627-2.jpg";
let chatHistory = JSON.parse(localStorage.getItem('phesty_memory')) || [];

window.onload = () => {
    chatHistory.forEach(msg => displayMessage(msg.role, msg.text));
    scrollToBottom();
};

async function sendMsg() {
    const input = document.getElementById('userMsg');
    const text = input.value.trim();
    if (!text) return;

    displayMessage('user', text);
    input.value = '';
    chatHistory.push({ role: 'user', text: text });

    // Show typing
    const chatBox = document.getElementById('chat-box');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'msg-wrapper ai-wrapper';
    typingDiv.innerHTML = `<img src="${aiImg}" class="avatar"><div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
    chatBox.appendChild(typingDiv);
    scrollToBottom();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, history: chatHistory })
        });
        const data = await response.json();
        
        if (document.getElementById('typing-indicator')) document.getElementById('typing-indicator').remove();

        const reply = data.candidates[0].content.parts[0].text;
        displayMessage('ai', reply);
        chatHistory.push({ role: 'ai', text: reply });
        localStorage.setItem('phesty_memory', JSON.stringify(chatHistory));
    } catch (e) {
        if (document.getElementById('typing-indicator')) document.getElementById('typing-indicator').remove();
        displayMessage('ai', "Oya, network inasumbua kidogo.");
    }
}

function displayMessage(role, text) {
    const chatBox = document.getElementById('chat-box');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const wrapper = document.createElement('div');
    wrapper.className = `msg-wrapper ${role}-wrapper`;
    wrapper.innerHTML = `
        <img src="${role === 'user' ? userImg : aiImg}" class="avatar">
        <div class="${role}"><div class="bubble">${text}<span class="time">${time}</span></div></div>
    `;
    chatBox.appendChild(wrapper);
    scrollToBottom();
}

function scrollToBottom() { const b = document.getElementById('chat-box'); b.scrollTop = b.scrollHeight; }
function handleKey(e) { if (e.key === 'Enter') sendMsg(); }
