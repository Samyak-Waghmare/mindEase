// Data-driven snapshot computed from the user's entries: streak, count, average mood,
// and the direction of their recent trend.
function computeStreak(trend) {
  // Count consecutive calendar days (ending today or yesterday) with an entry.
  const days = new Set(trend.map((t) => new Date(t.date).toDateString()));
  let streak = 0;
  const d = new Date();
  // allow today OR yesterday as the streak anchor
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  while (days.has(d.toDateString())) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export default function StatsBar({ trend }) {
  if (!trend || trend.length === 0) return null;

  const count = trend.length;
  const avg = (trend.reduce((a, t) => a + t.score, 0) / count).toFixed(1);
  const streak = computeStreak(trend);

  // trend direction over the last up-to-5 entries
  const recent = trend.slice(-5);
  const delta = recent.length >= 2 ? recent[recent.length - 1].score - recent[0].score : 0;
  let insight = 'Keep checking in — patterns appear over time.';
  if (recent.length >= 2) {
    if (delta >= 2) insight = `📈 Your mood is up ${delta} points over your last ${recent.length} entries.`;
    else if (delta <= -2) insight = `📉 Your mood dipped ${Math.abs(delta)} points recently — be gentle with yourself.`;
    else insight = '➡️ Your mood has been fairly steady lately.';
  }

  return (
    <div className="card stats-bar">
      <div className="stats-row">
        <div className="stat"><span className="stat-num">🔥 {streak}</span><span className="stat-label">day streak</span></div>
        <div className="stat"><span className="stat-num">📔 {count}</span><span className="stat-label">entries</span></div>
        <div className="stat"><span className="stat-num">💜 {avg}</span><span className="stat-label">avg mood</span></div>
      </div>
      <p className="insight">{insight}</p>
    </div>
  );
}
