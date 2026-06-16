import { useEffect, useState } from 'react';
import { fetchResources } from '../api';

// Always-available crisis support, opened from the header "Get help" button —
// so resources are one tap away at any time, not only when an entry is flagged.
export default function HelpModal({ open, onClose }) {
  const [resources, setResources] = useState(null);

  useEffect(() => {
    if (open && !resources) {
      fetchResources().then(setResources).catch(() => {});
    }
  }, [open, resources]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <h2>💙 You're not alone</h2>
        {!resources && <p className="muted">Loading support resources…</p>}
        {resources && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
