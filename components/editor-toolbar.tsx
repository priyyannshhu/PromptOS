'use client';

import { useCompiler } from '@/context/compiler-context';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface EditorToolbarProps {
  onToggleVersions?: () => void;
}

export function EditorToolbar({ onToggleVersions }: EditorToolbarProps) {
  const { compile, isCompiling } = useCompiler();

  const handleCompile = async () => {
    compile();
  };

  return (
    <div className="p-4 rounded-lg border border-border bg-card flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-muted-foreground">Gemini Prompt Compiler</span>
      
      <Button
        onClick={handleCompile}
        disabled={isCompiling}
        size="sm"
        className="gap-2"
      >
        <Zap className="h-4 w-4" />
        {isCompiling ? 'Compiling...' : 'Compile'}
      </Button>
    </div>
  );
}
