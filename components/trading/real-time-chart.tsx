'use client';

import { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { MarketData, dataSimulator } from '@/lib/trading-data';

interface ChartDataPoint {
  time: string;
  price: number;
  volume: number;
  delta: number;
  cumulativeDelta: number;
}

export function RealTimeChart() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [currentData, setCurrentData] = useState<MarketData | null>(null);
  const maxDataPoints = 50;

  useEffect(() => {
    console.log('Setting up real-time chart data subscription');

    const handleNewData = (marketData: MarketData) => {
      console.log('Received new market data:', marketData.price);
      
      setCurrentData(marketData);
      
      setData(prevData => {
        const newPoint: ChartDataPoint = {
          time: marketData.timestamp.toLocaleTimeString(),
          price: Number(marketData.price.toFixed(2)),
          volume: Number(marketData.volume.toFixed(0)),
          delta: Number(marketData.delta.toFixed(0)),
          cumulativeDelta: Number(marketData.cumulativeDelta.toFixed(0))
        };
        
        const updatedData = [...prevData, newPoint];
        return updatedData.slice(-maxDataPoints);
      });
    };

    dataSimulator.subscribe(handleNewData);
    dataSimulator.start();

    return () => {
      dataSimulator.unsubscribe(handleNewData);
      dataSimulator.stop();
    };
  }, []);

  const currentPrice = currentData?.price || 0;
  const priceChange = data.length > 1 
    ? currentPrice - data[data.length - 2].price 
    : 0;
  const isPositive = priceChange >= 0;

  return (
    <Card className="chart-container border-white/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-trading-bull" />
            <CardTitle className="text-trading-text">Real-Time Price Action</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-white/20 text-trading-text">
              ES Futures
            </Badge>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-trading-bull" />
              ) : (
                <TrendingDown className="w-4 h-4 text-trading-bear" />
              )}
              <span className={`font-mono text-lg font-bold ${isPositive ? 'trading-positive' : 'trading-negative'}`}>
                ${currentPrice.toFixed(2)}
              </span>
              <span className={`text-sm ${isPositive ? 'trading-positive' : 'trading-negative'}`}>
                ({isPositive ? '+' : ''}{priceChange.toFixed(2)})
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }}
                formatter={(value: number, name: string) => [
                  typeof value === 'number' ? value.toFixed(2) : value,
                  name
                ]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {currentData && (
          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <div className="text-xs text-trading-muted">Volume</div>
              <div className="font-mono font-bold text-trading-text">
                {currentData.volume.toFixed(0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-trading-muted">Delta</div>
              <div className={`font-mono font-bold ${currentData.delta > 0 ? 'trading-positive' : 'trading-negative'}`}>
                {currentData.delta.toFixed(0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-trading-muted">Cum. Delta</div>
              <div className={`font-mono font-bold ${currentData.cumulativeDelta > 0 ? 'trading-positive' : 'trading-negative'}`}>
                {currentData.cumulativeDelta.toFixed(0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-trading-muted">Spread</div>
              <div className="font-mono font-bold text-trading-text">
                {(currentData.ask - currentData.bid).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}