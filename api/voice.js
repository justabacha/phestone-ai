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
          vol: 1.0
        },
        // hex is the default, which we will convert to base64
        output_format: "mp3" 
      })
    });

    const data = await response.json();

    // MiniMax returns audio in 'data.audio_data'. 
    // We need to make sure we send it back in the 'data.data.audio' format your script expects.
    if (data && data.audio_data) {
      res.status(200).json({
        data: {
          audio: data.audio_data
        }
      });
    } else {
      console.error("MiniMax Error Response:", data);
      res.status(500).json({ error: "Voice generation failed", details: data });
    }

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
                 }
      
