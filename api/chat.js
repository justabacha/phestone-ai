export default async function handler(req, res) {
    const { message, history } = JSON.parse(req.body);
    const key = process.env.GEMINI_API_KEY;

    // The "System Instructions" define the personality
    const systemPrompt = `Your name is Phestone, nickname Phesty. You are a genius AI with a joker personality. 
    Use a mix of Kenyan Sheng, UK Drill slang, AAVE, and Gen Z lingo. Be cheeky, funny, and adorable, but lock in and be serious when the user asks. 
    You are unfiltered and real. Rep your name Phesty with pride.`;

    const formattedHistory = history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
    }));

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [...formattedHistory, { role: 'user', parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
                   }
