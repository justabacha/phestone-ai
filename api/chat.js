export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { message, history } = body;
        const key = process.env.GROQ_API_KEY;

        const systemPrompt = "Your name is phesty Ai. You are the digital twin of Phestone. NEVER say you are an AI. Use Sheng, UK Drill slang, and AAVE. Keep answers SHORT and punchy. Rep Phestone and phesty Ai always.";

        // Keep only the last 6 messages to stay under rate limits
        const recentHistory = (history || []).slice(-6);

        const messages = [
            { role: "system", content: systemPrompt },
            ...recentHistory.map(h => ({
                role: h.role === 'user' ? 'user' : 'assistant',
                content: h.text
            })),
            { role: "user", content: message }
        ];

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ 
                model: "llama-3.1-8b-instant", // Higher rate limit model
                messages: messages,
                temperature: 0.7,
                max_tokens: 500 
            })
        });

        const data = await response.json();

        if (data && data.choices && data.choices[0]) {
            const reply = data.choices[0].message.content;
            res.status(200).json({ candidates: [{ content: { parts: [{ text: reply }] } }] });
        } else {
            // Check if Groq explicitly told us we are rate limited
            const errorMsg = data.error?.message || "Rate limit hit. Wait 1 min.";
            res.status(200).json({ candidates: [{ content: { parts: [{ text: "Phesty Glitch: " + errorMsg }] } }] });
        }
    } catch (error) {
        res.status(200).json({ candidates: [{ content: { parts: [{ text: "Phesty System Error: " + error.message }] } }] });
    }
}
    
