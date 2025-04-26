"use client";

import { useState } from "react";
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
  id: string;
  title: string;
  company: string;
  date: string;
  location: string;
  type: string;
}

export default function JobsReports({ className }: JobsReportsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data - replace with actual data from your API
  const jobPostingsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Number of Job Postings",
        data: [25, 32, 28, 35, 42, 38],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const sampleJobListings: JobListing[] = [
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "Tech Corp",
      date: "2024-03-15",
      location: "Manila",
      type: "Full-time",
    },
    {
      id: "2",
      title: "Data Scientist",
      company: "Analytics Inc",
      date: "2024-03-14",
      location: "Cebu",
      type: "Full-time",
    },
    {
      id: "3",
      title: "UX Designer",
      company: "Design Studio",
      date: "2024-03-13",
      location: "Makati",
      type: "Contract",
    },
    // Add more sample job listings as needed
  ];

  const filteredJobs = sampleJobListings.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    <TableHead>Date Posted</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>{job.date}</TableCell>
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
