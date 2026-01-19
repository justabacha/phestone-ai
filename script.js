const userImg = "https://i.postimg.cc/rpD4fgxR/IMG-5898-2.jpg";
const aiImg = "https://i.postimg.cc/L5tLzXfJ/IMG-6627-2.jpg";
let chatHistory = JSON.parse(localStorage.getItem('phesty_memory')) || [];

// 1. SPLASH SCREEN
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const main = document.getElementById('main-app');
        if(splash) splash.style.display = 'none';
        if(main) main.style.display = 'flex';
        scrollToBottom();
    }, 6000); 
});

// 2. BACKGROUND PERSISTENCE
const savedBg = localStorage.getItem('phesty_bg');
if (savedBg) document.body.style.backgroundImage = `url(${savedBg})`;

document.getElementById('bg-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (r) => {
            document.body.style.backgroundImage = `url(${r.target.result})`;
            localStorage.setItem('phesty_bg', r.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// 3. MESSAGE DISPLAY (Voice Logic Removed Completely)
function displayMessage(role, text) {
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) return;
    const wrapper = document.createElement('div');
    wrapper.className = `msg-wrapper ${role === 'user' ? 'user-wrapper' : 'ai-wrapper'}`;
    
    wrapper.innerHTML = `
        <img src="${role==='user' ? userImg : aiImg}" class="avatar">
        <div class="${role}">
            <div class="bubble">${text}</div>
        </div>
    `;
    chatBox.appendChild(wrapper);
    scrollToBottom();
}

// 4. BULLETPROOF CHAT LOGIC
async function sendMsg() {
    const input = document.getElementById('userMsg');
    const text = input.value.trim();
    if (!text) return;

    displayMessage('user', text);
    input.value = '';
    chatHistory.push({ role: 'user', text: text });
    
    const chatBox = document.getElementById('chat-box');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'msg-wrapper ai-wrapper';
    typingDiv.innerHTML = `<img src="${aiImg}" class="avatar"><div style="padding:12px; background:rgba(0,0,0,0.5); border-radius:18px; display:flex; gap:4px;"><div style="width:5px; height:5px; background:#00ff41; border-radius:50%; animation: blink 1.4s infinite;"></div><div style="width:5px; height:5px; background:#00ff41; border-radius:50%; animation: blink 1.4s infinite; animation-delay:0.2s"></div></div>`;
    chatBox.appendChild(typingDiv);
    scrollToBottom();

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, history: chatHistory.slice(-5) })
        });
        
        const data = await res.json();
        if (document.getElementById('typing-indicator')) document.getElementById('typing-indicator').remove();

        // Standardized check for the response
        if (data.reply) {
            displayMessage('ai', data.reply);
            chatHistory.push({ role: 'ai', text: data.reply });
            localStorage.setItem('phesty_memory', JSON.stringify(chatHistory));
        } else {
            displayMessage('ai', "Zii, response imechanganyikiwa.");
        }
    } catch (e) {
        if (document.getElementById('typing-indicator')) document.getElementById('typing-indicator').remove();
        displayMessage('ai', "Zii, network imekataa.");
    }
}

function scrollToBottom() { const b = document.getElementById('chat-box'); if(b) b.scrollTop = b.scrollHeight; }
function handleKey(e) { if (e.key === 'Enter') sendMsg(); }
