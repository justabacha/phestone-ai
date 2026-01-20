export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    
    // MiniMax V2 returns a trace_id and the data in a specific structure
    // We send the audio data back to our Lab UI
    res.status(200).json(data);

  } catch (error) {
    console.error('Voice Lab Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
            }
