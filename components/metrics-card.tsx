'use client';

import { useCompiler } from '@/context/compiler-context';
import { GlassCard } from '@/components/glass-card';
import { Zap, TrendingUp, Shield, Gauge } from 'lucide-react';
import { memo } from 'react';

export const MetricsCard = memo(function MetricsCard() {
  const { metrics } = useCompiler();

  const metricItems = [
    {
      icon: Zap,
      label: 'Tokens',
      value: metrics.tokens,
      color: 'text-yellow-500',
    },
    {
      icon: TrendingUp,
      label: 'Cost',
      value: `$${metrics.cost.toFixed(4)}`,
      color: 'text-green-500',
    },
    {
      icon: Shield,
      label: 'Reliability',
      value: `${metrics.reliability}%`,
      color: 'text-blue-500',
    },
    {
      icon: Gauge,
      label: 'Complexity',
      value: metrics.complexity,
      color: 'text-purple-500',
    },
  ];

  return (
    <GlassCard className="p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Metrics</h3>
      <div className="grid grid-cols-2 gap-4">
        {metricItems.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center gap-2">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
});
