export default async function handler(req, res) {
    const apiKey = process.env.FISH_API_KEY;
    // This should be your public or cloned Voice ID
    const voiceId = process.env.FISH_VOICE_ID || "802e3bc2b27e49c2995d23ef70e6ac89"; 
    const { text } = req.body;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log("🔵 Phesty is reaching out to Fish Audio...");

        const response = await fetch('https://api.fish.audio/v1/tts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                // 🔥 CRITICAL: This 'model' header tells Fish to use your free S1 credits
                'model': 's1' 
            },
            body: JSON.stringify({
                text: text,
                reference_id: voiceId,
                format: "mp3",
                latency: "normal",
                // Adding these to ensure the S1 model has the right parameters
                prosody: {
                    speed: 1.0,
                    volume: 0
                }
            }),
        });

        // Handle the 402 (Insufficient Balance) or 401 (Invalid Key) specifically
        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Fish Audio API Error:", response.status, errorText);
            
            return res.status(response.status).json({ 
                details: `Fish Audio Error (${response.status}): ${errorText}` 
            });
        }

        // Fish Audio returns raw audio bytes
        const audioBuffer = await response.arrayBuffer();
        
        // We tell the browser: "This is an MP3 file"
        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(audioBuffer));

    } catch (error) {
        console.error("❌ System Error:", error.message);
        res.status(500).json({ details: `Server Error: ${error.message}` });
    }
              }
  
