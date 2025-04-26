"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";

interface EventsReportsProps {
  className?: string;
}

export default function EventsReports({ className }: EventsReportsProps) {
  // Sample data - replace with actual data from your API
  const eventsPerMonthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Number of Events",
        data: [3, 4, 5, 3, 6, 4],
        backgroundColor: "rgba(255, 159, 64, 0.5)",
      },
    ],
  };

  const rsvpStatusData = {
    labels: ["Attending", "Not Attending", "Pending"],
    datasets: [
      {
        data: [65, 20, 15],
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(255, 206, 86, 0.5)",
        ],
      },
    ],
  };

  return (
    <div className={className}>
      <div className="grid gap-6 md:grid-cols-2 text-black">
        <Card>
          <CardHeader>
            <CardTitle>Events per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart title="Monthly Events" data={eventsPerMonthData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RSVP Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart title="RSVP Status" data={rsvpStatusData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
