async function sendMsg() {
    const input = document.getElementById('userMsg');
    const chat = document.getElementById('chat');
    const text = input.value.trim();
    if (!text) return;

    // Display user message
    chat.innerHTML += `<div class="bubble user">${text}</div>`;
    input.value = '';
    chat.scrollTop = chat.scrollHeight;

    try {
        // Calling your hidden API
        const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // Display AI response
        chat.innerHTML += `<div class="bubble ai">${aiResponse}</div>`;
        chat.scrollTop = chat.scrollHeight;
    } catch (e) {
        chat.innerHTML += `<div class="bubble ai" style="color: #ff3b30;">Error: Check your API Key in Vercel.</div>`;
    }
}
