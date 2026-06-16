// Gemini-powered journal analysis (runs server-side; API key never reaches the browser).
// Detects mood, scores it, writes a short empathetic reflection, and suggests coping
// techniques. Falls back to a heuristic analyzer if no key or on any error.
import { fallbackTechniques } from './copingTechniques.js';

const MODEL = 'gemini-2.0-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const POSITIVE = ['happy', 'grateful', 'calm', 'excited', 'proud', 'good', 'great', 'relaxed', 'content', 'love', 'joy'];
const NEGATIVE = ['sad', 'anxious', 'stressed', 'angry', 'tired', 'lonely', 'overwhelmed', 'worried', 'depressed', 'scared', 'hopeless', 'exhausted', 'frustrated'];

function heuristicAnalyze(text) {
  const lower = text.toLowerCase();
  let score = 5;
  let mood = 'neutral';
  let hits = { pos: 0, neg: 0 };
  for (const w of POSITIVE) if (lower.includes(w)) { hits.pos++; }
  for (const w of NEGATIVE) if (lower.includes(w)) { hits.neg++; }
  score = Math.max(1, Math.min(10, 5 + hits.pos * 2 - hits.neg * 2));
  if (score >= 7) mood = 'positive';
  else if (score <= 4) mood = NEGATIVE.find((w) => lower.includes(w)) || 'low';
  return {
    mood,
    score,
    reflection:
      "Thank you for taking a moment to check in with yourself. Naming how you feel is a meaningful step.",
    techniques: fallbackTechniques(mood),
    source: 'heuristic',
  };
}

// Transcribe a photo of a handwritten/printed journal page using Gemini's vision.
// Returns the extracted text, or null if no key / failure (caller handles fallback).
export async function transcribeImage(base64, mimeType = 'image/jpeg') {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'YOUR_GEMINI_API_KEY_HERE') return null;
  if (!base64) return null;

  const prompt =
    'This image is a page from a personal journal. Transcribe ALL the handwritten or printed ' +
    'text exactly as written, preserving line breaks. Return ONLY the transcribed text with no ' +
    'commentary, labels, or quotation marks. If there is no readable text, return an empty string.';

  try {
    const res = await fetch(`${ENDPOINT}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: base64 } }] },
        ],
        generationConfig: { temperature: 0.1 },
      }),
    });
    if (!res.ok) throw new Error(`Gemini vision HTTP ${res.status}`);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return (text || '').trim();
  } catch (err) {
    console.warn('[gemini] transcribeImage failed:', err.message);
    return null;
  }
}

export async function analyzeEntry(text, isCrisis) {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'YOUR_GEMINI_API_KEY_HERE') return heuristicAnalyze(text);

  const safety = isCrisis
    ? 'IMPORTANT: the entry may indicate risk of self-harm. Be exceptionally gentle, validate their pain, do NOT minimize it, and gently encourage them to reach out to a trusted person or a helpline. Do not give clinical or medical instructions.'
    : 'Be warm and validating. Do not diagnose or give medical advice.';

  const prompt = `You are MindEase, a kind, non-judgmental journaling companion (NOT a therapist).
Read this journal entry and respond supportively. ${safety}
Entry: """${text}"""
Respond with ONLY valid JSON in exactly this shape:
{"mood":"one or two words e.g. anxious, hopeful, calm",
 "score": <integer 1-10 where 1=very low and 10=very positive>,
 "reflection":"2-3 warm, validating sentences reflecting what they shared",
 "techniques":[{"title":"short name","steps":"one practical sentence"}]}
Provide 2-3 techniques relevant to their mood.`;

  try {
    const res = await fetch(`${ENDPOINT}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, responseMimeType: 'application/json' },
      }),
    });
    if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
    const data = await res.json();
    const out = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!out) throw new Error('Empty Gemini response');
    const parsed = JSON.parse(out);
    if (!parsed.mood || typeof parsed.score !== 'number') throw new Error('Bad shape');
    if (!Array.isArray(parsed.techniques) || parsed.techniques.length === 0) {
      parsed.techniques = fallbackTechniques(parsed.mood);
    }
    parsed.score = Math.max(1, Math.min(10, Math.round(parsed.score)));
    return { ...parsed, source: 'gemini' };
  } catch (err) {
    console.warn('[gemini] analyze failed, using heuristic:', err.message);
    return heuristicAnalyze(text);
  }
}
