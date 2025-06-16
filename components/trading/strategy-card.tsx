'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Activity, Target, AlertTriangle } from 'lucide-react';
import { TradingStrategy } from '@/lib/trading-data';

interface StrategyCardProps {
  strategy: TradingStrategy;
  onToggle: (id: string, isActive: boolean) => void;
  onViewDetails: (strategy: TradingStrategy) => void;
}

export function StrategyCard({ strategy, onToggle, onViewDetails }: StrategyCardProps) {
  console.log('Rendering strategy card for:', strategy.name);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-trading-bull text-white';
      case 'testing': return 'bg-trading-info text-white';
      case 'inactive': return 'bg-trading-muted text-white';
      default: return 'bg-trading-muted text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'order-flow': return <Activity className="w-4 h-4" />;
      case 'momentum': return <TrendingUp className="w-4 h-4" />;
      case 'reversal': return <TrendingDown className="w-4 h-4" />;
      case 'breakout': return <Target className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <Card className="strategy-card border-white/10 hover:border-white/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getCategoryIcon(strategy.category)}
              <CardTitle className="text-trading-text text-sm font-semibold">
                {strategy.name}
              </CardTitle>
            </div>
            <Badge className={getStatusColor(strategy.status)}>
              {strategy.status.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={strategy.isActive}
              onCheckedChange={(checked) => onToggle(strategy.id, checked)}
              className="data-[state=checked]:bg-trading-bull"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-trading-muted text-xs leading-relaxed">
          {strategy.description}
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="metric-card">
            <div className="text-xs text-trading-muted">Win Rate</div>
            <div className={`text-lg font-bold ${strategy.winRate > 60 ? 'trading-positive' : 'trading-negative'}`}>
              {strategy.winRate}%
            </div>
          </div>
          
          <div className="metric-card">
            <div className="text-xs text-trading-muted">P&L</div>
            <div className={`text-lg font-bold ${strategy.profitLoss > 0 ? 'trading-positive' : 'trading-negative'}`}>
              ${strategy.profitLoss.toLocaleString()}
            </div>
          </div>
          
          <div className="metric-card">
            <div className="text-xs text-trading-muted">Risk/Reward</div>
            <div className="text-lg font-bold trading-neutral">
              {strategy.riskReward.toFixed(2)}
            </div>
          </div>
          
          <div className="metric-card">
            <div className="text-xs text-trading-muted">Max DD</div>
            <div className="text-lg font-bold trading-negative">
              {strategy.maxDrawdown}%
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-trading-muted">
            {strategy.trades} trades • {strategy.phase}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(strategy)}
            className="h-8 px-3 text-xs border-white/20 hover:border-white/40 hover:bg-white/5"
          >
            View Details
          </Button>
        </div>
        
        {strategy.maxDrawdown > 6 && (
          <div className="flex items-center gap-2 p-2 bg-trading-bear/10 rounded-md">
            <AlertTriangle className="w-4 h-4 text-trading-bear" />
            <span className="text-xs text-trading-bear">High drawdown risk</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}