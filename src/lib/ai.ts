// ClearSpend Multi-AI - Auto Switch
// Groq 1 -> Gemini, credit khatam hote hi apne aap switch

function getKeys(name: string): string[] {
  const raw = process.env[name] || '';
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

const GROQ_KEYS = getKeys('EXPO_PUBLIC_GROQ_KEYS');
const OPENROUTER_KEYS = getKeys('EXPO_PUBLIC_OPENROUTER_KEYS');
const GEMINI_KEYS = getKeys('EXPO_PUBLIC_GEMINI_KEYS');

// Expo me jo naam tune save kiye hain - wahi wale
if (process.env.EXPO_PUBLIC_GROQ_API_KEY) GROQ_KEYS.push(process.env.EXPO_PUBLIC_GROQ_API_KEY);
if (process.env.EXPO_PUBLIC_GROQ_API_KEY_1) GROQ_KEYS.push(process.env.EXPO_PUBLIC_GROQ_API_KEY_1);
if (process.env.EXPO_PUBLIC_GEMINI_API_KEY) GEMINI_KEYS.push(process.env.EXPO_PUBLIC_GEMINI_API_KEY);
if (process.env.EXPO_PUBLIC_GEMINI_KEYS) GEMINI_KEYS.push(...getKeys('EXPO_PUBLIC_GEMINI_KEYS'));

async function callGroq(key: string, messages: any[]) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'openai/gpt-oss-20b', messages, temperature: 0.7 })
  });
  if (!res.ok) throw new Error(`Groq ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

async function callOpenRouter(key: string, messages: any[]) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://clearspend.app', 'X-Title': 'ClearSpend' },
    body: JSON.stringify({ model: 'meta-llama/llama-3.1-8b-instruct:free', messages, temperature: 0.7 })
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

async function callGemini(key: string, messages: any[]) {
  const prompt = messages.map((m: any) => `${m.role}: ${m.content}`).join('\n');
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
}

export async function askAI(messages: { role: string; content: string }[], transactions: any[]) {
  const context = `User ke transactions: ${JSON.stringify(transactions.slice(0, 20))}. Tu ClearSpend ka AI assistant hai. Hindi + English mix me short jawab de. Budget advice de.`;
  const fullMessages = [{ role: 'system', content: context }, ...messages];

  for (const key of GROQ_KEYS) {
    try {
      const ans = await callGroq(key, fullMessages);
      if (ans) return ans;
    } catch (e) { console.log('Groq fail, next try...'); }
  }

  for (const key of OPENROUTER_KEYS) {
    try {
      const ans = await callOpenRouter(key, fullMessages);
      if (ans) return ans;
    } catch (e) { console.log('OpenRouter fail, next try...'); }
  }

  for (const key of GEMINI_KEYS) {
    try {
      const ans = await callGemini(key, fullMessages);
      if (ans) return ans;
    } catch (e) { console.log('Gemini fail, next try...'); }
  }

  return 'Saari AI keys khatam / fail ho gayi. Thodi der baad try karo ya nayi key daalo.';
}
