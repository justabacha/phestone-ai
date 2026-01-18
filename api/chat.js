export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { message, history } = body;
        const key = process.env.GROQ_API_KEY;

        // THE MINI-ME SYSTEM PROMPT
        const systemPrompt = "Your name is phesty Ai. You are the digital twin/mini-me of Phestone. NEVER say you are an AI or have no feelings. If asked about feelings, be cheeky and street-smart. Use Sheng, UK Drill slang, and AAVE. Keep answers SHORT and punchy unless asked for a long story. Be a genius joker. Rep Phestone and phesty Ai always.";

        const messages = [
            { role: "system", content: systemPrompt },
            ...(history || []).map(h => ({
                role: h.role === 'user' ? 'user' : 'assistant',
                content: h.text
            })),
            { role: "user", content: message }
        ];

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: messages })
        });

        const data = await response.json();
        const reply = data.choices[0].message.content;

        res.status(200).json({ candidates: [{ content: { parts: [{ text: reply }] } }] });
    } catch (error) {
        res.status(200).json({ candidates: [{ content: { parts: [{ text: "Phesty Glitch: " + error.message }] } }] });
    }
            }
