"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { FileCode, Terminal as TerminalIcon, Folder, ChevronRight, ChevronDown, Play, Copy, Check } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface PreviewFile {
  name: string;
  code: string;
  language: string;
}

export interface AICodePreviewPanelProps {
  /** Array of files to display */
  files: PreviewFile[];
  /** Optional container class name */
  className?: string;
  /** Title of the IDE, default "Lerpa UI Studio" */
  title?: string;
  /** Auto run simulation logs on mount, default false */
  autoRun?: boolean;
}

export const AICodePreviewPanel: React.FC<AICodePreviewPanelProps> = ({
  files,
  className,
  title = "Lerpa UI Studio",
  autoRun = false,
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const consoleBottomRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const activeFile = files[activeFileIndex] || files[0] || { name: 'index.ts', code: '// No files loaded', language: 'typescript' };

  // Sync scroll on new console logs
  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  // Copy action
  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run script simulator
  const handleRun = () => {
    if (isRunning) return;
    setIsConsoleOpen(true);
    setIsRunning(true);
    setConsoleLogs([]);

    const messages = [
      `$ pnpm run dev --file=${activeFile.name}`,
      `> @lerpa/studio:dev - Booting runtime engine...`,
      `[info]  Detected runtime: Node.js v20.11.0`,
      `[info]  Parsing workspace components...`,
      `[info]  Compiling file: ${activeFile.name} (Lang: ${activeFile.language})`,
      `[vite]  Optimizing dependencies: react, framer-motion, lucide-react...`,
      `[vite]  ✓ 12 dependencies bundled successfully in 241ms`,
      `[render] Mounting premium React fiber node...`,
      `[render] WebGL shader compilation active (100% complete)`,
      `[success] Live reload server listening on http://localhost:5173/`,
      `[console.log] Hello, Lerpa UI! Code block loaded successfully! ⚡`,
      `[system] Compilation successful. Zero warnings. Output size: ${(activeFile.code.length / 1024).toFixed(2)} KB`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < messages.length) {
        setConsoleLogs((prev) => [...prev, messages[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 450);
  };

  useEffect(() => {
    if (autoRun) {
      const delay = setTimeout(() => {
        handleRun();
      }, 1000);
      return () => clearTimeout(delay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run once on autoRun toggle, handleRun captures fresh closure
  }, [autoRun]);

  return (
    <div className={cn(
      "w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-300 font-sans shadow-2xl overflow-hidden flex flex-col h-[520px]",
      className
    )}>
      {/* Top Header Window Bar */}
      <div className="h-12 border-b border-zinc-900 bg-zinc-900/60 flex items-center justify-between px-4 select-none shrink-0 z-10">
        
        {/* Mac OS Window Controls */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dfa123] cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer" />
          
          <span className="ml-4 text-xs font-medium text-zinc-500 hidden sm:inline-block">
            {title}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Active File Label */}
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-md font-mono hidden md:inline-block border border-zinc-700/50">
            {activeFile.name}
          </span>

          {/* Run Command Button */}
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-50",
              isRunning
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse"
                : "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-700"
            )}
          >
            <Play className={cn("w-3.5 h-3.5 fill-current", isRunning && "animate-spin")} />
            {isRunning ? "Running..." : "Run Code"}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all border border-zinc-700/50 active:scale-95"
            title="Copy Code"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Copy className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        
        {/* Workspace Sidebar Browser */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              initial={prefersReducedMotion ? false : { width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              exit={prefersReducedMotion ? { width: 0, opacity: 0 } : { width: 0, opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
              className="border-r border-zinc-900 bg-zinc-950/70 h-full hidden sm:flex flex-col shrink-0 overflow-y-auto select-none"
            >
              <div className="p-3 text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between border-b border-zinc-900">
                <span>Workspace</span>
                <Folder className="w-3.5 h-3.5 text-zinc-500" />
              </div>

              {/* Folders and Files List */}
              <div className="p-2 space-y-3">
                <div>
                  <div className="flex items-center gap-1 text-xs text-zinc-400 font-semibold mb-1 px-1.5">
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>components</span>
                  </div>

                  <div className="pl-3.5 space-y-1">
                    {files.map((file, idx) => (
                      <button
                        type="button"
                        key={file.name}
                        onClick={() => setActiveFileIndex(idx)}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-mono text-left transition-all",
                          idx === activeFileIndex 
                            ? "bg-zinc-800/80 text-white font-medium border-l-2 border-emerald-500" 
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                        )}
                      >
                        <FileCode className={cn(
                          "w-3.5 h-3.5 shrink-0", 
                          idx === activeFileIndex ? "text-emerald-400" : "text-zinc-500"
                        )} />
                        <span className="truncate">{file.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="opacity-45">
                  <div className="flex items-center gap-1 text-xs text-zinc-500 font-semibold mb-1 px-1.5">
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <span>styles</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500 font-semibold mb-1 px-1.5">
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <span>tests</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-zinc-950/40 relative">
          
          {/* Tabs bar */}
          <div className="h-10 border-b border-zinc-900 bg-zinc-900/30 flex items-center px-2 select-none overflow-x-auto shrink-0 scrollbar-none z-10">
            {/* Sidebar toggle */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 mr-2 border border-zinc-800 transition-all cursor-pointer"
              title="Toggle Sidebar"
            >
              <Folder className="w-3.5 h-3.5" />
            </button>

            {files.map((file, idx) => (
              <button
                type="button"
                key={`tab-${file.name}`}
                onClick={() => setActiveFileIndex(idx)}
                className="relative px-3 py-1.5 text-xs font-mono transition-colors focus:outline-none shrink-0"
              >
                <span className={cn(
                  "relative z-10 flex items-center gap-1.5",
                  idx === activeFileIndex ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                )}>
                  <FileCode className={cn("w-3.5 h-3.5", idx === activeFileIndex ? "text-emerald-400" : "text-zinc-500")} />
                  {file.name}
                </span>
                
                {idx === activeFileIndex && (
                  <motion.div
                    layoutId="activeTab"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    className="absolute inset-0 bg-zinc-900 border border-zinc-800/80 rounded-t-lg z-0 bottom-[-1px] border-b-zinc-950"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed selection:bg-emerald-500/20 scrollbar-thin">
            <div className="flex select-text">
              {/* Line Numbers */}
              <div className="text-zinc-600 text-right select-none pr-4 border-r border-zinc-900 text-xxs flex flex-col leading-[1.6rem] min-w-[24px]">
                {activeFile.code.split('\n').map((_, index) => (
                  <span key={index}>{index + 1}</span>
                ))}
              </div>
              {/* Syntax Highlighting Mock Content */}
              <pre className="pl-4 flex-1 text-zinc-300 overflow-x-auto select-text leading-[1.6rem] whitespace-pre font-mono">
                <code>
                  {activeFile.code}
                </code>
              </pre>
            </div>
          </div>

          {/* Console Toggle Bar (Sticks above collapsible console) */}
          <div 
            role="button" 
            tabIndex={0} 
            onClick={() => setIsConsoleOpen(!isConsoleOpen)} 
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsConsoleOpen(!isConsoleOpen); } }}
            className="h-8 border-t border-zinc-900 bg-zinc-900 px-4 flex items-center justify-between text-[11px] text-zinc-400 font-semibold cursor-pointer select-none hover:bg-zinc-800/50 hover:text-zinc-200 transition-all shrink-0 z-10"
          >
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-3.5 h-3.5 text-zinc-500" />
              <span>TERMINAL CONSOLE</span>
              {isRunning && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">Ctrl + `</span>
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", !isConsoleOpen && "rotate-180")} />
            </div>
          </div>

          {/* Collapsible Slide-up Console Panel */}
          <AnimatePresence>
            {isConsoleOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 160 }}
                exit={{ height: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className="bg-zinc-950 border-t border-zinc-900 overflow-y-auto px-4 py-2 shrink-0 font-mono text-xxs leading-relaxed scrollbar-thin select-text"
              >
                {consoleLogs.length === 0 ? (
                  <div className="text-zinc-500 italic h-full flex items-center justify-center select-none">
                    Console idle. Click &quot;Run Code&quot; above to execute compiling simulation.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {consoleLogs.map((log, idx) => {
                      let colorClass = "text-zinc-400";
                      if (log.startsWith("$")) colorClass = "text-indigo-400 font-bold";
                      else if (log.includes("[success]")) colorClass = "text-emerald-400 font-semibold";
                      else if (log.includes("[error]")) colorClass = "text-rose-400 font-semibold";
                      else if (log.includes("[vite]")) colorClass = "text-cyan-400";
                      else if (log.includes("[render]")) colorClass = "text-fuchsia-400";
                      
                      return (
                        <div key={idx} className={cn("whitespace-pre-wrap select-text", colorClass)}>
                          {log}
                        </div>
                      );
                    })}
                    <div ref={consoleBottomRef} />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};
