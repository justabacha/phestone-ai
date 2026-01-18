export default async function handler(req, res) {
  // 1. Get the text from the frontend
  const { text } = req.body;

  // 2. The Secret Request to MiniMax
  const response = await fetch(`https://api.minimaxi.chat/v1/t2a_v2?GroupId=${process.env.MINIMAX_GROUP_ID}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "speech-02-hd", // The high-quality version
      text: text,
      voice_setting: {
        voice_id: process.env.MINIMAX_VOICE_ID,
        speed: 1.0,
        vol: 1.0
      },
      output_format: "mp3"
    })
  });

  // 3. Send the audio back to Phestone's phone
  const audioData = await response.json();
  res.status(200).json(audioData);
      }
