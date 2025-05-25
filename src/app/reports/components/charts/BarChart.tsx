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
  // Custom plugin for value labels (only for this chart)
  const valueLabelsPlugin = {
    id: "customLabels",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    afterDatasetsDraw(chart: any) {
      const { ctx } = chart;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chart.data.datasets.forEach((dataset: any, i: any) => {
        const meta = chart.getDatasetMeta(i);
        if (!meta.hidden) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          meta.data.forEach((element: any, index: any) => {
            // Get value
            const value = dataset.data[index] as number;
            // Get bar properties using element
            const { x } = element;
            const y = element.y - 10; // Position above the bar
            // Set styling
            ctx.fillStyle = "black";
            ctx.font = "bold 12px Arial";
            ctx.textAlign = "center";
            // Draw value above bar only if not zero
            if (value !== 0) {
              ctx.fillText(value.toString(), x, y);
            }
          });
        }
      });
    },
  };

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
      plugins={[valueLabelsPlugin]}
    />
  );
}
