import { Donation } from "@/entities/donation";
import { getEducationRepository } from "@/repositories/donation_repository";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const donationRepo = getEducationRepository();
        const donations: Donation[] = await donationRepo.getAllDonations();

        const now = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 5);

        let totalDonations = 0;
        let lastSixMonthsTotalDonations = 0;

        // Donations Per Month
        const donationsAmtByMonth: {[key:string]: number} = {};
        // Donations Per Year
        const donationsAmtByYear: {[key:number]: number} = {};

        for (const donation of donations) {
            const receivedBy = new Date(donation.receiveDate!);
            if(receivedBy >= sixMonthsAgo && donation.type === 'Cash'){
                const month = receivedBy.getMonth() + 1;
                const year = receivedBy.getFullYear();
                const key = `${year}-${month.toString().padStart(2, "0")}`;
                donationsAmtByMonth[key] = (donationsAmtByMonth[key] || 0) + donation.monetaryValue;
                // totals cash donations made within the last six months
                lastSixMonthsTotalDonations += donation.monetaryValue;
            }
            if(donation.type === 'Cash'){
                // totals cash donations older than 6 months
                totalDonations += donation.monetaryValue;
                
                // Add to yearly totals
                const year = receivedBy.getFullYear();
                donationsAmtByYear[year] = (donationsAmtByYear[year] || 0) + donation.monetaryValue;
            }
        }

        const monthlyStats = Object.entries(donationsAmtByMonth).map(([key, amount]) => {
            const [year, month] = key.split("-");
            return {
                year: parseInt(year),
                month: parseInt(month),
                amtOfDonations: amount,
            };
        });

        // Get yearly stats for past 6 years
        const currentYear = new Date().getFullYear();
        const yearlyStats = [];
        for (let year = currentYear - 5; year <= currentYear; year++) {
            yearlyStats.push({
                year: year,
                amtOfDonations: donationsAmtByYear[year] || 0
            });
        }

        // Calculate cumulative stats
        let runningTotal = 0;
        const cumulativeStats = monthlyStats
            .sort((a, b) => {
                if (a.year !== b.year) return a.year - b.year;
                return a.month - b.month;
            })
            .map(stat => {
                runningTotal += stat.amtOfDonations;
                return {
                    year: stat.year,
                    month: stat.month,
                    cumulativeThisMonth: runningTotal
                };
            });

        return NextResponse.json(
            {
                monthlyStats,
                yearlyStats,
                cumulativeStats,
            },
            {status: 200}
        );
    } catch (err) {
        console.error("Failed to fetch report data:", err);
        return NextResponse.json({error: "Failed to generate report"}, {status: 500});
    }
}
