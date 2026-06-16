import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { analyzeEntry, transcribeImage } from './gemini.js';
import { detectCrisis, CRISIS_RESOURCES } from './crisis.js';
import { addEntry, getEntries, getMoodTrend, getStats, updateStats } from './db.js';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json({ limit: '12mb' })); // large enough for a journal photo (base64)
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

function userIdOf(req) {
  return req.header('x-user-id') || 'demo-user';
}
function geminiConfigured() {
  const k = process.env.GEMINI_API_KEY;
  return Boolean(k) && k !== 'YOUR_GEMINI_API_KEY_HERE';
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, geminiConfigured: geminiConfigured() });
});

// Analyze a journal entry: crisis check (deterministic) -> AI mood/reflection/techniques.
app.post('/api/analyze', async (req, res) => {
  try {
    const userId = userIdOf(req);
    let text = (req.body?.text || '').toString().trim();
    const { image, mimeType } = req.body || {};
    let fromImage = false;

    // If a journal photo was sent (and no typed text), transcribe it with Gemini vision
    // and then run the exact same pipeline as a typed entry.
    if (!text && image) {
      if (!geminiConfigured()) {
        return res.status(400).json({
          error: 'Reading journal photos needs a Gemini API key on the server. Please type your entry, or add a key.',
        });
      }
      const transcribed = await transcribeImage(image, mimeType || 'image/jpeg');
      if (!transcribed) {
        return res.status(422).json({ error: "Couldn't read any text from that image. Try a clearer, well-lit photo." });
      }
      text = transcribed;
      fromImage = true;
    }

    if (!text) return res.status(400).json({ error: 'Empty entry' });

    // Safety FIRST and always — never depends on the AI succeeding.
    const crisis = detectCrisis(text);

    const analysis = await analyzeEntry(text, crisis);

    // Persist only mood/score + a short excerpt (privacy-conscious).
    const saved = addEntry(userId, {
      mood: analysis.mood,
      score: analysis.score,
      excerpt: text,
    });

    res.json({
      entryId: saved.id,
      date: saved.date,
      fromImage,
      transcribedText: fromImage ? text : undefined,
      mood: analysis.mood,
      score: analysis.score,
      reflection: analysis.reflection,
      techniques: analysis.techniques,
      source: analysis.source,
      crisis,
      crisisResources: crisis ? CRISIS_RESOURCES : null,
      trend: getMoodTrend(userId),
    });
  } catch (err) {
    console.error('[/api/analyze] error:', err);
    res.status(500).json({ error: 'Failed to analyze entry' });
  }
});

// Mood trend + recent entries for the dashboard.
app.get('/api/entries', (req, res) => {
  const userId = userIdOf(req);
  res.json({ trend: getMoodTrend(userId), entries: getEntries(userId).slice(-20).reverse() });
});

// Always-available crisis resources (e.g. for a permanent "Get help" link).
app.get('/api/resources', (_req, res) => res.json(CRISIS_RESOURCES));

// User stats (coins, level)
app.get('/api/stats', (req, res) => {
  res.json(getStats(userIdOf(req)));
});

app.post('/api/stats/add', (req, res) => {
  const { coins } = req.body;
  if (!coins || typeof coins !== 'number') return res.status(400).json({ error: 'Invalid coins amount' });
  res.json(updateStats(userIdOf(req), coins));
});

app.listen(PORT, () => {
  console.log(`MindEase API running on http://localhost:${PORT}`);
  console.log(`Gemini configured: ${geminiConfigured()}`);
});
