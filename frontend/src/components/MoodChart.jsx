import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function MoodChart({ trend }) {
  if (!trend || trend.length === 0) {
    return (
      <div className="card mood-chart">
        <h2>Your mood trend</h2>
        <div className="empty-state">
          <span className="empty-emoji">🌱</span>
          Your mood journey starts with your first entry. Write or speak how you feel above,
          and watch your trend grow here.
        </div>
      </div>
    );
  }

  const data = {
    labels: trend.map((t) => t.label),
    datasets: [
      {
        label: 'Wellbeing score',
        data: trend.map((t) => t.score),
        borderColor: '#6c5ce7',
        backgroundColor: 'rgba(108, 92, 231, 0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#6c5ce7',
      },
    ],
  };

  const avg = (trend.reduce((a, t) => a + t.score, 0) / trend.length).toFixed(1);

  return (
    <div className="card mood-chart">
      <h2>Your mood trend</h2>
      <p className="muted">Average wellbeing: <strong>{avg}/10</strong> over {trend.length} entries</p>
      <Line
        data={data}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              min: 0, max: 10,
              ticks: { stepSize: 2, color: 'rgba(150,140,180,0.9)' },
              grid: { color: 'rgba(150,140,180,0.18)' },
              title: { display: true, text: 'Score', color: 'rgba(150,140,180,0.9)' },
            },
            x: {
              ticks: { color: 'rgba(150,140,180,0.9)' },
              grid: { color: 'rgba(150,140,180,0.12)' },
            },
          },
        }}
      />
    </div>
  );
}
