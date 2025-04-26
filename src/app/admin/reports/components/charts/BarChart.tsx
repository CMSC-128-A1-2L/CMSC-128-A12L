"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Create a custom plugin to draw labels
ChartJS.register({
  id: "customLabels",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      if (!meta.hidden) {
        meta.data.forEach((element, index) => {
          // Get value
          const value = dataset.data[index] as number;

          // Get bar properties using element
          const { x } = element;
          const y = element.y - 10; // Position above the bar

          // Set styling
          ctx.fillStyle = "black";
          ctx.font = "bold 12px Arial";
          ctx.textAlign = "center";
          

          // Draw value above bar
          ctx.fillText(value.toString(), x, y);
        });
      }
    });
  },
});

interface BarChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
}

export default function BarChart({ title, data }: BarChartProps) {
  return (
    <Bar
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "top" as const,
          },
          title: {
            display: true,
            text: title,
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }}
    />
  );
}
