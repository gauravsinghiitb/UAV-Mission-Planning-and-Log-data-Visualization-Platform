import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function Graphs({ history }) {
  const buildDataset = (label, key, color) => ({
    label,
    data: history.map(f => f[key]),
    borderColor: color,
    fill: false,
    tension: 0.3,
  });

  const commonOptions = { responsive: true, maintainAspectRatio: false };

  const charts = [
    { label: "Altitude (m)", key: "altitude", color: "blue" },
    { label: "Speed (m/s)", key: "speed", color: "green" },
    { label: "Vertical Speed (vz)", key: "vz", color: "orange" },
    { label: "Voltage (V)", key: "voltage", color: "purple" },
    { label: "Roll (°)", key: "roll", color: "red" },
    { label: "Pitch (°)", key: "pitch", color: "cyan" }
  ];

  return (
    <div className="graphs-grid">
      {charts.map((chart, idx) => (
        <div key={idx} className="graph-card">
          <h3>{chart.label}</h3>
          <Line
            data={{
              labels: history.map(f => f.time_s.toFixed(1)),
              datasets: [buildDataset(chart.label, chart.key, chart.color)],
            }}
            options={commonOptions}
          />
        </div>
      ))}
    </div>
  );
}
