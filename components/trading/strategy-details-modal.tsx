'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  Activity,
  BarChart3,
  Settings,
  BookOpen
} from 'lucide-react';
import { TradingStrategy } from '@/lib/trading-data';

interface StrategyDetailsModalProps {
  strategy: TradingStrategy | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StrategyDetailsModal({ strategy, isOpen, onClose }: StrategyDetailsModalProps) {
  if (!strategy) return null;

  console.log('Rendering strategy details modal for:', strategy.name);

  const getStrategyImplementation = (strategyName: string) => {
    const implementations: { [key: string]: { setup: string; entry: string; risk: string; exit: string } } = {
      'Liquidity Absorption & Exhaustion': {
        setup: 'Monitor price hitting levels with large passive liquidity. Detect repeated aggressive market orders hitting the level without significant price movement.',
        entry: 'Enter counter-trend trade after confirming absorption (multiple attempts failed to push price through). Enter when price starts ticking opposite direction.',
        risk: 'Stop Loss: Just beyond the absorbed liquidity zone. If absorption fails and passive liquidity is overwhelmed, exit immediately.',
        exit: 'Primary Target: Next significant opposing liquidity zone. Secondary Target: Previous resistance/support levels.'
      },
      'Hidden Order Detection (Iceberg)': {
        setup: 'Monitor for repeated small fills at same price level with size hardly decreasing or rapidly replenishing. Look for consistent, repeated small trade executions.',
        entry: 'Enter trade in SAME direction as iceberg intent. For buy iceberg, enter LONG position to ride institutional coattails.',
        risk: 'Stop Loss: Just beyond the iceberg price level. If iceberg is overwhelmed and price moves beyond it, premise is invalidated.',
        exit: 'Primary Target: Next significant liquidity zone in iceberg direction. Exit if iceberg is pulled from market.'
      },
      'Liquidity Fades & Traps': {
        setup: 'Identify large, appealing blocks of passive liquidity that appear suspiciously. Often at psychological levels or just before key price points.',
        entry: 'Enter in OPPOSITE direction of trap. When large orders are rapidly pulled, enter counter-trend as price reverses sharply.',
        risk: 'Tight stops beyond high/low formed before liquidity was pulled. Must be ready to exit if trap doesn\'t materialize.',
        exit: 'Quick, aggressive moves - often scalping opportunities targeting next significant support/resistance level.'
      },
      'Momentum & Breakout Confirmation': {
        setup: 'Price consolidating near well-defined resistance/support. Aggressive market orders consistently eating through passive liquidity.',
        entry: 'Enter AS breakout occurs with strong volume conviction. When aggressive volume clearly overwhelms passive liquidity.',
        risk: 'Stop Loss: Just inside the range from which price broke out. If price re-enters old range, breakout was likely false.',
        exit: 'Primary Target: Next significant support/resistance level. Monitor for absorption or exhaustion in breakout direction.'
      },
      'Stop Run Anticipation': {
        setup: 'Map buy stops above recent swing highs and sell stops below recent swing lows. Identify thin passive liquidity zones.',
        entry: 'Enter IN DIRECTION of stop run as price clears stop-loss cluster with strong aggressive volume. Or fade the stop run if immediate reversal.',
        risk: 'Tight stop just inside level where stop run occurred. If momentum fails immediately, exit quickly.',
        exit: 'Quick scalp into next area of significant liquidity. Be prepared for potential quick reversal after stops cleared.'
      }
    };

    return implementations[strategyName] || {
      setup: 'Strategy implementation details not available.',
      entry: 'Entry logic not defined.',
      risk: 'Risk management not specified.',
      exit: 'Exit strategy not defined.'
    };
  };

  const implementation = getStrategyImplementation(strategy.name);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'order-flow': return <Activity className="w-5 h-5" />;
      case 'momentum': return <TrendingUp className="w-5 h-5" />;
      case 'reversal': return <TrendingDown className="w-5 h-5" />;
      case 'breakout': return <Target className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-trading-bull text-white';
      case 'testing': return 'bg-trading-info text-white';
      case 'inactive': return 'bg-trading-muted text-white';
      default: return 'bg-trading-muted text-white';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-trading-bg border-white/20">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getCategoryIcon(strategy.category)}
            <div>
              <DialogTitle className="text-trading-text text-xl">{strategy.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(strategy.status)}>
                  {strategy.status.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-trading-muted">
                  {strategy.phase}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-trading-surface">
            <TabsTrigger value="overview" className="data-[state=active]:bg-trading-bull data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="implementation" className="data-[state=active]:bg-trading-bull data-[state=active]:text-white">
              Implementation
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-trading-bull data-[state=active]:text-white">
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="trading-surface border-white/10">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-trading-text mb-2">Strategy Description</h3>
                    <p className="text-trading-muted text-sm leading-relaxed">
                      {strategy.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-trading-surface/50 rounded-lg">
                      <div className="text-xs text-trading-muted">Category</div>
                      <div className="font-medium text-trading-text capitalize">
                        {strategy.category.replace('-', ' ')}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-trading-surface/50 rounded-lg">
                      <div className="text-xs text-trading-muted">Status</div>
                      <div className="font-medium text-trading-text capitalize">
                        {strategy.status}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-trading-surface/50 rounded-lg">
                      <div className="text-xs text-trading-muted">Phase</div>
                      <div className="font-medium text-trading-text">
                        {strategy.phase}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-trading-surface/50 rounded-lg">
                      <div className="text-xs text-trading-muted">Active</div>
                      <div className={`font-medium ${strategy.isActive ? 'text-trading-bull' : 'text-trading-bear'}`}>
                        {strategy.isActive ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="implementation" className="space-y-4">
            <div className="grid gap-4">
              <Card className="trading-surface border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="w-4 h-4 text-trading-bull" />
                    <h3 className="font-semibold text-trading-text">Setup Detection</h3>
                  </div>
                  <p className="text-trading-muted text-sm leading-relaxed">
                    {implementation.setup}
                  </p>
                </CardContent>
              </Card>

              <Card className="trading-surface border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-trading-bull" />
                    <h3 className="font-semibold text-trading-text">Entry Logic</h3>
                  </div>
                  <p className="text-trading-muted text-sm leading-relaxed">
                    {implementation.entry}
                  </p>
                </CardContent>
              </Card>

              <Card className="trading-surface border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-trading-bear" />
                    <h3 className="font-semibold text-trading-text">Risk Management</h3>
                  </div>
                  <p className="text-trading-muted text-sm leading-relaxed">
                    {implementation.risk}
                  </p>
                </CardContent>
              </Card>

              <Card className="trading-surface border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-trading-info" />
                    <h3 className="font-semibold text-trading-text">Exit Strategy</h3>
                  </div>
                  <p className="text-trading-muted text-sm leading-relaxed">
                    {implementation.exit}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="trading-surface border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-trading-bull mb-1">
                    {strategy.winRate}%
                  </div>
                  <div className="text-xs text-trading-muted">Win Rate</div>
                </CardContent>
              </Card>

              <Card className="trading-surface border-white/10">
                <CardContent className="p-4 text-center">
                  <div className={`text-2xl font-bold mb-1 ${strategy.profitLoss > 0 ? 'text-trading-bull' : 'text-trading-bear'}`}>
                    ${strategy.profitLoss.toLocaleString()}
                  </div>
                  <div className="text-xs text-trading-muted">Total P&L</div>
                </CardContent>
              </Card>

              <Card className="trading-surface border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-trading-text mb-1">
                    {strategy.trades}
                  </div>
                  <div className="text-xs text-trading-muted">Total Trades</div>
                </CardContent>
              </Card>

              <Card className="trading-surface border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-trading-info mb-1">
                    {strategy.riskReward.toFixed(2)}
                  </div>
                  <div className="text-xs text-trading-muted">Risk/Reward</div>
                </CardContent>
              </Card>

              <Card className="trading-surface border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-trading-bear mb-1">
                    {strategy.maxDrawdown}%
                  </div>
                  <div className="text-xs text-trading-muted">Max Drawdown</div>
                </CardContent>
              </Card>

              <Card className="trading-surface border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-trading-text mb-1">
                    ${(strategy.profitLoss / strategy.trades).toFixed(0)}
                  </div>
                  <div className="text-xs text-trading-muted">Avg per Trade</div>
                </CardContent>
              </Card>
            </div>

            {strategy.maxDrawdown > 6 && (
              <Card className="border-trading-bear/30 bg-trading-bear/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-trading-bear" />
                    <div>
                      <div className="font-medium text-trading-bear">High Risk Strategy</div>
                      <div className="text-sm text-trading-muted">
                        This strategy has a maximum drawdown of {strategy.maxDrawdown}%. Consider careful position sizing and risk management.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}