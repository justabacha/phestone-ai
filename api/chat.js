export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const { text } = req.body;
  const GROUP_ID = process.env.MINIMAX_GROUP_ID;
  const API_KEY = process.env.MINIMAX_API_KEY;
  const VOICE_ID = process.env.MINIMAX_VOICE_ID;

  try {
    const response = await fetch(`https://api.minimaxi.chat/v1/t2a_v2?GroupId=${GROUP_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "speech-01-turbo", // Try turbo first, it's more stable for testing
        text: text,
        stream: false,
        voice_setting: {
          voice_id: VOICE_ID,
          speed: 1.0,
          vol: 1.0
        },
        audio_setting: {
          sample_rate: 32000,
          bitrate: 128000,
          format: "mp3"
        }
      })
    });

    const result = await response.json();

    // LOGGING: Check your server logs for this!
    console.log("MiniMax Response Status:", result.base_resp?.status_code);

    if (result.audio_data) {
      // Direct conversion from Hex to Base64
      const base64Audio = Buffer.from(result.audio_data, 'hex').toString('base64');
      return res.status(200).json({ audio: base64Audio });
    } else {
      return res.status(500).json({ 
        error: "MiniMax failed to generate audio", 
        details: result.base_resp?.status_msg || "Unknown error" 
      });
    }
  } catch (error) {
    console.error("Critical Voice Error:", error);
    return res.status(500).json({ error: error.message });
  }
            }
        
