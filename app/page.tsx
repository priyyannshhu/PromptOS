'use client';

import { Header } from '@/components/header';
import { FooterSection } from '@/components/footer-section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { Zap, Cpu, Shield, Rocket, Code2, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const FEATURE_ITEMS = [
  {
    icon: Code2,
    title: 'Smart Compilation',
    description: 'Intent parsed. Constraints structured. Output perfected.',
  },
  {
    icon: Cpu,
    title: 'Version Control',
    description: 'Every prompt iteration saved, compared, and refined.',
  },
  {
    icon: Shield,
    title: 'AI-Powered Analysis',
    description: 'Real-time optimization powered by Gemini.',
  },
  {
    icon: Rocket,
    title: 'Multi-Model Ready',
    description: 'Built for Gemini today. Architected for OpenAI, Claude, and beyond.',
  },
  {
    icon: Settings,
    title: 'Cost Intelligence',
    description: 'Token estimation and cost prediction before execution.',
  },
  {
    icon: Zap,
    title: 'Reliability Scoring',
    description: 'Confidence metrics engineered into every compilation.',
  },
];

const MODEL_BADGES = [
  { name: 'Gemini', color: 'bg-primary text-primary-foreground font-semibold' },
  { name: 'GPT-4', color: 'bg-primary/20 text-primary' },
  { name: 'Claude', color: 'bg-primary/20 text-primary' },
  { name: 'Llama', color: 'bg-primary/20 text-primary' },
  { name: 'Mistral', color: 'bg-primary/20 text-primary' },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero text stagger animation - subtle fade and slide
    if (heroRef.current) {
      const words = heroRef.current.querySelectorAll('.hero-word');
      gsap.fromTo(
        words,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }

    // Subtle floating animation
    if (floatingRef.current) {
      gsap.to(floatingRef.current, {
        y: -10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background relative overflow-hidden">

        {/* Hero Section */}
        <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <div ref={heroRef}>
            <h1 className="mb-6 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              <span className="hero-word block">Transform Prompts</span>
              <span className="hero-word block text-primary">
                Into Intelligence
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
              PromptOS is an enterprise IDE for prompt engineering. Compile, optimize, and deploy AI prompts with precision.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/editor">
                <Button size="lg" className="gap-2">
                  <Zap className="h-5 w-5" />
                  Start Building
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Documentation
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <ScrollReveal delay={0.1} className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to build production-grade prompts
            </p>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURE_ITEMS.map((feature, idx) => (
              <ScrollReveal key={idx} delay={0.1 * (idx + 1)}>
                <Card className="border-border bg-card hover:bg-card/80 transition-colors">
                  <CardHeader>
                    <feature.icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Model Badges Section */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center">
            <h2 className="mb-4 text-3xl font-semibold text-foreground">
              Supported Models
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Ready to integrate with the latest AI models
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {MODEL_BADGES.map((model) => (
                <div
                  key={model.name}
                  className={`px-6 py-2 rounded-full ${model.color} font-medium text-sm`}
                >
                  {model.name}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
          <ScrollReveal>
            <Card className="border-border bg-card text-center p-12">
              <h2 className="mb-4 text-3xl font-semibold text-foreground">
                Ready to Build?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Start using PromptOS to build better AI prompts
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/editor">
                  <Button size="lg">Start Compiling</Button>
                </Link>
              </div>
            </Card>
          </ScrollReveal>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
