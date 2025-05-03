"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import LineChart from "./charts/LineChart";

interface AlumniReportsProps {
  className?: string;
}

interface AlumniPerGradYear {
  year: string;
  numOfAlumniPerGradYear: number;
}

interface DistributionByField {
  field: string;
  numOfAlumniInField: number;
}

interface MonthlyActiveAlumni {
  year: number;
  month: number;
  numOfActiveAlumni: number;
}

export default function AlumniReports({ className }: AlumniReportsProps) {
  const [alumniPerYear, setAlumniPerYear] = useState<AlumniPerGradYear[]>([]);
  const [distributionByField, setDistributionByField] = useState<DistributionByField[]>([]);
  const [monthlyActiveAlumni, setMonthlyActiveAlumni] = useState<MonthlyActiveAlumni[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/reports/alumni", { method: "GET" });
        const data = await res.json();

        setAlumniPerYear(data.alumniPerGraduationYear || []);
        setDistributionByField(data.distributionByField || []);
        setMonthlyActiveAlumni(data.monthlyActiveAlumni || []);
      } catch (error) {
        console.error("Failed to fetch alumni report data", error);
      }
    }

    fetchData();
  }, []);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; 
  const alumniByYearData = {
    labels: alumniPerYear.map((item) => item.year),
    datasets: [
      {
        label: "Number of Alumni",
        data: alumniPerYear.map((item) => item.numOfAlumniPerGradYear),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const alumniByFieldData = {
    labels: distributionByField.map((item) => item.field),
    datasets: [
      {
        data: distributionByField.map((item) => item.numOfAlumniInField),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(199, 199, 199, 0.5)",
          "rgba(83, 102, 255, 0.5)",
        ],
      },
    ],
  };

  // month headrs lfg
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const sortedMonthlyActiveAlumni = [...monthlyActiveAlumni]
  .filter((item) => {
    // Only include months that are earlier than or equal to today
    return (
      item.year < currentYear ||
      (item.year === currentYear && item.month <= currentMonth)
    );
  })
  .sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }
    return a.month - b.month;
  });



const monthlyActiveData = {
  labels: sortedMonthlyActiveAlumni.map(
    (item) => `${monthNames[item.month - 1]} ${item.year}`
  ),
  datasets: [
    {
      label: "Active Alumni",
      data: sortedMonthlyActiveAlumni.map((item) => item.numOfActiveAlumni),
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};
  

  return (
    <div className={className}>
      {/* Charts */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 text-black">
        <Card className="overflow-hidden">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Alumni per Graduation Year</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="w-full min-h-[300px] sm:min-h-[350px]">
              <BarChart title="Alumni by Year" data={alumniByYearData} />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Distribution by Field</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="w-full min-h-[300px] sm:min-h-[350px]">
              <PieChart title="Alumni by Field" data={alumniByFieldData} />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 overflow-hidden">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Monthly Active Alumni</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="w-full min-h-[300px] sm:min-h-[400px]">
              <LineChart title="Engagement Trends" data={monthlyActiveData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
