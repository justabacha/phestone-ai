export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const body = JSON.parse(req.body);
        const userMessage = body.message;
        
        // Use the secret key you saved in Vercel
        const key = process.env.GEMINI_API_KEY;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        const data = await response.json();
        
        // Send the AI answer back to your phone screen
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Server Error: " + error.message });
    }
}
