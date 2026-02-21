'use client';

import { Header } from '@/components/header';
import { FooterSection } from '@/components/footer-section';
import { GlassCard } from '@/components/glass-card';
import { ScrollReveal } from '@/components/scroll-reveal';
import { AnimatedButton } from '@/components/animated-button';
import { DiffViewer } from '@/components/diff-viewer';
import Link from 'next/link';
import { Code2, Zap, GitCompare } from 'lucide-react';

export default function DemoPage() {
  const originalPrompt = `You are a helpful assistant. Answer questions accurately and comprehensively.`;

  const optimizedPrompt = `You are an expert assistant specializing in providing clear, accurate, and comprehensive answers. 
Follow these guidelines:
- Break down complex topics into simple, understandable parts
- Provide relevant examples when applicable
- Structure your response logically with clear transitions
- Cite sources when making factual claims
- Ask clarifying questions if the request is ambiguous`;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-card/20 relative overflow-hidden">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              PromptOS in Action
            </h1>
            <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore how PromptOS transforms simple intents into optimized, production-ready prompts
            </p>
          </ScrollReveal>
        </section>

        {/* Compiler Engine Demo */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="h-6 w-6 text-accent" />
              <h2 className="text-3xl font-bold text-foreground">Compiler Engine</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              Our intent analysis engine automatically extracts domain, task type, constraints, and output format from user input.
            </p>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-2">
            <ScrollReveal>
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Input Analysis</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Domain</p>
                    <p className="text-foreground font-medium">QA Assistant</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Task Type</p>
                    <p className="text-foreground font-medium">Question Answering</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Constraints</p>
                    <p className="text-foreground font-medium">clarity, examples</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Output Format</p>
                    <p className="text-foreground font-medium">structured-text</p>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Metrics Calculated</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Estimated Tokens</p>
                    <p className="text-foreground font-medium">342</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated Cost</p>
                    <p className="text-foreground font-medium">$0.000684</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reliability Score</p>
                    <p className="text-foreground font-medium">92%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Complexity</p>
                    <p className="text-foreground font-medium">68/100</p>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>
        </section>

        {/* Diff Viewer Demo */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <GitCompare className="h-6 w-6 text-accent" />
              <h2 className="text-3xl font-bold text-foreground">Prompt Optimization</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              See how PromptOS optimizes your prompts with enhanced clarity, structure, and instructions.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <DiffViewer
              originalText={originalPrompt}
              modifiedText={optimizedPrompt}
              title="Original vs Optimized Prompt"
            />
          </ScrollReveal>
        </section>

        {/* Version Control Demo */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-6 w-6 text-accent" />
              <h2 className="text-3xl font-bold text-foreground">Version Control</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              Track all versions of your prompts with full history and easy comparison.
            </p>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: 'v1.0 - Initial', date: '2 hours ago', model: 'GPT-4' },
              { name: 'v1.1 - Enhanced', date: '1 hour ago', model: 'GPT-4' },
              { name: 'v2.0 - Optimized', date: '30 min ago', model: 'Claude' },
            ].map((version, idx) => (
              <ScrollReveal key={idx} delay={0.1 * (idx + 1)}>
                <GlassCard className="p-6">
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {version.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">{version.date}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {version.model}
                    </span>
                    <button className="text-xs text-accent hover:text-accent/90">View →</button>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <GlassCard className="p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground">
                Ready to Optimize Your Prompts?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
                Start using PromptOS today and build better prompts faster
              </p>
              <Link href="/editor">
                <AnimatedButton size="lg">Launch Editor</AnimatedButton>
              </Link>
            </GlassCard>
          </ScrollReveal>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
