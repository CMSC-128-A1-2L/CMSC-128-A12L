"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface EventsReportsProps {
  className?: string;
}

export default function EventsReports({ className }: EventsReportsProps) {
  // Mock event list (replace with API call in real app)
  const events = [
    { id: "1", name: "Event A" },
    { id: "2", name: "Event B" },
    { id: "3", name: "Event C" },
  ];
  const [selectedEvent, setSelectedEvent] = useState<string>(events[0].id);

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

  // RSVP data per event (mocked)
  const rsvpDataByEvent: Record<string, any> = {
    "1": {
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
    },
    "2": {
      labels: ["Attending", "Not Attending", "Pending"],
      datasets: [
        {
          data: [30, 40, 10],
          backgroundColor: [
            "rgba(75, 192, 192, 0.5)",
            "rgba(255, 99, 132, 0.5)",
            "rgba(255, 206, 86, 0.5)",
          ],
        },
      ],
    },
    "3": {
      labels: ["Attending", "Not Attending", "Pending"],
      datasets: [
        {
          data: [10, 5, 25],
          backgroundColor: [
            "rgba(75, 192, 192, 0.5)",
            "rgba(255, 99, 132, 0.5)",
            "rgba(255, 206, 86, 0.5)",
          ],
        },
      ],
    },
  };

  const rsvpStatusData = rsvpDataByEvent[selectedEvent];

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
            <div className="mt-2 text-black">
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="w-[220px] text-black">
                  <SelectValue
                    placeholder="Select Event"
                    className="text-black"
                  />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem
                      key={event.id}
                      value={event.id}
                      className="text-black"
                    >
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <PieChart title="RSVP Status" data={rsvpStatusData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
