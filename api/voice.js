export default async function handler(req, res) {
  const apiKey = process.env.FISH_API_KEY;
  const voiceId = process.env.FISH_VOICE_ID;
  const { text } = req.body;

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const response = await fetch('https://api.fish.audio/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        reference_id: voiceId,
        format: "mp3",
        latency: "normal"
      }),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      return res.status(response.status).json({ details: `Fish Audio Error: ${errorMsg}` });
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));

  } catch (error) {
    res.status(500).json({ details: `System Error: ${error.message}` });
  }
        }
