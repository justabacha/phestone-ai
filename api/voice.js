const response = await fetch('https://api.fish.audio/v1/tts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'model': 's1' // 🔥 ADD THIS LINE
  },
  body: JSON.stringify({
    text: text,
    reference_id: voiceId,
    format: "mp3",
    latency: "normal"
  }),
});
