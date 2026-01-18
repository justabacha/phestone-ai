async function sendMsg() {
    const input = document.getElementById('userMsg');
    const chat = document.getElementById('chat');
    const text = input.value.trim();
    if (!text) return;

    // 1. Show your message
    chat.innerHTML += `<div class="bubble user">${text}</div>`;
    input.value = '';
    chat.scrollTop = chat.scrollHeight;

    try {
        // 2. Call the backend folder
        const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();
        
        // 3. Extract the AI's reply
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // 4. Show the AI message
        chat.innerHTML += `<div class="bubble ai">${aiResponse}</div>`;
        chat.scrollTop = chat.scrollHeight;
    } catch (e) {
        chat.innerHTML += `<div class="bubble ai" style="color: #ff3b30;">Error: Check Vercel Logs</div>`;
    }
}
