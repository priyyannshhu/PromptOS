'use client';

import { GlassCard } from '@/components/glass-card';
import { Plus, Minus, Equal } from 'lucide-react';
import { useMemo, memo } from 'react';

interface DiffLine {
  type: 'add' | 'remove' | 'equal';
  content: string;
  lineNumber?: number;
}

interface DiffViewerProps {
  originalText: string;
  modifiedText: string;
  title?: string;
}

// Simple diff algorithm (character-level)
function generateDiff(original: string, modified: string): DiffLine[] {
  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');

  const diffs: DiffLine[] = [];
  const maxLines = Math.max(originalLines.length, modifiedLines.length);

  for (let i = 0; i < maxLines; i++) {
    const origLine = originalLines[i];
    const modLine = modifiedLines[i];

    if (origLine === modLine) {
      diffs.push({ type: 'equal', content: origLine || '', lineNumber: i + 1 });
    } else {
      if (origLine !== undefined) {
        diffs.push({ type: 'remove', content: origLine, lineNumber: i + 1 });
      }
      if (modLine !== undefined) {
        diffs.push({ type: 'add', content: modLine, lineNumber: i + 1 });
      }
    }
  }

  return diffs;
}

export const DiffViewer = memo(function DiffViewer({
  originalText,
  modifiedText,
  title = 'Comparison',
}: DiffViewerProps) {
  const diffs = useMemo(
    () => generateDiff(originalText, modifiedText),
    [originalText, modifiedText]
  );

  const stats = useMemo(() => {
    const additions = diffs.filter(d => d.type === 'add').length;
    const deletions = diffs.filter(d => d.type === 'remove').length;
    return { additions, deletions };
  }, [diffs]);

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Plus className="h-3 w-3 text-green-500" />
            <span className="text-muted-foreground">{stats.additions}</span>
          </div>
          <div className="flex items-center gap-1">
            <Minus className="h-3 w-3 text-red-500" />
            <span className="text-muted-foreground">{stats.deletions}</span>
          </div>
        </div>
      </div>

      <div className="space-y-0 font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto">
        {diffs.map((diff, idx) => (
          <div
            key={idx}
            className={`px-3 py-1 ${
              diff.type === 'add'
                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                : diff.type === 'remove'
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                  : 'bg-transparent text-muted-foreground'
            }`}
          >
            <span className="inline-block w-6 text-right mr-2">
              {diff.type === 'add' ? '+' : diff.type === 'remove' ? '-' : ' '}
            </span>
            <span className="inline-block w-8 text-right mr-3 text-xs text-muted-foreground opacity-50">
              {diff.lineNumber}
            </span>
            <span className="break-all">{diff.content || '\u00a0'}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
});
