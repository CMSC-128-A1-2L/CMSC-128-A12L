"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import LineChart from "./charts/LineChart";

interface AlumniReportsProps {
  className?: string;
}

export default function AlumniReports({ className }: AlumniReportsProps) {
  // Sample data - replace with actual data from your API
  const alumniByYearData = {
    labels: ["2019", "2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "Number of Alumni",
        data: [65, 78, 82, 95, 88],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const alumniByFieldData = {
    labels: [
      "Software Development",
      "Data Science",
      "Cybersecurity",
      "UI/UX Design",
      "Project Management",
    ],
    datasets: [
      {
        data: [30, 20, 15, 18, 17],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
      },
    ],
  };

  const monthlyActiveData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Active Alumni",
        data: [120, 135, 128, 142, 156, 168],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className={className}>
      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 text-black">
        <Card>
          <CardHeader>
            <CardTitle>Alumni per Graduation Year</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart title="Alumni by Year" data={alumniByYearData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution by Field</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart title="Alumni by Field" data={alumniByFieldData} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Active Alumni</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart title="Engagement Trends" data={monthlyActiveData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
