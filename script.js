const userImg = "https://i.postimg.cc/rpD4fgxR/IMG-5898-2.jpg";
const aiImg = "https://i.postimg.cc/L5tLzXfJ/IMG-6627-2.jpg";
let chatHistory = JSON.parse(localStorage.getItem('phesty_memory')) || [];
let currentAudio = null; // Track the playing voice

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';
        scrollToBottom();
    }, 6000); 
});

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

function displayMessage(role, text) {
    const chatBox = document.getElementById('chat-box');
    const wrapper = document.createElement('div');
    wrapper.className = `msg-wrapper ${role === 'user' ? 'user-wrapper' : 'ai-wrapper'}`;
    
    // Tap to play voice, Double tap to stop
    const action = role === 'ai' ? `onclick="toggleSpeech(this, this.innerText)" ondblclick="stopSpeech()"` : "";
    
    wrapper.innerHTML = `
        <img src="${role==='user' ? userImg : aiImg}" class="avatar">
        <div class="${role}">
            <div class="bubble" ${action}>${text}</div>
        </div>
    `;
    chatBox.appendChild(wrapper);
    scrollToBottom();
}

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
            body: JSON.stringify({ message: text, history: chatHistory })
        });
        const data = await res.json();
        if (document.getElementById('typing-indicator')) document.getElementById('typing-indicator').remove();
