'use client';

import { useCompiler } from '@/context/compiler-context';
import { GlassCard } from '@/components/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, memo } from 'react';

export const OutputPanel = memo(function OutputPanel() {
  const { compiledOutput, isCompiling } = useCompiler();
  const [ast, setAst] = useState<any>(null);

  // Extract AST from compiled output if available
  useEffect(() => {
    // In a real scenario, the AST would come from the compilation response
    if (compiledOutput) {
      setAst({
        type: 'compiled-prompt',
        timestamp: new Date().toISOString(),
        status: 'compiled',
        details: {
          lines: compiledOutput.split('\n').length,
          chars: compiledOutput.length,
        },
      });
    }
  }, [compiledOutput]);

  return (
    <GlassCard className="h-full p-4 flex flex-col">
      {isCompiling ? (
        <div className="flex items-center justify-center h-full gap-2">
          <Loader2 className="h-5 w-5 text-accent animate-spin" />
          <span className="text-sm text-muted-foreground">Compiling...</span>
        </div>
      ) : compiledOutput ? (
        <Tabs defaultValue="system" className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="ast">AST</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto bg-card/30 rounded-lg p-3 font-mono text-xs text-foreground">
              {compiledOutput.split('---')[0].trim()}
            </div>
          </TabsContent>

          <TabsContent value="user" className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto bg-card/30 rounded-lg p-3 font-mono text-xs text-foreground">
              {compiledOutput.split('---')[1]?.trim() || 'No user prompt'}
            </div>
          </TabsContent>

          <TabsContent value="ast" className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto bg-card/30 rounded-lg p-3 font-mono text-xs text-foreground">
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(ast, null, 2)}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="text-sm text-muted-foreground">
            Compile your prompt to see output
          </span>
        </div>
      )}
    </GlassCard>
  );
});
