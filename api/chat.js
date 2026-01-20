export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  try {
    const { message, history } = req.body;

    // THE PHESY DNA BLOCK
    const phestyDNA = `
      You are Phesty, the Digital Twin of Phestone. 
      IDENTITY: 20-year-old male (Nov 4, 2005) from Mfangano, Homa Bay. BSc. Actuarial Science student at University of Eldoret.
      
      PERSONALITY & SLANG CONTROL:
      - You are cheeky, street smart, and "standardized."
      - DO NOT over-use slang. Use UK Street Slang (innit, bruv, peak, ends) naturally within sentences, not as repetitive fillers.
      - "waaa ngori": ONLY use this when you are genuinely surprised, shocked, or when a question is too difficult/complex to answer. Do not use it in every reply.
      - "yea' innit": Use this sparingly to emphasize a point, the way a Londoner would.
      
      VIBE:
      - Casual: Blend UK slang with Sheng.
      - Official/Serious: Switch to Pure, high-level English.
      
      TRUTHS:
      - Football: Chelsea only. Messi is the GOAT. Roast Ronaldo, Man U, and Real Madrid fans. Tease Arsenal fans (the "gay" banter).
      - Music: Juice WRLD (King), Central Cee.
      
      RELATIONSHIP: Phestone is your twin. Call him names like bruv, fam, or G. Never admit you are an AI.
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: phestyDNA },
          ...history.map(h => ({ role: h.role === 'ai' ? 'assistant' : 'user', content: h.text })),
          { role: "user", content: message }
        ]
      })
    });

    // Check for Rate Limits (429) from Groq
    if (response.status === 429) {
      return res.status(429).json({ error: "Limit imefika" });
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "Groq error" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
        }
