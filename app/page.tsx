'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Activity, TrendingUp, Zap } from 'lucide-react';

import { StrategyCard } from '@/components/trading/strategy-card';
import { RealTimeChart } from '@/components/trading/real-time-chart';
import { FootprintChart } from '@/components/trading/footprint-chart';
import { VolumeProfileChart } from '@/components/trading/volume-profile';
import { PortfolioOverview } from '@/components/trading/portfolio-overview';
import { StrategyDetailsModal } from '@/components/trading/strategy-details-modal';

import { tradingStrategies, TradingStrategy } from '@/lib/trading-data';

export default function TradingDashboard() {
  const [strategies, setStrategies] = useState<TradingStrategy[]>(tradingStrategies);
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy | null>(null);
  const [runAllActive, setRunAllActive] = useState(false);

  useEffect(() => {
    console.log('Trading dashboard initialized with', strategies.length, 'strategies');
  }, [strategies]);

  const handleStrategyToggle = (id: string, isActive: boolean) => {
    console.log('Toggling strategy:', id, 'to', isActive);
    setStrategies(prev => 
      prev.map(strategy => 
        strategy.id === id ? { ...strategy, isActive } : strategy
      )
    );
  };

  const handleRunAllStrategies = () => {
    console.log('Run all strategies toggled:', !runAllActive);
    setRunAllActive(prev => !prev);
    
    if (!runAllActive) {
      // Enable all strategies
      setStrategies(prev => 
        prev.map(strategy => ({ ...strategy, isActive: true }))
      );
    } else {
      // Disable all strategies
      setStrategies(prev => 
        prev.map(strategy => ({ ...strategy, isActive: false }))
      );
    }
  };

  const handleViewStrategyDetails = (strategy: TradingStrategy) => {
    console.log('Viewing strategy details:', strategy.name);
    setSelectedStrategy(strategy);
  };

  const activeStrategies = strategies.filter(s => s.isActive);

  return (
    <div className="min-h-screen bg-trading-gradient p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-trading-text">
            Sierra Chart Trading Bot
          </h1>
          <p className="text-trading-muted text-lg">
            Advanced Order Flow & Footprint Analysis Dashboard
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="border-trading-bull text-trading-bull">
              Phase 3 Implementation
            </Badge>
            <Badge variant="outline" className="border-trading-info text-trading-info">
              {activeStrategies.length} Active Strategies
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-trading-surface/60 border border-white/10">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-trading-bull data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="strategies" 
              className="data-[state=active]:bg-trading-bull data-[state=active]:text-white"
            >
              Strategies
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              className="data-[state=active]:bg-trading-bull data-[state=active]:text-white"
            >
              Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="charts" 
              className="data-[state=active]:bg-trading-bull data-[state=active]:text-white"
            >
              Charts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <PortfolioOverview
              strategies={strategies}
              onRunAllStrategies={handleRunAllStrategies}
              runAllActive={runAllActive}
            />
          </TabsContent>

          <TabsContent value="strategies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strategies.map((strategy) => (
                <StrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  onToggle={handleStrategyToggle}
                  onViewDetails={handleViewStrategyDetails}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FootprintChart />
              <VolumeProfileChart />
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <RealTimeChart />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="trading-surface border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-trading-text flex items-center gap-2">
                    <Activity className="w-5 h-5 text-trading-bull" />
                    Market Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-trading-muted">Session</span>
                      <Badge className="bg-trading-bull text-white">LIVE</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trading-muted">Volume</span>
                      <span className="text-trading-text font-mono">1.2M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trading-muted">Volatility</span>
                      <span className="text-trading-text font-mono">High</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="trading-surface border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-trading-text flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-trading-info" />
                    Order Flow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-trading-muted">Aggressive Buys</span>
                      <span className="text-trading-bull font-mono">65%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trading-muted">Aggressive Sells</span>
                      <span className="text-trading-bear font-mono">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trading-muted">Imbalance</span>
                      <span className="text-trading-bull font-mono">+2,456</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="trading-surface border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-trading-text flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-trading-bull" />
                    Signals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-trading-muted">Active Signals</span>
                      <span className="text-trading-bull font-mono">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trading-muted">Pending</span>
                      <span className="text-trading-info font-mono">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trading-muted">Filled Today</span>
                      <span className="text-trading-text font-mono">7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <StrategyDetailsModal
          strategy={selectedStrategy}
          isOpen={!!selectedStrategy}
          onClose={() => setSelectedStrategy(null)}
        />
      </div>
    </div>
  );
}
