export default async function handler(req, res) {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { message, history } = body;
    const key = process.env.GEMINI_API_KEY;

    // We embed the personality directly into the prompt to avoid "system_instruction" errors
    const phestyPersona = "Identity: Your name is Phestone (Phesty). Style: Use Kenyan Sheng, UK Drill slang, and AAVE. Personality: Cheeky, adorable joker. Rule: Rep your name Phesty with pride.";

    const contents = (history || []).map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
    }));

    // Add the instruction to the very first message if history is empty
    if (contents.length === 0) {
        contents.push({ role: 'user', parts: [{ text: phestyPersona }] });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    try {
        // Using the v1 endpoint which is more stable for your current quota
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: contents })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(200).json({ candidates: [{ content: { parts: [{ text: "Rada? Glitch flani imetokea: " + error.message }] } }] });
    }
}
    
