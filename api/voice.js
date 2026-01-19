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
        voice_setting: {
          voice_id: process.env.MINIMAX_VOICE_ID,
          speed: 1.0,
          vol: 1.0,
          pitch: 0
        },
        audio_setting: {
          sample_rate: 32000,
          bitrate: 128000,
          format: "mp3" // Specifically requesting MP3
        },
        output_format: "hex" // We receive hex and the browser handles the conversion via the data-uri
      })
    });

    const data = await response.json();

    // Check for MiniMax specific error codes
    if (data.base_resp && data.base_resp.status_code !== 0) {
      console.error("MiniMax API Error:", data.base_resp.status_msg);
      return res.status(500).json({ error: data.base_resp.status_msg });
    }

    if (data.audio_data) {
      // We send the hex string. In your script.js, we ensure it's treated as the source.
      res.status(200).json({ 
        data: { 
          audio: data.audio_data,
          format: "hex" 
        } 
      });
    } else {
      res.status(500).json({ error: "No audio data received from MiniMax" });
    }

  } catch (error) {
    console.error("Voice Handler Crash:", error);
    res.status(500).json({ error: error.message });
  }
}
