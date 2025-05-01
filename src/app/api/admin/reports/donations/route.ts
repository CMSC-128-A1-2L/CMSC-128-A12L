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
                lastSixMonthsTotalDonations = lastSixMonthsTotalDonations + donation.monetaryValue;
            }
            if(donation.type === 'Cash'){
                // totals cash donations older than 6 months
                totalDonations = totalDonations + donation.monetaryValue;
                
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

        // Add both for computation of cumulatitve later
        let superTotalDonations = totalDonations + lastSixMonthsTotalDonations;

        const cumulativeDonations: {[key:string]: number} = {};
        const monthGroups = Object.keys(donationsAmtByMonth);
        for(const month in monthGroups){
            const donationInMonth = donationsAmtByMonth[month];
            // subtract that month's donation from the sixMonthsTotal to get cumulative by that month
            const monthTotal = superTotalDonations - lastSixMonthsTotalDonations - donationInMonth;
            const key = month;
            cumulativeDonations[key] = monthTotal;
        }

        // Cumulative Donations by the month
        const cumulativeStats = Object.entries(cumulativeDonations).map(([key, amount]) => {
            const [year, month] = key.split("-");
            return {
                year: parseInt(year),
                month: parseInt(month),
                cumulativeThisMonth: amount,
            }
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
