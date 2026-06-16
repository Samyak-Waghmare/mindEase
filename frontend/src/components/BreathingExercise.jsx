import { useEffect, useRef, useState } from 'react';

// A guided box-breathing animation: the circle expands on inhale, holds, contracts
// on exhale, holds. Makes the coping technique something you *do*, not just read.
const PHASES = [
  { label: 'Breathe in', dur: 4000, scale: 1.45 },
  { label: 'Hold', dur: 4000, scale: 1.45 },
  { label: 'Breathe out', dur: 4000, scale: 0.7 },
  { label: 'Hold', dur: 4000, scale: 0.7 },
];

export default function BreathingExercise({ onCycle }) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [cycles, setCycles] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (!running) return;
    timer.current = setTimeout(() => {
      setPhase((p) => {
        const next = (p + 1) % PHASES.length;
        if (next === 0) {
          setCycles((c) => c + 1);
          if (onCycle) onCycle();
        }
        return next;
      });
    }, PHASES[phase].dur);
    return () => clearTimeout(timer.current);
  }, [running, phase]);

  const start = () => { setRunning(true); setPhase(0); setCycles(0); };
  const stop = () => { setRunning(false); setPhase(0); clearTimeout(timer.current); };

  const current = PHASES[phase];

  return (
    <div className="card breathing">
      <h2>🫁 Breathing exercise</h2>
      <p className="muted">A 4-4-4-4 box breath to settle your nervous system.</p>

      <div className="breath-stage">
        <div
          className={`breath-circle ${running ? 'active' : ''}`}
          style={{
            transform: `scale(${running ? current.scale : 1})`,
            transitionDuration: `${running ? current.dur : 600}ms`,
          }}
        >
          <span>{running ? current.label : 'Ready?'}</span>
        </div>
      </div>

      <div className="breath-controls">
        {!running ? (
          <button onClick={start}>Start</button>
        ) : (
          <button className="ghost" onClick={stop}>Stop</button>
        )}
        {cycles > 0 && <span className="cycles">{cycles} cycle{cycles > 1 ? 's' : ''} completed 🌿</span>}
      </div>
    </div>
  );
}
