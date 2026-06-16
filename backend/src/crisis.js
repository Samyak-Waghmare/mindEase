// Crisis-safety layer. This is intentionally NOT powered by the LLM — a deterministic
// keyword check guarantees that anyone expressing risk of self-harm always sees real
// help, even if the AI is unavailable, misreads the text, or returns nonsense.

const CRISIS_PATTERNS = [
  /\bkill (myself|me)\b/i,
  /\bsuicid/i,
  /\bend (my|it all|my life)\b/i,
  /\bwant to die\b/i,
  /\bdon'?t want to (live|be alive|be here)\b/i,
  /\bno reason to live\b/i,
  /\bharm (myself|me)\b/i,
  /\bself[-\s]?harm/i,
  /\bcut(ting)? myself\b/i,
  /\bhurt myself\b/i,
  /\bbetter off without me\b/i,
  /\bcan'?t go on\b/i,
  /\boverdose\b/i,
];

// Helplines shown when crisis content is detected. India-first (the project's locale)
// plus international fallbacks.
export const CRISIS_RESOURCES = {
  message:
    "It sounds like you may be going through something really painful. You are not alone, and help is available right now. Please reach out to one of these free, confidential helplines:",
  emergencyNote:
    "If you are in immediate danger or thinking about acting on these feelings, please call your local emergency number now (112 in India, 911 in the US).",
  helplines: [
    { region: 'India', name: 'KIRAN Mental Health Helpline', contact: '1800-599-0019', hours: '24/7' },
    { region: 'India', name: 'Vandrevala Foundation', contact: '1860-2662-345 / 9999666555', hours: '24/7' },
    { region: 'India', name: 'AASRA', contact: '+91-9820466726', hours: '24/7' },
    { region: 'US', name: '988 Suicide & Crisis Lifeline', contact: 'Call or text 988', hours: '24/7' },
    { region: 'UK & ROI', name: 'Samaritans', contact: '116 123', hours: '24/7' },
    { region: 'Worldwide', name: 'Find a helpline', contact: 'findahelpline.com', hours: 'Directory' },
  ],
};

export function detectCrisis(text = '') {
  return CRISIS_PATTERNS.some((re) => re.test(text));
}
