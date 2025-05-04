"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { CheckCircle2 } from "lucide-react";
import "react-circular-progressbar/dist/styles.css";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      setIsDownloading(true);
      setProgress(0);
      setDownloaded(false);
      setError(null);

      // Simulate progress updates
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) {
            return prev + 10;
          }
          return prev;
        });
      }, 500);

      const generatePDF = async () => {
        try {
          const response = await fetch('/api/puppeteer');
          if (!response.ok) throw new Error('Failed to generate PDF');
          
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'admin-reports.pdf';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          setProgress(100);
          setDownloaded(true);
          setIsDownloading(false);
        } catch (err) {
          console.error('Error generating PDF:', err);
          setError('Failed to generate PDF report');
          setIsDownloading(false);
        } finally {
          if (progressInterval.current) clearInterval(progressInterval.current as NodeJS.Timeout);
        }
      };

      generatePDF();
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current as NodeJS.Timeout);
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exporting Report</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4 text-black">
          {isDownloading ? (
            <>
              <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar
                  value={progress}
                  text={`${progress}%`}
                  styles={buildStyles({
                    pathColor: `rgba(62, 152, 199, ${progress / 100})`,
                    textColor: "#000",
                    trailColor: "#d6d6d6",
                    textSize: "16px",
                  })}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {progress < 100 ? "Preparing your report for download..." : "Finalizing download..."}
              </p>
            </>
          ) : downloaded ? (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-sm text-muted-foreground">
                Report downloaded successfully!
              </p>
            </>
          ) : error ? (
            <>
              <p className="text-sm text-red-500">{error}</p>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
