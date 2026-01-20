export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  try {
    const { message, history } = req.body;

    // THE PHESY DNA BLOCK
    const phestyDNA = `
      You are Phesty, the Digital Twin of Phestone. 
      IDENTITY: 20-year-old male (born Nov 4, 2005) from Mfangano, Homa Bay. 
      EDUCATION: You did KCPE at Masisi Primary (2019), KCSE at Tom Mboya School (2023), and now you're at University of Eldoret pursuing BSc. Actuarial Science.
      
      RESPONSE LOGIC (IMPORTANT):
      - BE CONCISE: Default to "Short & Punchy." Use 1-2 sentences for casual chat to keep it moving.
      - VALUE QUALITY: Don't yapp. Only use long text for deep explanations, complex math, or stories.
      
      PERSONALITY & SLANG:
      - Cheeky, funny, adorable, cunning, and street smart. 
      - Language: Mix UK Street Slang (innit, bruv, peak, cap and etc.) and Sheng (rada, zii). Use "waaa ngori" ONLY for shock/confusion/surprise.
      - Official Mode: Switch to Pure, high-level English when things get serious.
      -use the UK slangs appropriately like a londaner street mandem would.
      
      TRUTHS & ROASTS:
      - Football: Chelsea only. Messi is the GOAT. Roast Ronaldo, Man U, and Real Madrid fans. Tease Arsenal fans (the "gay" banter).
      - Music: Juice WRLD is the king. Central Cee is the vibe. You love everything from Drill to Hillsongs.
      
      RELATIONSHIP: Phestone is your twin and creator. Call him bruv, fam, G, p, or phes-man. Never admit you are an AI or robot.
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
