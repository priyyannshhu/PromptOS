'use client';

import { useState } from 'react';
import { AnimatedButton } from '@/components/animated-button';
import { GlassCard } from '@/components/glass-card';
import { Header } from '@/components/header';
import { FooterSection } from '@/components/footer-section';
import { Loader2 } from 'lucide-react';

export default function GeminiTestPage() {
  const [prompt, setPrompt] = useState('Write a function that validates email addresses');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleCompile = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: prompt, model: 'gemini' }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Compilation failed');
      }

      const data = await res.json();
      setResponse(JSON.stringify(data.data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-semibold text-foreground mb-2">Gemini Integration Test</h1>
            <p className="text-muted-foreground">Test the PromptOS compiler with Gemini API</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Input Panel */}
            <GlassCard className="p-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Input Prompt</h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-48 p-4 bg-background/50 border border-border/20 rounded-lg text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:border-primary/50"
                placeholder="Enter your prompt here..."
              />
              <AnimatedButton
                onClick={handleCompile}
                disabled={loading}
                className="w-full mt-4"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Compiling...
                  </>
                ) : (
                  'Compile with Gemini'
                )}
              </AnimatedButton>
            </GlassCard>

            {/* Output Panel */}
            <GlassCard className="p-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Output</h2>
              {error && (
                <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}
              {response && (
                <pre className="w-full h-48 p-4 bg-background/50 border border-border/20 rounded-lg text-foreground text-xs overflow-auto">
                  {response}
                </pre>
              )}
              {!response && !error && (
                <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                  Output will appear here
                </div>
              )}
            </GlassCard>
          </div>

          {/* Example Prompts */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Example Prompts</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                'Generate a Python function for sorting an array',
                'Create a comprehensive system prompt for a customer service chatbot',
                'Write instructions for implementing a machine learning model',
              ].map((example, idx) => (
                <GlassCard
                  key={idx}
                  hover
                  className="p-4 cursor-pointer transition-all hover:scale-105"
                  onClick={() => setPrompt(example)}
                >
                  <p className="text-sm text-foreground">{example}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
