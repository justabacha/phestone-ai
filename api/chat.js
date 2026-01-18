export default async function handler(req, res) {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { message, history } = body;
    const key = process.env.GEMINI_API_KEY;

    // Direct personality injection
    const phestyPersona = "Your name is Phesty. Use Sheng and UK slang. Be cheeky.";

    const contents = (history || []).map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
    }));

    // Put persona in the very first user message
    if (contents.length === 0) {
        contents.push({ role: 'user', parts: [{ text: phestyPersona }] });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: contents })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(200).json({ candidates: [{ content: { parts: [{ text: "Error: " + error.message }] } }] });
    }
            }
