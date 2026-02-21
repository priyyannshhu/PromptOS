'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface Metrics {
  tokens: number;
  cost: number | string;
  reliability: number;
  complexity: number;
}

interface CompilerContextType {
  code: string;
  setCode: (code: string) => void;
  compiledOutput: string;
  setCompiledOutput: (output: string) => void;
  metrics: Metrics;
  setMetrics: (metrics: Metrics) => void;
  isCompiling: boolean;
  setIsCompiling: (isCompiling: boolean) => void;
  theme: 'light' | 'dark';
  compile: () => void;
}

const CompilerContext = createContext<CompilerContextType | undefined>(undefined);

export function CompilerProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState('');
  const [compiledOutput, setCompiledOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({
    tokens: 0,
    cost: 0,
    reliability: 0,
    complexity: 0,
  });

  const compile = useCallback(async () => {
    if (!code.trim()) {
      alert('Please enter a prompt to compile');
      return;
    }

    setIsCompiling(true);
    
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, model: 'gemini' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Compilation failed');
      }

      const { data } = await response.json();
      
      // Format output with system and user prompts
      const output = `System Prompt:\n${data.systemPrompt}\n\n---\n\nUser Prompt:\n${data.userPrompt}`;
      setCompiledOutput(output);

      // Update metrics with real calculations
      setMetrics({
        tokens: data.metrics.estimatedTokens,
        cost: data.metrics.estimatedCost,
        reliability: data.metrics.reliabilityScore,
        complexity: data.metrics.complexityScore,
      });

      setIsCompiling(false);
    } catch (error) {
      console.error('[Compile] Error:', error);
      setIsCompiling(false);
      alert(error instanceof Error ? error.message : 'Compilation failed');
    }
  }, [code]);

  const value: CompilerContextType = {
    code,
    setCode,
    compiledOutput,
    setCompiledOutput,
    metrics,
    setMetrics,
    isCompiling,
    setIsCompiling,
    theme: 'dark',
    compile,
  };

  return (
    <CompilerContext.Provider value={value}>
      {children}
    </CompilerContext.Provider>
  );
}

export function useCompiler() {
  const context = useContext(CompilerContext);
  if (context === undefined) {
    throw new Error('useCompiler must be used within CompilerProvider');
  }
  return context;
}
