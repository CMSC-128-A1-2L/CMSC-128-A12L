"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import LineChart from "./charts/LineChart";

interface AlumniReportsProps {
  className?: string;
}

export default function AlumniReports({ className }: AlumniReportsProps) {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedGradYear, setSelectedGradYear] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const gradYears = Array.from({ length: 5 }, (_, i) => currentYear + 3 + i); // Starting from 2026
  const courses = [
    "BS Computer Science",
    "BS Information Technology",
    "BS Information Systems",
  ];

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
      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="flex flex-wrap gap-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedGradYear} onValueChange={setSelectedGradYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Graduation Year" />
            </SelectTrigger>
            <SelectContent>
              {gradYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
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
