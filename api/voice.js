export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text } = req.body;

  try {
    const response = await fetch(`https://api.minimax.chat/v1/t2a_v2?GroupId=${process.env.MINIMAX_GROUP_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "speech-01",
        text: text,
        stream: false,
        voice_setting: {
          voice_id: process.env.MINIMAX_VOICE_ID,
          speed: 1.0,
          vol: 1.0,
          pitch: 0
        },
        audio_setting: {
          sample_rate: 32000,
          bitrate: 128000,
          format: "mp3"
        }
      }),
    });

    const result = await response.json();

    // Check if the API returned an error code (MiniMax uses base_resp)
    if (result.base_resp && result.base_resp.status_code !== 0) {
        return res.status(400).json({ 
            error: "MiniMax Error", 
            details: result.base_resp.status_msg 
        });
    }

    // Return the full result to the lab
    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: 'Server Crash', details: error.message });
  }
        }
      
