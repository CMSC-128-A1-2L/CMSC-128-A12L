"use client";

import { useState, useEffect } from "react";
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
  const [isDownloading, setIsDownloading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsDownloading(true);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsDownloading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
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
                Preparing your report for download...
              </p>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-sm text-muted-foreground">
                Report downloaded successfully!
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
