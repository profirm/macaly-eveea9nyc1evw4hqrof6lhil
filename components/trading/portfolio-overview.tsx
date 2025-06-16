'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';
import { TradingStrategy } from '@/lib/trading-data';

interface PortfolioOverviewProps {
  strategies: TradingStrategy[];
  onRunAllStrategies: () => void;
  runAllActive: boolean;
}

export function PortfolioOverview({ strategies, onRunAllStrategies, runAllActive }: PortfolioOverviewProps) {
  console.log('Rendering portfolio overview with', strategies.length, 'strategies');

  const activeStrategies = strategies.filter(s => s.isActive);
  const totalPL = strategies.reduce((sum, s) => sum + s.profitLoss, 0);
  const totalTrades = strategies.reduce((sum, s) => sum + s.trades, 0);
  const avgWinRate = strategies.reduce((sum, s) => sum + s.winRate, 0) / strategies.length;
  const maxDrawdown = Math.max(...strategies.map(s => s.maxDrawdown));
  const avgRiskReward = strategies.reduce((sum, s) => sum + s.riskReward, 0) / strategies.length;

  const performanceColor = totalPL > 0 ? 'trading-positive' : 'trading-negative';
  const winRateColor = avgWinRate > 60 ? 'trading-positive' : avgWinRate > 50 ? 'trading-neutral' : 'trading-negative';

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <Card className="trading-surface border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-trading-bull" />
              <CardTitle className="text-trading-text">Portfolio Overview</CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-white/20 text-trading-text">
                {activeStrategies.length} Active
              </Badge>
              <Button
                onClick={onRunAllStrategies}
                className={`${runAllActive ? 'trading-button-danger' : 'trading-button'} text-sm`}
              >
                {runAllActive ? 'Stop All' : 'Run All Strategies'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="metric-card text-center">
              <div className="text-xs text-trading-muted">Total P&L</div>
              <div className={`text-2xl font-bold ${performanceColor}`}>
                ${totalPL.toLocaleString()}
              </div>
              <div className="text-xs text-trading-muted mt-1">
                {totalPL > 0 ? '+' : ''}{((totalPL / 100000) * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="metric-card text-center">
              <div className="text-xs text-trading-muted">Win Rate</div>
              <div className={`text-2xl font-bold ${winRateColor}`}>
                {avgWinRate.toFixed(1)}%
              </div>
              <div className="text-xs text-trading-muted mt-1">Average</div>
            </div>
            
            <div className="metric-card text-center">
              <div className="text-xs text-trading-muted">Total Trades</div>
              <div className="text-2xl font-bold text-trading-text">
                {totalTrades.toLocaleString()}
              </div>
              <div className="text-xs text-trading-muted mt-1">All strategies</div>
            </div>
            
            <div className="metric-card text-center">
              <div className="text-xs text-trading-muted">Risk/Reward</div>
              <div className="text-2xl font-bold text-trading-neutral">
                {avgRiskReward.toFixed(2)}
              </div>
              <div className="text-xs text-trading-muted mt-1">Average</div>
            </div>
            
            <div className="metric-card text-center">
              <div className="text-xs text-trading-muted">Max Drawdown</div>
              <div className="text-2xl font-bold text-trading-negative">
                {maxDrawdown.toFixed(1)}%
              </div>
              <div className="text-xs text-trading-muted mt-1">
                {maxDrawdown > 6 ? 'High Risk' : 'Acceptable'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="metric-card border-white/10">
          <CardContent className="p-4 text-center">
            <Activity className="w-6 h-6 mx-auto mb-2 text-trading-bull" />
            <div className="text-sm font-medium text-trading-text">Order Flow</div>
            <div className="text-xl font-bold text-trading-bull">
              {strategies.filter(s => s.category === 'order-flow').length}
            </div>
            <div className="text-xs text-trading-muted">strategies</div>
          </CardContent>
        </Card>
        
        <Card className="metric-card border-white/10">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-trading-info" />
            <div className="text-sm font-medium text-trading-text">Momentum</div>
            <div className="text-xl font-bold text-trading-info">
              {strategies.filter(s => s.category === 'momentum').length}
            </div>
            <div className="text-xs text-trading-muted">strategies</div>
          </CardContent>
        </Card>
        
        <Card className="metric-card border-white/10">
          <CardContent className="p-4 text-center">
            <TrendingDown className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <div className="text-sm font-medium text-trading-text">Reversal</div>
            <div className="text-xl font-bold text-yellow-400">
              {strategies.filter(s => s.category === 'reversal').length}
            </div>
            <div className="text-xs text-trading-muted">strategies</div>
          </CardContent>
        </Card>
        
        <Card className="metric-card border-white/10">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <div className="text-sm font-medium text-trading-text">Breakout</div>
            <div className="text-xl font-bold text-purple-400">
              {strategies.filter(s => s.category === 'breakout').length}
            </div>
            <div className="text-xs text-trading-muted">strategies</div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Management Alert */}
      {maxDrawdown > 6 && (
        <Card className="border-trading-bear/30 bg-trading-bear/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-trading-bear" />
              <div>
                <div className="font-medium text-trading-bear">High Risk Alert</div>
                <div className="text-sm text-trading-muted">
                  Maximum drawdown of {maxDrawdown.toFixed(1)}% detected. Consider reducing position sizes or disabling high-risk strategies.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Strategies Status */}
      <Card className="trading-surface border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-trading-text flex items-center gap-2">
            <Zap className="w-5 h-5 text-trading-bull" />
            Active Strategy Status
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {activeStrategies.length === 0 ? (
              <div className="text-center py-6 text-trading-muted">
                No strategies currently active. Enable strategies to start trading.
              </div>
            ) : (
              activeStrategies.map(strategy => (
                <div key={strategy.id} className="flex items-center justify-between p-3 bg-trading-surface/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="pulse-dot bg-trading-bull"></div>
                    <div>
                      <div className="font-medium text-trading-text text-sm">{strategy.name}</div>
                      <div className="text-xs text-trading-muted">{strategy.phase}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium text-sm ${strategy.profitLoss > 0 ? 'trading-positive' : 'trading-negative'}`}>
                      ${strategy.profitLoss.toLocaleString()}
                    </div>
                    <div className="text-xs text-trading-muted">{strategy.winRate}% WR</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}