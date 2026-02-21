'use client';

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { EditorPanel } from '@/components/editor-panel';
import { OutputPanel } from '@/components/output-panel';
import { MetricsCard } from '@/components/metrics-card';
import { EditorToolbar } from '@/components/editor-toolbar';
import { VersionHistoryPanel } from '@/components/version-history-panel';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EditorPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showVersions, setShowVersions] = useState(false);

  useEffect(() => {
    // Animate entrance of the editor container
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col h-[calc(100vh-4rem)] bg-background relative overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-border">
        <EditorToolbar onToggleVersions={() => setShowVersions(!showVersions)} />
      </div>

      {/* Main Editor Layout */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="w-full h-full">
          {/* Left Panel - Editor or Versions */}
          <ResizablePanel defaultSize={50} minSize={30} className="overflow-hidden">
            <div className="h-full p-4 flex flex-col">
              {showVersions ? (
                <>
                  <h2 className="text-sm font-semibold text-foreground mb-3">Version Control</h2>
                  <VersionHistoryPanel />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-foreground">Prompt Editor</h2>
                    <span className="text-xs text-muted-foreground">Write your intent here...</span>
                  </div>
                  <EditorPanel />
                </>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel - Output & Metrics */}
          <ResizablePanel defaultSize={50} minSize={30} className="overflow-hidden">
            <div className="h-full p-4 flex flex-col gap-4">
              {/* Output Panel */}
              <div className="flex-1 min-h-0">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground">Output</h2>
                </div>
                <OutputPanel />
              </div>

              {/* Metrics Card */}
              <MetricsCard />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
