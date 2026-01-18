const userImg = "https://i.postimg.cc/rpD4fgxR/IMG-5898-2.jpg";
const aiImg = "https://i.postimg.cc/L5tLzXfJ/IMG-6627-2.jpg";
let chatHistory = JSON.parse(localStorage.getItem('phesty_memory')) || [];

// Apply wallpaper to BODY
const savedBg = localStorage.getItem('phesty_bg');
if (savedBg) {
    document.body.style.backgroundImage = `url(${savedBg})`;
}

document.getElementById('bg-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (r) => {
            const dataUrl = r.target.result;
            document.body.style.backgroundImage = `url(${dataUrl})`;
            localStorage.setItem('phesty_bg', dataUrl);
        };
        reader.readAsDataURL(file);
    }
});

// Everything else stays the same...
window.onload = () => {
    chatHistory.forEach(msg => displayMessage(msg.role, msg.text));
    scrollToBottom();
};

function toggleSpeech(text) {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
        synth.cancel();
    } else {
        const utter = new SpeechSynthesisUtterance(text);
        const voices = synth.getVoices();
        utter.voice = voices.find(v => v.name.includes('Male') || v.name.includes('UK')) || voices[0];
        utter.pitch = 0.9;
        utter.rate = 1.0;
        synth.speak(utter);
    }
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
    typingDiv.innerHTML = `<img src="${aiImg}" class="avatar"><div style="padding:12px; background:rgba(0,0,0,0.5); border-radius:18px; display:flex; gap:4px;"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
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
        const reply = data.candidates[0].content.parts[0].text;
        displayMessage('ai', reply);
        chatHistory.push({ role: 'ai', text: reply });
        localStorage.setItem('phesty_memory', JSON.stringify(chatHistory));
    } catch (e) {
        if (document.getElementById('typing-indicator')) document.getElementById('typing-indicator').remove();
        displayMessage('ai', "Zii, network imekataa.");
    }
}

function displayMessage(role, text) {
    const chatBox = document.getElementById('chat-box');
    const wrapper = document.createElement('div');
    wrapper.className = `msg-wrapper ${role}-wrapper`;
    const clickAction = role === 'ai' ? `onclick="toggleSpeech(this.innerText)"` : "";
    wrapper.innerHTML = `<img src="${role==='user' ? userImg : aiImg}" class="avatar"><div class="${role}"><div class="bubble" ${clickAction}>${text}</div></div>`;
    chatBox.appendChild(wrapper);
    scrollToBottom();
}

function scrollToBottom() { const b = document.getElementById('chat-box'); b.scrollTop = b.scrollHeight; }
function handleKey(e) { if (e.key === 'Enter') sendMsg(); }
    
