export default async function handler(req, res) {
  const apiKey = process.env.MINIMAX_API_KEY;
  const groupId = process.env.MINIMAX_GROUP_ID; // Your long ID starting with 2
  const { text } = req.body;

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // 1. Updated to the .io Global URL
    const response = await fetch(`https://api.minimax.io/v1/t2a_v2?GroupId=${groupId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "speech-01-turbo", // 2. Updated to the Global model name
        text: text,
        stream: false,
        voice_setting: {
          voice_id: process.env.MINIMAX_VOICE_ID || "male-qn-01",
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

    // 3. Robust Error Catching
    if (result.base_resp && result.base_resp.status_code !== 0) {
      return res.status(400).json({ 
        details: `MiniMax Error ${result.base_resp.status_code}: ${result.base_resp.status_msg}` 
      });
    }

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ details: `Server Error: ${error.message}` });
  }
          }
    
