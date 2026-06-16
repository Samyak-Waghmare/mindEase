// Prominent, non-dismissable crisis-support banner. Shown whenever the backend's
// deterministic crisis check flags an entry. Never relies on the AI.
export default function CrisisBanner({ resources }) {
  if (!resources) return null;
  return (
    <div className="crisis-banner" role="alert">
      <h2>💙 You matter, and help is here</h2>
      <p className="crisis-msg">{resources.message}</p>
      <ul className="helplines">
        {resources.helplines.map((h, i) => (
          <li key={i}>
            <span className="region">{h.region}</span>
            <span className="name">{h.name}</span>
            <span className="contact">{h.contact}</span>
            <span className="hours">{h.hours}</span>
          </li>
        ))}
      </ul>
      <p className="emergency">{resources.emergencyNote}</p>
    </div>
  );
}
