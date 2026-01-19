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
        const reply = data.candidates[0].content.parts[0].text;
        displayMessage('ai', reply);
        chatHistory.push({ role: 'ai', text: reply });
        localStorage.setItem('phesty_memory', JSON.stringify(chatHistory));
    } catch (e) {
        if (document.getElementById('typing-indicator')) document.getElementById('typing-indicator').remove();
        displayMessage('ai', "Zii, network imekataa.");
    }
}

// UPDATED VOICE LOGIC WITH HEX-TO-BASE64 CONVERSION
async function toggleSpeech(element, text) {
    if (!currentAudio) { currentAudio = new Audio(); }
    
    currentAudio.pause();
    element.style.opacity = "0.5"; 

    try {
        const response = await fetch('/api/voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });

        const result = await response.json();
        
        if (result.data && result.data.audio) {
            // CONVERT HEX FROM MINIMAX TO BASE64
            const hexString = result.data.audio;
            const base64String = btoa(hexString.match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join(""));
            
            currentAudio.src = `data:audio/mp3;base64,${base64String}`;
            currentAudio.play().catch(e => {
                console.error("Playback blocked. Tap again.");
            });
        }
    } catch (err) {
        console.error("MiniMax Error:", err);
    } finally {
        element.style.opacity = "1";
    }
}

function stopSpeech() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        console.log("phesty Ai stopped.");
    }
}

function scrollToBottom() { const b = document.getElementById('chat-box'); if(b) b.scrollTop = b.scrollHeight; }
function handleKey(e) { if (e.key === 'Enter') sendMsg(); }
        
