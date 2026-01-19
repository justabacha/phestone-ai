export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  try {
    const { text } = req.body;
    console.log("Generating voice for:", text); // Debug log

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
          vol: 1.0
        },
        output_format: "mp3" 
      })
    });

    const data = await response.json();

    // If MiniMax returns an error, we'll see it here
    if (data.base_resp && data.base_resp.status_code !== 0) {
      console.error("MiniMax Error:", data.base_resp.status_msg);
      return res.status(500).json({ error: data.base_resp.status_msg });
    }

    if (data.audio_data) {
      // Send it back exactly how script.js wants it
      res.status(200).json({ data: { audio: data.audio_data } });
    } else {
      res.status(500).json({ error: "No audio data received" });
    }

  } catch (error) {
    console.error("Voice Handler Crash:", error);
    res.status(500).json({ error: error.message });
  }
}
  
