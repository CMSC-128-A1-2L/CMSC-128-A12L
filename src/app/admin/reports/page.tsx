"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AlumniReports from "./components/AlumniReports";
import JobsReports from "./components/JobsReports";
import EventsReports from "./components/EventsReports";
import DonationsReports from "./components/DonationsReports";

type ReportType = "alumni" | "jobs" | "events" | "donations" | null;

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("alumni");

  const renderReport = () => {
    switch (selectedReport) {
      case "alumni":
        return <AlumniReports className="mt-6" />;
      case "jobs":
        return <JobsReports className="mt-6" />;
      case "events":
        return <EventsReports className="mt-6" />;
      case "donations":
        return <DonationsReports className="mt-6" />;
      default:
        return (
          <div className="text-center py-10 text-muted-foreground">
            Select a report type to view the data
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Reports Dashboard</h1>
        <div className="flex flex-wrap gap-4">
          <Button
            className="text-black"
            variant={selectedReport === "alumni" ? "default" : "outline"}
            onClick={() => setSelectedReport("alumni")}
          >
            Alumni Reports
          </Button>
          <Button
            className="text-black"
            variant={selectedReport === "jobs" ? "default" : "outline"}
            onClick={() => setSelectedReport("jobs")}
          >
            Jobs Reports
          </Button>
          <Button
            className="text-black"
            variant={selectedReport === "events" ? "default" : "outline"}
            onClick={() => setSelectedReport("events")}
          >
            Events Reports
          </Button>
          <Button
            className="text-black"
            variant={selectedReport === "donations" ? "default" : "outline"}
            onClick={() => setSelectedReport("donations")}
          >
            Donations Reports
          </Button>
        </div>
      </div>

      {renderReport()}
    </div>
  );
}
