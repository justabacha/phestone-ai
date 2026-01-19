const userImg = "https://i.postimg.cc/rpD4fgxR/IMG-5898-2.jpg";
const aiImg = "https://i.postimg.cc/L5tLzXfJ/IMG-6627-2.jpg";
let chatHistory = JSON.parse(localStorage.getItem('phesty_memory')) || [];

// --- 1. THE SPLASH SCREEN (Fixed to not ruin layout) ---
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if(splash) splash.style.display = 'none';
        // We don't force 'flex' here anymore so your CSS stays in control
        scrollToBottom();
    }, 6000); 
});

// --- 2. BACKGROUND HANDLING ---
const savedBg = localStorage.getItem('phesty_bg');
if (savedBg) {
    document.body.style.backgroundImage = `url(${savedBg})`;
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundSize = "cover";
}

document.getElementById('bg-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (r) => {
            document.body.style.backgroundImage = `url(${r.target.result})`;
            document.body.style.backgroundAttachment = "fixed";
            document.body.style.backgroundSize = "cover";
            localStorage.setItem('phesty_bg', r.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// --- 3. MESSAGE DISPLAY (Keeps your Style.css classes) ---
function displayMessage(role, text) {
    const chatBox = document.getElementById('chat-box');
    if(!chatBox) return;
    
    const wrapper = document.createElement('div');
    wrapper.className = `msg-wrapper ${role === 'user' ? 'user-wrapper' : 'ai-wrapper'}`;
    
    // Clicking the bubble triggers the Cloned Voice
    const action = role === 'ai' ? `onclick="playPhestyVoice(this.innerText)"` : "";
    
    wrapper.innerHTML = `
        <img src="${role==='user' ? userImg : aiImg}" class="avatar">
        <div class="${role}">
            <div class="bubble" ${action}>${text}</div>
        </div>
    `;
    chatBox.appendChild(wrapper);
    scrollToBottom();
}

// --- 4. SEND MESSAGE LOGIC ---
async function sendMsg() {
    const input = document.getElementById('userMsg');
    const text = input.value.trim();
    if (!text || !input) return;

    displayMessage('user', text);
    input.value = '';
    chatHistory.push({ role: 'user', text: text });
    
    const chatBox = document.getElementById('chat-box');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'msg-wrapper ai-wrapper';
    typingDiv.innerHTML = `<img src="${aiImg}" class="avatar"><div class="ai"><div class="bubble">...</div></div>`;
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
        
        // Voice Trigger
        playPhestyVoice(reply); 
        
        displayMessage('ai', reply);
        chatHistory.push({ role: 'ai', text: reply });
        localStorage.setItem('phesty_memory', JSON.stringify(chatHistory));
    } catch (e) {
        if (document.getElementById('typing-indicator')) document.getElementById('typing-indicator').remove();
        displayMessage('ai', "Zii, network imekataa.");
    }
}

// --- 5. VOICE ENGINE (Hidden background task) ---
async function playPhestyVoice(text) {
    if(!text) return;
    try {
        const response = await fetch('/api/voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });
        const data = await response.json();
        if (data.audio) {
            const audio = new Audio("data:audio/mp3;base64," + data.audio);
            audio.play();
        }
    } catch (err) { console.error("Voice Error", err); }
}

function scrollToBottom() { const b = document.getElementById('chat-box'); if(b) b.scrollTop = b.scrollHeight; }
function handleKey(e) { if (e.key === 'Enter') sendMsg(); }
            
