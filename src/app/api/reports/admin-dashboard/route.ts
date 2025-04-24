// api/reports/route.ts

import { NextResponse } from "next/server";
import { getUserRepository } from "@/repositories/user_repository";
import { getEventRepository } from "@/repositories/event_repository";
import { getOpportunityRepository } from "@/repositories/opportunity_repository";
import { User } from "@/entities/user";
import { Event } from "@/entities/event";
import { Opportunity } from "@/entities/opportunity";

export async function GET() {
  try {
    const userRepo = getUserRepository();
    const eventRepo = getEventRepository();
    const jobRepo = getOpportunityRepository();

    // Fetch all alumni
    const alumni: User[] = await userRepo.getAllAlumni();
    const numberOfAlumni = alumni.length;

    //Fetch all jobs
    const jobs: Opportunity[] = await jobRepo.getAllOpportunities();
    const numberOfOpportunities = jobs.length;
    // fetch all users
    const users: User[] = await userRepo.getAllUsers();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); //new user - users created within the week 

    const numberOfNewUsers = users.filter(user => {
      const createdAt = new Date(user.createdAt as any); // getAllUsers does not return createdAt field 
      return createdAt >= oneWeekAgo;
    }).length;

    // Fetch all events
    const events: Event[] = await eventRepo.getAllEvents();
    const now = new Date();

    const numberOfUpcomingEvents = events.filter(event => {
      const endDate = new Date(event.endDate);
      return endDate > now;
    }).length;

    return NextResponse.json({
      numberOfAlumni,
      numberOfNewUsers,
      numberOfUpcomingEvents,
      numberOfOpportunities,
    }, { status: 200 });
  } catch (err) {
    console.error(" Failed to fetch report data:", err);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
