import { NextRequest, NextResponse } from "next/server";
import { getEventRepository, RSVPType } from "@/repositories/event_repository";
import {Event} from "@/entities/event";
/**
 * 
 * 
 * 
 */
// Utility to get { month, year } from a date
function getMonthYear(date: Date) {
  return { month: date.getMonth() + 1, year: date.getFullYear() }; // getMonth 0-indexed
}
export async function GET() {
    try {
      const eventRepo = getEventRepository();
      const events: Event[] = await eventRepo.getAllEvents();
  
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 5); // covers this month + last 5
  
      // group events by month/year
      const eventsByMonth: { [key: string]: number } = {};
  
      for (const event of events) {
        const start = new Date(event.startDate);
        if (start >= sixMonthsAgo && start <= now) {
          const month = start.getMonth() + 1;
          const year = start.getFullYear();
          const key = `${year}-${month.toString().padStart(2, "0")}`;
          eventsByMonth[key] = (eventsByMonth[key] || 0) + 1;
        }
      }
  
      const monthlyStats = Object.entries(eventsByMonth).map(([key, count]) => {
        const [year, month] = key.split("-");
        return {
          year: parseInt(year),
          month: parseInt(month),
          numberOfEvents: count,
        };
      });
  
      // Event RSVP Summary
      const eventRSVPSummary = events.map(event => ({
        name: event.name,
        wouldGo: (event.wouldGo ?? []).length,
        wouldNotGo: (event.wouldNotGo ?? []).length,
        wouldMaybeGo: (event.wouldMaybeGo ?? []).length,
      }));
  
      return NextResponse.json(
        {
          monthlyStats,
          rsvpStats: eventRSVPSummary,
        },
        { status: 200 }
      );
    } catch (err) {
      console.error("Failed to fetch report data:", err);
      return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
    }
  }
  