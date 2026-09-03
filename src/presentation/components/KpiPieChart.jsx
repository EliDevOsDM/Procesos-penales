import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#9a031e",
  "#0f4c5c",
  "#d97706",
  "#1a1a2e",
  "#5c4d7d",
  "#0891b2",
  "#be185d",
  "#65a30d",
];

export default function KpiPieChart({ title, data, valueFormatter, embedded = false }) {
  const chartData = (data || []).filter((d) => d.value > 0);
  const formatValue = valueFormatter || ((v) => v);
  const wrapperClass = embedded ? "kpi-chart-embedded" : "card kpi-chart-card";

  if (chartData.length === 0) {
    return (
      <div className={wrapperClass}>
        <h4>{title}</h4>
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
        backgroundColor: chartData.map((_, index) => COLORS[index % COLORS.length]),
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 14,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleFont: { size: 13, weight: "600" },
        bodyFont: { size: 12 },
        padding: 10,
        callbacks: {
          label: (context) => {
            const value = context.parsed ?? 0;
            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
            return `${context.label}: ${formatValue(value)} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className={wrapperClass}>
      <h4>{title}</h4>
      {!embedded && (
        <p className="kpi-chart-hint">Pasa el cursor sobre el gráfico para ver el detalle.</p>
      )}
      <div className="kpi-chart-canvas">
        <Pie data={chartConfig} options={options} />
      </div>
    </div>
  );
}
