"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarChart from "./charts/BarChart";
import LineChart from "./charts/LineChart";

interface DonationsReportsProps {
  className?: string;
}

export default function DonationsReports({ className }: DonationsReportsProps) {
  // Sample data - replace with actual data from your API
  const donationTrendsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Donations (₱)",
        data: [25000, 32000, 28000, 35000, 42000, 38000],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const topDonorsData = {
    labels: [
      "John Doe",
      "Jane Smith",
      "Tech Corp",
      "Alumni Assoc.",
      "Anonymous",
    ],
    datasets: [
      {
        label: "Donation Amount (₱)",
        data: [100000, 75000, 50000, 45000, 30000],
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
    ],
  };

  const cumulativeDonationsData = {
    labels: ["2019", "2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "Cumulative Donations (₱)",
        data: [150000, 430000, 750000, 1200000, 1580000],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className={className}>
      <div className="grid gap-6 md:grid-cols-2">
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
            <CardTitle>Top Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart title="Top Donors by Amount" data={topDonorsData} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
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
