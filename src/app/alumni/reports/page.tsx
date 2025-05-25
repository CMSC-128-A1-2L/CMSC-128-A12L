"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, AlertCircle, Loader2, FileText, MessageCircle, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  createdAt: string;
  updatedAt: string;
}

export default function ReportsPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "all">("all");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ReportCategory>(ReportCategory.OTHER);
  const [attachmentUrl, setAttachmentUrl] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setReports(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch reports");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          attachmentUrl,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success("Report submitted successfully");

      // Re-fetch reports instead of directly modifying the state
      fetchReports();

      // Reset form
      setTitle("");
      setDescription("");
      setCategory(ReportCategory.OTHER);
      setAttachmentUrl("");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReports = reports.filter(report =>
    filterStatus === "all" || report.status === filterStatus
  );

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.PENDING:
        return "bg-yellow-500/20 text-yellow-400";
      case ReportStatus.IN_PROGRESS:
        return "bg-blue-500/20 text-blue-400";
      case ReportStatus.RESOLVED:
        return "bg-green-500/20 text-green-400";
      case ReportStatus.REJECTED:
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-[85vh] container mx-auto p-6 max-w-6xl pb-20">
      <div className="relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Reports</h1>
            <p className="text-gray-400">Track and manage your submitted reports</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Select
              value={filterStatus}
              onValueChange={(value: string) => setFilterStatus(value as ReportStatus | "all")}
            >
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-gray-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="all" className="text-gray-200">All Status</SelectItem>
                {Object.values(ReportStatus).map((status) => (
                  <SelectItem key={status} value={status} className="text-gray-200">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Report
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900/95 backdrop-blur-lg border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-white">Submit a New Report</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Provide details about your issue or suggestion
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/5 border-white/10 text-gray-200 placeholder:text-gray-500"
                  />
                  <Select
                    value={category}
                    onValueChange={(value) => setCategory(value as ReportCategory)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-gray-200">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/10">
                      {Object.values(ReportCategory).map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-gray-200">
                          {cat.charAt(0).toUpperCase() + cat.slice(1).replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-32 bg-white/5 border-white/10 text-gray-200 placeholder:text-gray-500"
                  />
                  <Input
                    placeholder="Attachment URL (optional)"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    className="bg-white/5 border-white/10 text-gray-200 placeholder:text-gray-500"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Submit Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
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
              <p className="text-gray-400">No reports found</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredReports.map((report) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-lg overflow-hidden transition-all">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status?.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </div>

                      <p className="text-gray-300 mb-4 line-clamp-3">{report.description}</p>

                      {report.adminResponse && (
                        <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10">
                          <div className="text-sm font-medium text-gray-200 mb-1">
                            Admin Response:
                          </div>
                          <p className="text-gray-300 text-sm">{report.adminResponse}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <FileText className="w-4 h-4" />
                        <span>
                          {report.category
                            ? `${report.category.charAt(0).toUpperCase()}${report.category
                                .slice(1)
                                .replace("_", " ")}`
                            : "Uncategorized"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        {report.adminResponse && (
                          <div className="flex items-center text-blue-400">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            <span>Has Response</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
