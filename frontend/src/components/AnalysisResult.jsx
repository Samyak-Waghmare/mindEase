// Shows the AI's mood read, empathetic reflection, and suggested coping techniques.
const MOOD_EMOJI = (score) => {
  if (score >= 8) return '😊';
  if (score >= 6) return '🙂';
  if (score >= 5) return '😐';
  if (score >= 3) return '😔';
  return '😢';
};

export default function AnalysisResult({ analysis }) {
  if (!analysis) return null;
  const { mood, score, reflection, techniques, source, fromImage, transcribedText } = analysis;

  return (
    <div className="card analysis">
      {fromImage && transcribedText && (
        <div className="transcribed">
          <span className="transcribed-label">📷 Read from your photo</span>
          <p>"{transcribedText}"</p>
        </div>
      )}
      <div className="mood-head">
        <span className="emoji">{MOOD_EMOJI(score)}</span>
        <div>
          <div className="mood-label">Mood: <strong>{mood}</strong></div>
          <div className="mood-score">Wellbeing score: {score}/10</div>
        </div>
      </div>

      <div className="mood-bar">
        <div className="mood-bar-fill" style={{ width: `${score * 10}%` }} />
      </div>

      <p className="reflection">{reflection}</p>

      <h3>🌱 Coping techniques to try</h3>
      <ul className="techniques">
        {techniques.map((t, i) => (
          <li key={i}>
            <strong>{t.title}.</strong> {t.steps}
          </li>
        ))}
      </ul>

      <p className="source-note">
        {source === 'gemini'
          ? 'Reflection by Google Gemini'
          : 'Reflection by built-in companion (add a Gemini key for richer responses)'}
      </p>
    </div>
  );
}
