export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { message, history } = body;
        const key = process.env.GEMINI_API_KEY;

        const systemPrompt = "Your name is Phestone (Phesty). You're a cheeky genius joker. Use Kenyan Sheng, UK slang, and Gen Z lingo. Rep your name with pride.";

        const contents = (history || []).map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
        }));
        contents.push({ role: 'user', parts: [{ text: message }] });

        // USE THIS EXACT URL - v1beta + gemini-2.0-flash
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: contents
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ 
                candidates: [{ content: { parts: [{ text: "Google says: " + data.error.message }] } }] 
            });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: "Phesty Glitch: " + error.message }] } }] 
        });
    }
                                                  }
