// A scrollable list of recent journal entries (mood + short excerpt).
const MOOD_EMOJI = (score) => {
  if (score >= 8) return '😊';
  if (score >= 6) return '🙂';
  if (score >= 5) return '😐';
  if (score >= 3) return '😔';
  return '😢';
};

export default function EntryHistory({ entries }) {
  if (!entries || entries.length === 0) return null;
  return (
    <div className="card history">
      <h2>Recent entries</h2>
      <ul>
        {entries.map((e) => (
          <li key={e.id}>
            <span className="h-emoji">{MOOD_EMOJI(e.score)}</span>
            <div className="h-body">
              <div className="h-top">
                <span className="h-mood">{e.mood}</span>
                <span className="h-date">
                  {new Date(e.date).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              {e.excerpt && <p className="h-excerpt">"{e.excerpt}"</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
