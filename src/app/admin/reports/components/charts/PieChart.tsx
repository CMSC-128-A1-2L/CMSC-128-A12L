"use client";

import { Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface PieChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };
  type?: "pie" | "doughnut";
}

export default function PieChart({ title, data, type = "pie" }: PieChartProps) {
  const ChartComponent = type === "pie" ? Pie : Doughnut;

  return (
    <ChartComponent
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "right" as const,
          },
          title: {
            display: true,
            text: title,
          },
          datalabels: {
            display: true,
            color: "black",
            font: {
              weight: "bold",
              size: 14,
            },
            formatter: (value: number) => value,
          },
        },
      }}
      plugins={[ChartDataLabels]}
    />
  );
}
