"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import { useState, useEffect } from "react";
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
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [eventsPerMonthData, setEventsPerMonthData] = useState<any>(null);
  const [rsvpDataByEvent, setRsvpDataByEvent] = useState<Record<string, any>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/reports/events");
        const data = await res.json();

        // Build events list from rsvpStats
        const fetchedEvents = data.rsvpStats.map((event: any, index: number) => ({
          id: index.toString(),  // generate id based on index
          name: event.name,
        }));
        setEvents(fetchedEvents);

        // Default select the first event
        if (fetchedEvents.length > 0) {
          setSelectedEvent(fetchedEvents[0].id);
        }

        // Prepare bar chart data
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const eventsPerMonth = {
          labels: data.monthlyStats.map((item: any) => months[item.month - 1]),
          datasets: [
            {
              label: "Number of Events",
              data: data.monthlyStats.map((item: any) => item.numberOfEvents),
              backgroundColor: "rgba(255, 159, 64, 0.5)",
            },
          ],
        };
        setEventsPerMonthData(eventsPerMonth);

        // Prepare RSVP data per event
        const rsvpByEvent: Record<string, any> = {};
        data.rsvpStats.forEach((event: any, index: number) => {
          rsvpByEvent[index.toString()] = {
            labels: ["Attending", "Not Attending", "Pending"],
            datasets: [
              {
                data: [event.wouldGo, event.wouldNotGo, event.wouldMaybeGo],
                backgroundColor: [
                  "rgba(75, 192, 192, 0.5)",
                  "rgba(255, 99, 132, 0.5)",
                  "rgba(255, 206, 86, 0.5)",
                ],
              },
            ],
          };
        });
        setRsvpDataByEvent(rsvpByEvent);

      } catch (error) {
        console.error("Failed to fetch event reports:", error);
      }
    }

    fetchData();
  }, []);

  const rsvpStatusData = selectedEvent ? rsvpDataByEvent[selectedEvent] : null;

  return (
    <div className={className}>
      <div className="grid gap-6 md:grid-cols-2 text-black">
        <Card>
          <CardHeader>
            <CardTitle>Events per Month</CardTitle>
          </CardHeader>
          <CardContent>
            {eventsPerMonthData && (
              <BarChart title="Monthly Events" data={eventsPerMonthData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RSVP Status Distribution</CardTitle>
            <div className="mt-2 text-black">
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="w-[220px] text-black bg-white">
                  <SelectValue placeholder="Select Event" className="text-black bg-white" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id} className="text-black bg-white">
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {rsvpStatusData && (
              <PieChart title="RSVP Status" data={rsvpStatusData} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
