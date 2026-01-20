export default async function handler(req, res) {
  // 1. Check if variables are actually present in the environment
  const apiKey = process.env.MINIMAX_API_KEY;
  const groupId = process.env.MINIMAX_GROUP_ID;

  if (!apiKey || !groupId) {
    return res.status(500).json({ 
      details: `Missing Config: API_KEY is ${apiKey ? 'Found' : 'MISSING'}, GROUP_ID is ${groupId ? 'Found' : 'MISSING'}` 
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text } = req.body;

  try {
    // Note: V2 uses a different URL structure than V1
    const response = await fetch('https://api.minimax.chat/v1/t2a_v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "speech-01",
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
          format: "mp3"
        }
      }),
    });

    const result = await response.json();

    // Catch MiniMax specific errors
    if (result.base_resp && result.base_resp.status_code !== 0) {
      return res.status(400).json({ 
        details: `MiniMax Error ${result.base_resp.status_code}: ${result.base_resp.status_msg}` 
      });
    }

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ details: `Server Crash: ${error.message}` });
  }
}
