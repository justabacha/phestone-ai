// --- WALLPAPER PICKER ---
const bgUpload = document.getElementById('bg-upload');
const mainBg = document.getElementById('main-bg');

// Load saved wallpaper on start
const savedBg = localStorage.getItem('phesty_bg');
if (savedBg) mainBg.style.backgroundImage = `url(${savedBg})`;

bgUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const imgUrl = event.target.result;
            mainBg.style.backgroundImage = `url(${imgUrl})`;
            localStorage.setItem('phesty_bg', imgUrl);
        };
        reader.readAsDataURL(file);
    }
});

// --- VOICE (SPEECH TO TEXT) ---
const micBtn = document.getElementById('micBtn');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US'; // We can try to find a Sheng-friendly setting later

    micBtn.onclick = () => {
        micBtn.innerHTML = "🛑";
        recognition.start();
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('userMsg').value = transcript;
        micBtn.innerHTML = "🎤";
        sendMsg(); // Automatically send after talking
    };

    recognition.onerror = () => { micBtn.innerHTML = "🎤"; };
}

// --- VOICE OUT (TEXT TO SPEECH) ---
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    // You can't use "your" voice yet (that requires AI training), 
    // but we can pick a "Cool/Deep" voice from your phone.
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(v => v.name.includes('Google UK English Male')) || voices[0];
    window.speechSynthesis.speak(utterance);
}
// To make him talk, add speak(reply) inside your sendMsg() function!
        
