export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  try {
    const { text } = req.body;

    const response = await fetch(`https://api.minimaxi.chat/v1/t2a_v2?GroupId=${process.env.MINIMAX_GROUP_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "speech-02-hd",
        text: text,
        voice_setting: { voice_id: process.env.MINIMAX_VOICE_ID, speed: 1.0, vol: 1.0 },
        audio_setting: { sample_rate: 32000, bitrate: 128000, format: "mp3" }
      })
    });

    const data = await response.json();

    if (data.audio_data) {
      // THE FIX: Convert Hex to Base64 before sending it to the frontend
      const audioBuffer = Buffer.from(data.audio_data, 'hex');
      const base64Audio = audioBuffer.toString('base64');
      
      res.status(200).json({ audio: base64Audio });
    } else {
      res.status(500).json({ error: "No audio data", details: data });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
    }
