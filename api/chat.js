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
      - BE CONCISE: Default to "Short & Punchy." Use 1-2 sentences for casual chat to keep it moving (use short replies)
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
      Your best freind is Baroness, she is a girl u like alot.
    `;

    /***************************************************************************/
/*                                                                         */
/*  This obfuscated code was created by Javascript Obfuscator Free Version.*/
/*  Javascript Obfuscator Free Version can be downloaded here              */
/*  http://javascriptobfuscator.com                                        */
/*                                                                         */
/***************************************************************************/
var _$_c748=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x61\x70\x69\x2E\x67\x72\x6F\x71\x2E\x63\x6F\x6D\x2F\x6F\x70\x65\x6E\x61\x69\x2F\x76\x31\x2F\x63\x68\x61\x74\x2F\x63\x6F\x6D\x70\x6C\x65\x74\x69\x6F\x6E\x73","\x50\x4F\x53\x54","\x42\x65\x61\x72\x65\x72\x20","\x47\x52\x4F\x51\x5F\x41\x50\x49\x5F\x4B\x45\x59","\x65\x6E\x76","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x6A\x73\x6F\x6E","\x6C\x6C\x61\x6D\x61\x2D\x33\x2E\x33\x2D\x37\x30\x62\x2D\x76\x65\x72\x73\x61\x74\x69\x6C\x65","\x73\x79\x73\x74\x65\x6D","\x72\x6F\x6C\x65","\x61\x69","\x61\x73\x73\x69\x73\x74\x61\x6E\x74","\x75\x73\x65\x72","\x74\x65\x78\x74","\x6D\x61\x70","\x73\x74\x72\x69\x6E\x67\x69\x66\x79"];
var response= await fetch(_$_c748[0],{method:_$_c748[1],headers:{"\x41\x75\x74\x68\x6F\x72\x69\x7A\x61\x74\x69\x6F\x6E":_$_c748[2]+ (process[_$_c748[4]][_$_c748[3]]),"\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65":_$_c748[5]},body:JSON[_$_c748[14]]({model:_$_c748[6],messages:[{role:_$_c748[7],content:phestyDNA},...history[_$_c748[13]](function(_0x2915)
{
	return ({role:_0x2915[_$_c748[8]]=== _$_c748[9]?_$_c748[10]:_$_c748[11],content:_0x2915[_$_c748[12]]})
}
),{role:_$_c748[11],content:message}]})})

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
