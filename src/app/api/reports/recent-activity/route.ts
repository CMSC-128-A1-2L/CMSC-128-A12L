/**
 * 
 * api/reports/recent-activity/route.ts
 * 
 * DESCRIPTION:
 * 
 * 1. Classifier: 1 if events, 2 if users, or 3 if opportunities (for frontend labeling purposes)
 * 2. Heading: string 
 * 3. Message: string
 * 
 * action = "POST /api/admin/opportunities"
 * Heading = "New Job Posting"
 * Message = "'[name field ()]' posted a new job opportunity."
 * 
 * action = "POST /api/admin/events"
 * Heading = "New Event Posting"
 * Message = "'[name field ()]' posted a new event"
 * 
 * action = "POST /api/admin/users"
 * Heading = "New Job Posting"
 * Message = "A new user has signed up."
 *
 *  action = "PUT/api/admin/opportunities/[id]" 
 * Heading = "Job Posting Edit" 
 * Message = "'[name field ()]' has edited '[job.title]''s job details."

 * action = "PUT/api/admin/users/[id]" 
 * Heading = "User Profile Edit" 
 * Message = "'[name field ()]' has edited '[user.name]' 's userdetails."

 * action = "PUT/api/admin/events/[id]" 
 * Heading = "User Profile Edit" 
 * Message = "'[name field ()]' has edited '[events.name]' 's userdetails."
 */

 // api/reports/recent-activity/route.ts
// api/reports/recent-activity/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getLogRepository } from "@/repositories/log_repository";
import { getOpportunityRepository } from "@/repositories/opportunity_repository";
import { getEventRepository } from "@/repositories/event_repository";
import { getUserRepository } from "@/repositories/user_repository";

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // in seconds

  if (diff < 60) return "Just now";
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export async function GET(request: NextRequest) {
  try {
    const logRepository = getLogRepository();
    const opportunityRepository = getOpportunityRepository();
    const eventRepository = getEventRepository();
    const userRepository = getUserRepository();

    const allLogs = await logRepository.getAllLogs();

    const validMethods = ["POST", "PUT"];
    const validActionPattern = /^\/api\/admin\/(events|users|opportunities)(\/.*)?$/;

    const validLogs = allLogs
      .filter((log) => {
        const method = log.status?.toUpperCase();
        const path = log.action?.split(" ")[1];
        return validMethods.includes(method) && validActionPattern.test(path);
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const response = [];

    for (const [index, log] of validLogs.entries()) {
      if (response.length >= 10) break;

      const action = log.action;
      const method = log.status;
      const path = action?.split(" ")[1] || "";
      const segments = path.split("/");

      let classifier = 0;
      let heading = "";
      let message = "";

      const hasId = segments.length === 5;
      const type = segments[3];
      const id = hasId ? segments[4] : null;

      if (type === "events") {
        classifier = 1;
        if (method === "POST") {
          heading = "New Event Posting";
          message = `'${log.name}' posted a new event`;
        } else if (method === "PUT" && id) {
          const event = await eventRepository.getEventById(id);
          const eventName = event?.name || "an event";
          heading = "Event Edit";
          message = `'${log.name}' has edited '${eventName}'s event details.`;
        }
      } else if (type === "users") {
        classifier = 2;
        if (method === "POST") {
          heading = "New User Signup";
          message = "A new user has signed up.";
        } else if (method === "PUT" && id) {
          const user = await userRepository.getUserById(id);
          const userName = user?.name || "a user";
          heading = "User Profile Edit";
          message = `'${log.name}' has edited '${userName}'s user details.`;
        }
      } else if (type === "opportunities") {
        classifier = 3;
        if (method === "POST") {
          heading = "New Job Posting";
          message = `'${log.name}' posted a new job opportunity.`;
        } else if (method === "PUT" && id) {
          const opportunity = await opportunityRepository.getOpportunityById(id);
          const title = opportunity?.title || "a job opportunity";
          heading = "Job Posting Edit";
          message = `'${log.name}' has edited '${title}'s job details.`;
        }
      }

      if (heading && message) {
        const logTimestamp = new Date(log.timestamp);
        response.push({
          id: response.length + 1, // 1 = newest, 10 = oldest
          classifier,
          heading,
          message,
          timestamp: getRelativeTime(logTimestamp),
        });
      }
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch recent activity logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activity logs" },
      { status: 500 }
    );
  }
}

