export default async function handler(req, res) {
    // 1. Basic Security
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // 2. Parse Body safely
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { message, history } = body;
        const key = process.env.GEMINI_API_KEY;

        // 3. The "Phesty" Personality (Optimized for 2026 API)
        const systemPrompt = "Your name is Phestone, nickname Phesty. You are a genius AI joker. Use Kenyan Sheng, UK Drill slang, AAVE, and Gen Z lingo. Be cheeky, funny, and adorable, but serious when needed. Rep your name Phesty with pride.";

        // 4. Format history for Google (Map to 'user' and 'model')
        const contents = (history || []).map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
        }));

        // Add the current message
        contents.push({ role: 'user', parts: [{ text: message }] });

        // 5. The Fetch (Stable v1 Endpoint)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: contents
            })
        });

        const data = await response.json();

        // 6. Check for Google Errors
        if (data.error) {
            console.error("Google API Error:", data.error);
            return res.status(200).json({ 
                candidates: [{ content: { parts: [{ text: "Google says: " + data.error.message }] } }] 
            });
        }

        // 7. Send the win back to the phone
        res.status(200).json(data);

    } catch (error) {
        console.error("Backend Crash:", error);
        res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: "Phesty had a glitch: " + error.message }] } }] 
        });
    }
            }
                    
