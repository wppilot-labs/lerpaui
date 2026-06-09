"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { UploadCloud, CheckCircle2, File, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";

export interface FileQueueItem {
  name: string;
  size: string;
  percent: number;
  status: "uploading" | "complete" | "error";
}

export interface FileUploadDropzoneProps {
  className?: string;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({ className }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [queue, setQueue] = useState<FileQueueItem[]>([
    {
      name: "spotlight-mockups.sketch",
      size: "4.8 MB",
      percent: 100,
      status: "complete",
    },
    {
      name: "server-telemetry.log",
      size: "1.2 MB",
      percent: 45,
      status: "uploading",
    },
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const newFile: FileQueueItem = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        percent: 0,
        status: "uploading",
      };
      
      setQueue((prev) => [...prev, newFile]);

      // Simulate incremental upload ticks
      let uploadPercent = 0;
      const interval = setInterval(() => {
        uploadPercent += 10;
        setQueue((prev) =>
          prev.map((item) => {
            if (item.name === file.name) {
              const complete = uploadPercent >= 100;
              return {
                ...item,
                percent: Math.min(uploadPercent, 100),
                status: complete ? "complete" : "uploading",
              };
            }
            return item;
          })
        );
        if (uploadPercent >= 100) clearInterval(interval);
      }, 300);
    }
  };

  const handleRemove = (name: string) => {
    setQueue((prev) => prev.filter((item) => item.name !== name));
  };

  return (
    <div className={cn("w-full max-w-[420px] rounded-3xl border border-border/50 bg-card/45 p-6 backdrop-blur-xl shadow-2xl overflow-hidden select-none flex flex-col gap-5", className)}>
      
      {/* Main Drag-Drop Box Panel area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "h-44 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden select-none",
          isDragActive
            ? "border-primary bg-primary/5 shadow-inner scale-[0.99]"
            : "border-border/60 bg-secondary/10 hover:border-primary/45"
        )}
      >
        <UploadCloud className={cn("w-8 h-8 mb-3 text-muted-foreground", isDragActive && "text-primary animate-pulse")} />
        <span className="text-xs font-bold text-foreground">Drag & drop files here</span>
        <span className="text-[10px] text-muted-foreground mt-1.5 uppercase font-black tracking-wider">
          Sketch, PDF, or LOG up to 10MB
        </span>
      </div>

      {/* Progress queue roster list */}
      {queue.length > 0 && (
        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
          <AnimatePresence>
            {queue.map((item) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-secondary/15 border border-border/30 rounded-xl flex items-center justify-between gap-3 overflow-hidden"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <File className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline text-[10px] font-bold">
                      <span className="text-foreground truncate pr-4">{item.name}</span>
                      <span className="text-muted-foreground shrink-0 font-mono text-[9px]">{item.size}</span>
                    </div>

                    {/* Linear upload indicator progress */}
                    <div className="h-1 bg-border/20 rounded-full w-full overflow-hidden mt-1.5 relative">
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          item.status === "complete" ? "bg-emerald-500" : "bg-primary"
                        )}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 18 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Queue actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {item.status === "complete" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <span className="text-[8px] font-black font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {item.percent}%
                    </span>
                  )}
                  <button
                    onClick={() => handleRemove(item.name)}
                    className="p-1 rounded-md border border-border/40 hover:border-destructive/40 hover:text-destructive transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
