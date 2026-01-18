export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        const body = JSON.parse(req.body);
        const userMessage = body.message;
        const key = process.env.GEMINI_API_KEY;

        // Using v1beta for the 1.5-flash model
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        const data = await response.json();

        // Check if Google sent an error instead of a message
        if (data.error) {
            return res.status(200).json({ 
                candidates: [{ content: { parts: [{ text: "Google Error: " + data.error.message }] } }] 
            });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: "Backend Error: " + error.message }] } }] 
        });
    }
                    }
