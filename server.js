import express from "express";
import Groq from "groq-sdk";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req,res)=> res.sendFile(path.join(__dirname,"public","index.html")));

// groq client
const client = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

app.post("/api/ai", async (req,res)=>{
  try{
    const { message } = req.body || {};
    if(!message) return res.status(400).json({ error: "Missing message" });
    if(!process.env.GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY not configured" });
    const completion = await client.chat.completions.create({
      model: process.env.MODEL || "llama-3.1-8b-instant",
      messages: [{ role:"system", content:"You are Kisah Sukses Pro AI assistant"},{ role:"user", content: message }]
    });
    res.json({ reply: completion.choices?.[0]?.message?.content || "(no reply)" });
  }catch(e){
    console.error("AI error:", e);
    res.status(500).json({ error: "AI failed" });
  }
});

const QUOTES = ["Jangan menyerah — langkah kecil hari ini adalah kemenangan besar esok.","Kesuksesan datang kepada mereka yang tak takut mencoba lagi.","Dream big. Work hard. Stay humble."];
app.get("/api/quote",(req,res)=> res.json({ quote: QUOTES[Math.floor(Math.random()*QUOTES.length)] }));

app.post("/api/social",(req,res)=>{ const { platform, text, url } = req.body || {}; const et=encodeURIComponent(text||''); const eu=encodeURIComponent(url||''); let share=''; switch((platform||'').toLowerCase()){case 'facebook': share=`https://www.facebook.com/sharer/sharer.php?u=${eu}&quote=${et}`;break;case 'twitter': share=`https://twitter.com/intent/tweet?text=${et}&url=${eu}`;break;case 'instagram': share=`https://www.instagram.com/`;break;case 'tiktok': share=`https://www.tiktok.com/search?q=${et}`;break;default: share=url||'';} res.json({ shareUrl: share });});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=> console.log("Server running on port", PORT));
