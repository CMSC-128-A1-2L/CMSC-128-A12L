"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LineChart from "./charts/LineChart";

interface Donation {
  id: string;
  amount: number;
  date: string;
  donorID: string;
}

interface MonthlyStat {
  year: number;
  month: number;
  amtOfDonations: number;
}

interface YearlyStat {
  year: number;
  amtOfDonations: number;
}

interface CumulativeStat {
  year: number;
  month: number;
  cumulativeThisMonth: number;
}

interface DonationsReportsProps {
  className?: string;
}

export default function DonationsReports({ className }: DonationsReportsProps) {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [yearlyStats, setYearlyStats] = useState<YearlyStat[]>([]);
  const [cumulativeStats, setCumulativeStats] = useState<CumulativeStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('/api/admin/reports/donations');
        if (!response.ok) {
          throw new Error('Failed to fetch donations');
        }
        const data = await response.json();
        setMonthlyStats(data.monthlyStats);
        setYearlyStats(data.yearlyStats);
        setCumulativeStats(data.cumulativeStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Process donations for monthly trends
  const processMonthlyData = () => {
    // Get the current date
    const currentDate = new Date();
    
    // Create an array of the last 6 months
    const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        amtOfDonations: 0
      };
    }).reverse();

    // Fill in the actual donation amounts where they exist
    monthlyStats.forEach(stat => {
      const monthIndex = lastSixMonths.findIndex(
        m => m.year === stat.year && m.month === stat.month
      );
      if (monthIndex !== -1) {
        lastSixMonths[monthIndex].amtOfDonations = stat.amtOfDonations;
      }
    });

    const labels = lastSixMonths.map(stat => {
      const date = new Date(stat.year, stat.month - 1);
      return date.toLocaleString('default', { month: 'short' });
    });
    
    const data = lastSixMonths.map(stat => stat.amtOfDonations);

    return {
      labels,
      datasets: [{
        label: "Monthly Donations (₱)",
        data,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      }]
    };
  };

  // Process donations for cumulative data
  const processCumulativeData = () => {
    const labels = yearlyStats.map(stat => stat.year.toString());
    const data = yearlyStats.map(stat => stat.amtOfDonations);

    return {
      labels,
      datasets: [{
        label: "Cumulative Donations (₱)",
        data,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
      }]
    };
  };

  if (isLoading) {
    return <div className={className}>Loading donation data...</div>;
  }

  if (error) {
    return <div className={className}>Error: {error}</div>;
  }

  const donationTrendsData = processMonthlyData();
  const cumulativeDonationsData = processCumulativeData();

  return (
    <div className={className}>
      <div className="grid gap-6 md:grid-cols-2 text-black">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Donation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart title="Monthly Trends" data={donationTrendsData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cumulative Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              title="Cumulative Growth"
              data={cumulativeDonationsData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
