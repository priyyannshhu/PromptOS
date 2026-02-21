'use client';

import { useCompiler, PromptVersion } from '@/context/compiler-context';
import { GlassCard } from '@/components/glass-card';
import { AnimatedButton } from '@/components/animated-button';
import { Trash2, Download, Clock } from 'lucide-react';
import { useCallback, useState, useEffect, memo } from 'react';

export const VersionHistoryPanel = memo(function VersionHistoryPanel() {
  const { versions, setVersions, setCode, currentModel } = useCompiler();
  const [loading, setLoading] = useState(false);

  // Fetch versions on mount
  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/save-version');
      if (response.ok) {
        const data = await response.json();
        setVersions(
          data.data.map((v: any) => ({
            id: v.id,
            name: v.name,
            content: v.content,
            model: v.model,
            createdAt: new Date(v.createdAt),
          }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch versions:', error);
    } finally {
      setLoading(false);
    }
  }, [setVersions]);

  const handleLoadVersion = useCallback(
    (version: PromptVersion) => {
      setCode(version.content);
    },
    [setCode]
  );

  const handleDeleteVersion = useCallback(
    async (versionId: string) => {
      try {
        const response = await fetch(`/api/versions?id=${versionId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setVersions(versions.filter(v => v.id !== versionId));
        }
      } catch (error) {
        console.error('Failed to delete version:', error);
      }
    },
    [versions, setVersions]
  );

  const handleExportVersion = useCallback((version: PromptVersion) => {
    const dataStr = JSON.stringify(
      {
        name: version.name,
        content: version.content,
        model: version.model,
        createdAt: version.createdAt.toISOString(),
      },
      null,
      2
    );

    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${version.name.replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  if (loading) {
    return (
      <GlassCard className="p-4">
        <div className="flex items-center justify-center h-32">
          <span className="text-sm text-muted-foreground">Loading versions...</span>
        </div>
      </GlassCard>
    );
  }

  if (versions.length === 0) {
    return (
      <GlassCard className="p-4">
        <div className="flex flex-col items-center justify-center h-32 gap-2">
          <Clock className="h-6 w-6 text-muted-foreground opacity-50" />
          <span className="text-sm text-muted-foreground">No versions saved yet</span>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Version History</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {versions.map((version) => (
          <div
            key={version.id}
            className="p-3 rounded-lg bg-card/50 border border-border/40 hover:border-border/60 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {version.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {version.createdAt.toLocaleDateString()} at{' '}
                  {version.createdAt.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                {version.model}
              </span>
            </div>

            <div className="flex gap-2">
              <AnimatedButton
                size="sm"
                variant="outline"
                className="flex-1 gap-1"
                onClick={() => handleLoadVersion(version)}
              >
                Load
              </AnimatedButton>
              <button
                onClick={() => handleExportVersion(version)}
                className="p-2 rounded-md hover:bg-card/80 transition-colors"
                title="Export version"
              >
                <Download className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => handleDeleteVersion(version.id)}
                className="p-2 rounded-md hover:bg-red-500/10 transition-colors"
                title="Delete version"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
});
