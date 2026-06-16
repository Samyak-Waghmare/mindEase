import React from 'react';

const MASCOTS = [
  { level: 1, emoji: '🌱', name: 'Little Seed' },
  { level: 2, emoji: '🌿', name: 'Happy Sprout' },
  { level: 3, emoji: '🪴', name: 'Potted Plant' },
  { level: 4, emoji: '🌳', name: 'Big Tree' },
  { level: 5, emoji: '🌟', name: 'Magic Tree' }
];

export default function PetTab({ stats }) {
  const currentLevel = stats.level;
  const currentCoins = stats.coins;
  
  // Find current mascot (cap at max level)
  const mascotIndex = Math.min(currentLevel - 1, MASCOTS.length - 1);
  const mascot = MASCOTS[mascotIndex];
  
  // Calculate progress to next level
  const coinsForNextLevel = currentLevel * 50; 
  const progressPercent = Math.min(100, (currentCoins / coinsForNextLevel) * 100);

  return (
    <div className="card pet-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h2>My Mind Sprout</h2>
      <p className="muted">Take care of your mind, and your sprout will grow!</p>
      
      <div 
        className="mascot-display" 
        style={{ 
          fontSize: '120px', 
          margin: '40px 0',
          animation: 'bounce 2s infinite ease-in-out'
        }}
      >
        {mascot.emoji}
      </div>
      
      <h3>{mascot.name} (Level {currentLevel})</h3>
      
      <div className="progress-container" style={{ maxWidth: '400px', margin: '20px auto' }}>
        <div className="progress-bar-bg" style={{ background: 'var(--card-border-inner)', borderRadius: '12px', height: '24px', overflow: 'hidden', border: '3px solid var(--card-border)' }}>
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%`, background: 'var(--good)', height: '100%', transition: 'width 0.5s ease' }}></div>
        </div>
        <p className="muted" style={{ marginTop: '10px' }}>
          {currentCoins} / {coinsForNextLevel} Coins to next level
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}
