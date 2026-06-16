// A small library of evidence-informed coping techniques. Used as a reliable fallback
// when the AI is unavailable, and as a grounding set the AI can draw from.
export const COPING_LIBRARY = [
  {
    id: 'box-breathing',
    title: 'Box breathing',
    forMoods: ['anxious', 'stressed', 'overwhelmed', 'angry'],
    steps: 'Breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat 4 times.',
  },
  {
    id: 'grounding-54321',
    title: '5-4-3-2-1 grounding',
    forMoods: ['anxious', 'overwhelmed', 'panicky', 'stressed'],
    steps: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
  },
  {
    id: 'self-compassion',
    title: 'Self-compassion break',
    forMoods: ['sad', 'low', 'lonely', 'guilty'],
    steps: 'Place a hand on your heart and say: "This is hard right now. May I be kind to myself."',
  },
  {
    id: 'gratitude',
    title: 'Tiny gratitude note',
    forMoods: ['low', 'sad', 'neutral', 'tired'],
    steps: 'Write down one small thing that went okay today, however minor.',
  },
  {
    id: 'movement',
    title: 'Gentle movement',
    forMoods: ['low', 'tired', 'stuck', 'restless'],
    steps: 'Stand up and stretch, or take a slow 5-minute walk to shift your state.',
  },
  {
    id: 'savor',
    title: 'Savor the good',
    forMoods: ['happy', 'content', 'grateful', 'calm'],
    steps: 'Pause and fully notice what feels good right now — let it land for 30 seconds.',
  },
];

export function fallbackTechniques(mood = 'neutral') {
  const m = mood.toLowerCase();
  const matches = COPING_LIBRARY.filter((t) => t.forMoods.includes(m));
  const chosen = (matches.length ? matches : COPING_LIBRARY).slice(0, 3);
  return chosen.map(({ title, steps }) => ({ title, steps }));
}
