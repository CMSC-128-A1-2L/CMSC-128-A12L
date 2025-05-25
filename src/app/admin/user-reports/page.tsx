"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  Filter,
  Search,
  Check,
  X,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { ReportCategory, ReportStatus } from "@/entities/report";

interface Report {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  adminResponse?: string;
  attachmentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function UserReportsManagementPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "all">("all");
  const [filterCategory, setFilterCategory] = useState<ReportCategory | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Response dialog states
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/admin/reports");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setReports(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch reports");
    } finally {
      setIsLoading(false);
    }
  };
  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add CSRF protection header if needed
        },
        body: JSON.stringify({ 
          status: newStatus,
          adminResponse: newStatus === ReportStatus.REJECTED ? "Report rejected by admin" : undefined 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setReports(reports.map(report => 
        report._id === reportId ? { ...report, status: newStatus } : report
      ));
      
      toast.success("Status updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };
  const handleSubmitResponse = async () => {
    if (!selectedReport || !adminResponse) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/reports/${selectedReport._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminResponse,
          status: ReportStatus.RESOLVED,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setReports(reports.map(report => 
        report._id === selectedReport._id 
          ? { ...report, adminResponse, status: ReportStatus.RESOLVED }
          : report
      ));

      setSelectedReport(null);
      setAdminResponse("");
      toast.success("Response submitted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit response");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReports = reports
    .filter(report => 
      filterStatus === "all" || report.status === filterStatus
    )
    .filter(report =>
      filterCategory === "all" || report.category === filterCategory  
    )
    .filter(report =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case ReportStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case ReportStatus.RESOLVED:
        return "bg-green-100 text-green-800";
      case ReportStatus.REJECTED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Manage User Reports</h1>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
            <Select 
            value={filterStatus} 
            onValueChange={(value: string) => setFilterStatus(value as ReportStatus | "all")}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.values(ReportStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={filterCategory} 
            onValueChange={(value: string) => setFilterCategory(value as ReportCategory | "all")}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.values(ReportCategory).map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-64"
          >
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </motion.div>
        ) : filteredReports.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No reports found</p>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6"
          >
            {filteredReports.map((report) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                layout
                className="bg-white shadow-sm rounded-lg p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {report.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>
                        {report.category.charAt(0).toUpperCase() +
                          report.category.slice(1).replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{report.description}</p>

                {report.attachmentUrl && (
                  <a
                    href={report.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block"
                  >
                    View Attachment
                  </a>
                )}

                {report.adminResponse && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      Admin Response:
                    </div>
                    <p className="text-gray-600">{report.adminResponse}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {report.status === ReportStatus.PENDING && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleStatusChange(report._id, ReportStatus.IN_PROGRESS)
                        }
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        Mark In Progress
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleStatusChange(report._id, ReportStatus.REJECTED)
                        }
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}

                  {report.status === ReportStatus.IN_PROGRESS && (
                    <Button
                      onClick={() => {
                        setSelectedReport(report);
                        setAdminResponse(report.adminResponse || "");
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Respond & Resolve
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog
        open={!!selectedReport}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedReport(null);
            setAdminResponse("");
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Respond to Report</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Enter your response..."
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              className="h-32"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitResponse}
              disabled={isSubmitting || !adminResponse}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Response
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
