export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { message, history } = body;
        const key = process.env.GEMINI_API_KEY;

        // The "Phesty" Personality
        const systemPrompt = "Your name is Phestone (Phesty). You are a genius AI joker. Use Kenyan Sheng, UK Drill slang, AAVE, and Gen Z lingo. Be cheeky, funny, and adorable. Rep your name Phesty with pride.";

        // Format history for the v1 stable API
        const contents = (history || []).map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
        }));
        
        // Add the current user message
        contents.push({ role: 'user', parts: [{ text: message }] });

        // Using the most stable V1 endpoint and model name for 2026
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // Note: v1 stable uses system_instruction or we can prepend it to the first message
                contents: [
                    { role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${systemPrompt}` }] },
                    ...contents
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ 
                candidates: [{ content: { parts: [{ text: "Google Error: " + data.error.message }] } }] 
            });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: "Phesty Glitch: " + error.message }] } }] 
        });
    }
                }
