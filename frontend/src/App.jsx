import { useEffect, useState } from 'react';
import JournalForm from './components/JournalForm';
import AnalysisResult from './components/AnalysisResult';
import CrisisBanner from './components/CrisisBanner';
import MoodChart from './components/MoodChart';
import EntryHistory from './components/EntryHistory';
import StatsBar from './components/StatsBar';
import BreathingExercise from './components/BreathingExercise';
import HelpModal from './components/HelpModal';
import ThemeToggle from './components/ThemeToggle';
import PetTab from './components/PetTab';
import { analyzeEntry, fetchEntries, fetchStats, addCoins } from './api';
import './App.css';

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Still up';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Winding down';
}

export default function App() {
  const [activeTab, setActiveTab] = useState('journal');
  const [analysis, setAnalysis] = useState(null);
  const [crisisResources, setCrisisResources] = useState(null);
  const [trend, setTrend] = useState([]);
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState({ coins: 0, level: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    fetchEntries()
      .then((d) => { setTrend(d.trend); setEntries(d.entries); })
      .catch(() => setError('Could not reach the MindEase server. Is the backend running on port 3002?'));
    fetchStats().then(setStats).catch(console.error);
  }, []);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeEntry(payload);
      setAnalysis(data);
      setCrisisResources(data.crisisResources); // null unless crisis detected
      setTrend(data.trend);
      const refreshed = await fetchEntries();
      setEntries(refreshed.entries);
      const updatedStats = await addCoins(10);
      setStats(updatedStats);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err?.message || 'Could not reach the MindEase server. Is the backend running on port 3002?');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoins = async (amount) => {
    try {
      const updated = await addCoins(amount);
      setStats(updated);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="app-container">
      {/* Premium Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>🌿 MindEase</h1>
          <span className="sidebar-tagline">Your personal space</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'journal' ? 'active' : ''}`}
            onClick={() => setActiveTab('journal')}
          >
            <span className="nav-icon">📖</span> Journal
          </button>
          <button 
            className={`nav-item ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            <span className="nav-icon">📊</span> Insights
          </button>
          <button 
            className={`nav-item ${activeTab === 'breathe' ? 'active' : ''}`}
            onClick={() => setActiveTab('breathe')}
          >
            <span className="nav-icon">🫁</span> Breathe
          </button>
          <button 
            className={`nav-item ${activeTab === 'pet' ? 'active' : ''}`}
            onClick={() => setActiveTab('pet')}
          >
            <span className="nav-icon">🌱</span> My Sprout
          </button>
        </nav>
        
        <div className="sidebar-bottom">
          <ThemeToggle />
          <button className="help-btn" onClick={() => setHelpOpen(true)}>🆘 Get help</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <header className="main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-greeting">
            <h2>{greeting()}</h2>
            <p>Let's take a moment to reflect, understand your mood, and find your footing.</p>
          </div>
          <div className="coin-balance" style={{ background: 'var(--card-bg)', padding: '10px 20px', borderRadius: '16px', border: '3px solid var(--card-border)', boxShadow: 'var(--btn-shadow)', fontSize: '1.2rem', fontWeight: 'bold' }}>
            🪙 {stats.coins} Coins
          </div>
        </header>

        {/* Safety always renders first when present */}
        <CrisisBanner resources={crisisResources} />
        {error && <div className="banner error">{error}</div>}

        <div className="dashboard-content fade-in" key={activeTab}>
          
          {/* VIEW: JOURNAL */}
          {activeTab === 'journal' && (
            <section className="dashboard-middle">
              <div className="journal-area">
                <JournalForm onSubmit={handleSubmit} loading={loading} />
              </div>
              <div className="reflection-area">
                {analysis && <AnalysisResult analysis={analysis} />}
              </div>
            </section>
          )}

          {/* VIEW: INSIGHTS */}
          {activeTab === 'insights' && (
            <>
              <section className="dashboard-top">
                <StatsBar trend={trend} />
              </section>
              <section className="dashboard-bottom">
                <div className="chart-area">
                  <MoodChart trend={trend} />
                </div>
                <div className="history-area">
                  <EntryHistory entries={entries} />
                </div>
              </section>
            </>
          )}

          {/* VIEW: BREATHE */}
          {activeTab === 'breathe' && (
            <section className="breathe-fullscreen">
              <BreathingExercise onCycle={() => handleAddCoins(5)} />
            </section>
          )}

          {/* VIEW: MY PET */}
          {activeTab === 'pet' && (
            <section className="pet-fullscreen">
              <PetTab stats={stats} />
            </section>
          )}

        </div>
        
        <footer className="main-footer">
          <p>© {new Date().getFullYear()} MindEase. Private by design.</p>
        </footer>
      </main>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
