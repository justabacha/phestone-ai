let chatHistory = JSON.parse(localStorage.getItem('phesty_memory')) || [];
const userImg = "https://i.postimg.cc/rpD4fgxR/IMG-5898-2.jpg";
const aiImg = "https://i.postimg.cc/L5tLzXfJ/IMG-6627-2.jpg";

window.onload = () => {
    chatHistory.forEach(msg => displayMessage(msg.role, msg.text, false));
    scrollToBottom();
};

function handleKey(e) { if (e.key === 'Enter') sendMsg(); }

async function sendMsg() {
    const input = document.getElementById('userMsg');
    const text = input.value.trim();
    if (!text) return;

    displayMessage('user', text);
    input.value = '';
    
    chatHistory.push({ role: 'user', text: text });
    if (chatHistory.length > 100) chatHistory.shift();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message: text, history: chatHistory })
        });
        const data = await response.json();
        const aiReply = data.candidates[0].content.parts[0].text;
        
        displayMessage('ai', aiReply);
        chatHistory.push({ role: 'ai', text: aiReply });
        localStorage.setItem('phesty_memory', JSON.stringify(chatHistory));
    } catch (e) {
        displayMessage('ai', "Oya, network inasumbua. Try again, G.");
    }
}

function displayMessage(role, text, animate = true) {
    const chatBox = document.getElementById('chat-box');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const wrapper = document.createElement('div');
    wrapper.className = `msg-wrapper ${role}-wrapper`;
    
    wrapper.innerHTML = `
        <img src="${role === 'user' ? userImg : aiImg}" class="avatar">
        <div class="${role}">
            <div class="bubble">${text}<span class="time">${time}</span></div>
        </div>
    `;
    
    chatBox.appendChild(wrapper);
    scrollToBottom();
}

function scrollToBottom() { const b = document.getElementById('chat-box'); b.scrollTop = b.scrollHeight; }
function clearChat() { localStorage.removeItem('phesty_memory'); location.reload(); }
            
