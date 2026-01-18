export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        const body = JSON.parse(req.body);
        const userMessage = body.message;
        const key = process.env.GEMINI_API_KEY;

        // UPDATED: Using the latest 2026 stable model and version
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${key}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        const data = await response.json();

        // This will now show the SPECIFIC Google error in your chat bubble
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
    
