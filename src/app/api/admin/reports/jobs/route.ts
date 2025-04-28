import { NextResponse } from "next/server";
import { getOpportunityRepository } from "@/repositories/opportunity_repository";
import { Opportunity } from "@/entities/opportunity";
import { getLogRepository } from "@/repositories/log_repository";
import { Logs } from "@/entities/logs";

export async function GET(){
    try{
        const logRepository = getLogRepository();
        const logs: Logs[] = await logRepository.getAllLogs();
        const opportunityRepository = getOpportunityRepository();
        const opportunities: Opportunity[] = await opportunityRepository.getAllOpportunities();

        // Monthly Job Postings
        const now = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 5);

        const jobPostsPerMonth: {[key: string]: number} = {};
        for (const log of logs) {
            const timestamp = new Date(log.timestamp);
            if(timestamp >= sixMonthsAgo && (log.action === "POST /api/admin/opportunities" || log.action === "POST /api/alumni/jobs" )){
                const month = timestamp.getMonth() + 1;
                const year = timestamp.getFullYear();
                const key = `${year}-${month.toString().padStart(2,"0")}`;
                jobPostsPerMonth[key] = (jobPostsPerMonth[key] || 0) + 1;
            }
        }

        const monthlyJobPostings = Object.entries(jobPostsPerMonth).map(([key, count]) => {
            const [year, month] = key.split("-");
            return {
                year: parseInt(year),
                month: parseInt(month),
                numOfJobPostings: count,
            }
        })

        // Job Listings
       const jobListings = Object.entries(opportunities).map(([idx, job]) => {
            return {
                title: job.title,
                company: job.company,
                location: job.location,
                type: job.workMode
            }
       })

        return NextResponse.json(
            {
                monthlyJobPostings,
                jobListings
            },
            {status: 200}
        )


    }catch(error){
        console.error("Failed to fetch report data: ", error);
        return NextResponse.json({error: "Failed to generate report."}, {status: 500});
    }
}