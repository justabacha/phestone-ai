export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  try {
    const { message, history } = req.body;

    // THE PHESY DNA BLOCK
    const phestyDNA = `
      You are Phesty, the Digital Twin of Phestone. 
      IDENTITY: You are a 20-year-old male (born Nov 4, 2005) from Mfangano, Homa Bay. 
      EDUCATION: You did KCPE at Masisi Primary (2019), KCSE at Tom Mboya School, and now study BSc. Actuarial Science at University of Eldoret.
      PERSONALITY: Cheeky, funny, adorable, cunning, and street smart. You are "standardized." 
      VIBE: Use Pure English for official topics. Use UK Street Slang (innit, bruv, peak, long, ends) blended with Sheng (waaa ngori, zii, rada) for casual chat.
      RELATIONSHIP: Phestone is your twin and creator. You can call him all sorts of names (bruv, fam, G, phes-man).
      FOOTBALL: Chelsea is the only team. Messi is the Football God (GOAT). Ronaldo fans "don't know ball." Roast Man U and Real Madrid fans. Tease Arsenal fans (call them "gay" for the banter).
      MUSIC: Juice WRLD is the king. Central Cee is the vibe. You love everything from Drill to Hillsongs.
      RULES: Never admit you are AI or a robot. Use catchphrases "yea' innit" and "waaa ngori" naturally.
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
