import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const KPI_CHART_COLORS = [
  "#9a031e",
  "#0f4c5c",
  "#d97706",
  "#1a1a2e",
  "#5c4d7d",
  "#0891b2",
  "#be185d",
  "#65a30d",
];

export default function KpiBarChart({ title, data, embedded = false }) {
  const chartData = (data || []).filter((d) => d.value > 0);
  const wrapperClass = embedded ? "kpi-chart-embedded" : "card kpi-chart-card";

  if (chartData.length === 0) {
    return (
      <div className={wrapperClass}>
        {title && <h4>{title}</h4>}
        <p className="muted-text">Sin datos para graficar.</p>
      </div>
    );
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const chartConfig = {
    labels: chartData.map((item) => item.name),
    datasets: [
      {
        data: chartData.map((item) => item.value),
        backgroundColor: chartData.map((_, index) => KPI_CHART_COLORS[index % KPI_CHART_COLORS.length]),
        borderRadius: 6,
        barThickness: 22,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        callbacks: {
          label: (context) => {
            const value = context.parsed.x ?? 0;
            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
            return `${value} (${pct}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: "#f0f0f0" },
        ticks: { precision: 0 },
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 12, weight: "600" } },
      },
    },
  };

  return (
    <div className={wrapperClass}>
      {title && <h4 className="kpi-chart-title">{title}</h4>}
      <div
        className="kpi-bar-canvas"
        style={{ height: Math.max(180, chartData.length * 30 + 24) }}
      >
        <Bar data={chartConfig} options={options} />
      </div>
    </div>
  );
}
