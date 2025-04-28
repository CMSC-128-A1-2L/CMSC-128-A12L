"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BarChart from "./charts/BarChart";

interface JobsReportsProps {
  className?: string;
}

interface JobListing {
  title: string;
  company: string;
  location: string;
  type: string;
}

interface MonthlyJobPosting {
  year: number;
  month: number;
  numOfJobPostings: number;
}

export default function JobsReports({ className }: JobsReportsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [monthlyJobPostings, setMonthlyJobPostings] = useState<MonthlyJobPosting[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/reports/jobs", { method: "GET" });
        const data = await res.json();

        setJobListings(data.jobListings || []);
        setMonthlyJobPostings(data.monthlyJobPostings || []);
      } catch (error) {
        console.error("Failed to fetch jobs report data", error);
      }
    }

    fetchData();
  }, []);

  const filteredJobs = jobListings.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prepare chart data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const currentDate = new Date();
  const last6Months = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    last6Months.push({ year: date.getFullYear(), month: date.getMonth() + 1 });
  }

  const monthLabels = last6Months.map(
    (date) => months[date.month - 1]
  );

  const jobPostingsData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Number of Job Postings",
        data: last6Months.map((date) => {
          const matching = monthlyJobPostings.find(
            (item) => item.year === date.year && item.month === date.month
          );
          return matching ? matching.numOfJobPostings : 0;
        }),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return (
    <div className={className}>
      <div className="grid gap-6 text-black">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart title="Job Postings per Month" data={jobPostingsData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
