"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import BarChart from "./components/charts/BarChart";
import PieChart from "./components/charts/PieChart";
import LineChart from "./components/charts/LineChart";
import Image from "next/image";

// Types
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

interface JobListing {
  title: string;
  company: string;
  location: string;
  type: string;
}

interface MonthlyJobPosting {
  year: number;
  month: number;
  numOfJobPostings: number;
}

interface AlumniPerGradYear {
  year: string;
  numOfAlumniPerGradYear: number;
}

interface DistributionByField {
  field: string;
  numOfAlumniInField: number;
}

interface MonthlyActiveAlumni {
  year: number;
  month: number;
  numOfActiveAlumni: number;
}

export default function ReportsPage() {
  // Donations State
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [yearlyStats, setYearlyStats] = useState<YearlyStat[]>([]);
  const [cumulativeStats, setCumulativeStats] = useState<CumulativeStat[]>([]);
  const [isDonationsLoading, setIsDonationsLoading] = useState(true);
  const [donationsError, setDonationsError] = useState<string | null>(null);

  // Events State
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [eventsPerMonthData, setEventsPerMonthData] = useState<any>(null);
  const [rsvpDataByEvent, setRsvpDataByEvent] = useState<Record<string, any>>({});

  // Jobs State
  const [searchTerm, setSearchTerm] = useState("");
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [monthlyJobPostings, setMonthlyJobPostings] = useState<MonthlyJobPosting[]>([]);

  // Alumni State
  const [alumniPerYear, setAlumniPerYear] = useState<AlumniPerGradYear[]>([]);
  const [distributionByField, setDistributionByField] = useState<DistributionByField[]>([]);
  const [monthlyActiveAlumni, setMonthlyActiveAlumni] = useState<MonthlyActiveAlumni[]>([]);

  // Add this new state for the dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    numberOfAlumni: 0,
    numberOfNewUsers: 0,
    numberOfUpcomingEvents: 0,
    numberOfOpportunities: 0,
  });

  // Fetch Donations Data
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('/api/reports/donations');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        const data = await response.json();
        setMonthlyStats(data.monthlyStats);
        setYearlyStats(data.yearlyStats);
        setCumulativeStats(data.cumulativeStats);
      } catch (err) {
        setDonationsError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsDonationsLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Fetch Events Data
  useEffect(() => {
    async function fetchEventsData() {
      try {
        const res = await fetch("/api/reports/events");
        const data = await res.json();

        const fetchedEvents = data.rsvpStats.map((event: any, index: number) => ({
          id: index.toString(),
          name: event.name,
        }));
        setEvents(fetchedEvents);

        if (fetchedEvents.length > 0) {
          setSelectedEvent(fetchedEvents[0].id);
        }

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

    fetchEventsData();
  }, []);

  // Fetch Jobs Data
  useEffect(() => {
    async function fetchJobsData() {
      try {
        const res = await fetch("/api/reports/jobs");
        const data = await res.json();

        setJobListings(data.jobListings || []);
        setMonthlyJobPostings(data.monthlyJobPostings || []);
      } catch (error) {
        console.error("Failed to fetch jobs report data", error);
      }
    }

    fetchJobsData();
  }, []);

  // Fetch Alumni Data
  useEffect(() => {
    async function fetchAlumniData() {
      try {
        const res = await fetch("/api/reports/alumni");
        const data = await res.json();

        setAlumniPerYear(data.alumniPerGraduationYear || []);
        setDistributionByField(data.distributionByField || []);
        setMonthlyActiveAlumni(data.monthlyActiveAlumni || []);
      } catch (error) {
        console.error("Failed to fetch alumni report data", error);
      }
    }

    fetchAlumniData();
  }, []);

  // Add this new useEffect to fetch dashboard stats
  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const res = await fetch('/api/reports/admin-dashboard');
        if (!res.ok) throw new Error("Failed to fetch dashboard stats");
        const data = await res.json();
        setDashboardStats(data);
      } catch (error) {
        console.error("Dashboard stats fetch error:", error);
      }
    }

    fetchDashboardStats();
  }, []);

  // Process Donations Data
  const processMonthlyData = () => {
    const currentDate = new Date();
    const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        amtOfDonations: 0
      };
    }).reverse();

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

  const processCumulativeData = () => {
    const labels = yearlyStats?.map(stat => stat.year.toString()) || [];
    const data = yearlyStats?.map(stat => stat.amtOfDonations) || [];

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

  // Process Jobs Data
  const filteredJobs = jobListings.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const currentDate = new Date();
  const last6Months = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    last6Months.push({ year: date.getFullYear(), month: date.getMonth() + 1 });
  }

  const monthLabels = last6Months.map(
    (date) => months[date.month - 1]
  );

  const jobPostingsData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Number of Job Postings",
        data: last6Months.map((date) => {
          const matching = monthlyJobPostings.find(
            (item) => item.year === date.year && item.month === date.month
          );
          return matching ? matching.numOfJobPostings : 0;
        }),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  // Process Alumni Data
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const alumniByYearData = {
    labels: alumniPerYear.map((item) => item.year),
    datasets: [
      {
        label: "Number of Alumni",
        data: alumniPerYear.map((item) => item.numOfAlumniPerGradYear),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const alumniByFieldData = {
    labels: distributionByField.map((item) => item.field),
    datasets: [
      {
        data: distributionByField.map((item) => item.numOfAlumniInField),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(199, 199, 199, 0.5)",
          "rgba(83, 102, 255, 0.5)",
        ],
      },
    ],
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const sortedMonthlyActiveAlumni = [...monthlyActiveAlumni]
    .filter((item) => {
      return (
        item.year < currentYear ||
        (item.year === currentYear && item.month <= currentMonth)
      );
    })
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.month - b.month;
    });

  const monthlyActiveData = {
    labels: sortedMonthlyActiveAlumni.map(
      (item) => `${monthNames[item.month - 1]} ${item.year}`
    ),
    datasets: [
      {
        label: "Active Alumni",
        data: sortedMonthlyActiveAlumni.map((item) => item.numOfActiveAlumni),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const rsvpStatusData = selectedEvent ? rsvpDataByEvent[selectedEvent] : null;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex items-center gap-4 mb-8">
        <Image
          src="/logo_ares.png"
          alt="Aegis Logo"
          width={50}
          height={50}
          className="object-contain"
        />
        <h1 className="text-3xl font-bold text-black">System Statistics</h1>
      </div>
      
      <div className="container mx-auto p-6 space-y-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8 text-black">Reports Dashboard</h1>

        {/* Add the cards in a 2x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-black">Total Alumni</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{dashboardStats.numberOfAlumni}</div>
              <p className="text-sm text-black mt-2">
                Total number of registered alumni in the system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{dashboardStats.numberOfOpportunities}</div>
              <p className="text-sm text-black mt-2">
                Current number of active job opportunities posted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{dashboardStats.numberOfUpcomingEvents}</div>
              <p className="text-sm text-black mt-2">
                Number of scheduled events in the near future
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">New Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{dashboardStats.numberOfNewUsers}</div>
              <p className="text-sm text-black mt-2">
                Number of recently registered users 
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Donations Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-black">Donations</h2>
          {isDonationsLoading ? (
            <div className="text-black">Loading donation data...</div>
          ) : donationsError ? (
            <div className="text-black">Error: {donationsError}</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 text-black">
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">Monthly Donation Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart title="Monthly Trends" data={processMonthlyData()} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-black">Cumulative Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart title="Cumulative Growth" data={processCumulativeData()} />
                </CardContent>
              </Card>
            </div>
          )}
        </section>

        {/* Events Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-black">Events</h2>
          <div className="grid gap-6 md:grid-cols-2 text-black">
            <Card>
              <CardHeader>
                <CardTitle className="text-black">Events per Month</CardTitle>
              </CardHeader>
              <CardContent>
                {eventsPerMonthData && (
                  <BarChart title="Monthly Events" data={eventsPerMonthData} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-black">RSVP Status Distribution</CardTitle>
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
        </section>

        {/* Jobs Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-black">Jobs</h2>
          <div className="grid gap-6 text-black">
            <Card>
              <CardHeader>
                <CardTitle className="text-black">Monthly Job Postings</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart title="Job Postings per Month" data={jobPostingsData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-black">Job Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search by job title or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm text-black"
                  />
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-black">Title</TableHead>
                        <TableHead className="text-black">Company</TableHead>
                        <TableHead className="text-black">Location</TableHead>
                        <TableHead className="text-black">Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJobs.map((job, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-black">{job.title}</TableCell>
                          <TableCell className="text-black">{job.company}</TableCell>
                          <TableCell className="text-black">{job.location}</TableCell>
                          <TableCell className="text-black">{job.type}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Alumni Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-black">Alumni</h2>
          <div className="grid gap-6 md:grid-cols-2 text-black">
            <Card>
              <CardHeader>
                <CardTitle className="text-black">Alumni per Graduation Year</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart title="Alumni by Year" data={alumniByYearData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-black">Distribution by Field</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart title="Alumni by Field" data={alumniByFieldData} />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-black">Monthly Active Alumni</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart title="Engagement Trends" data={monthlyActiveData} />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
