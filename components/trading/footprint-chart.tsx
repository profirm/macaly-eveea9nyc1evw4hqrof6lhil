'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, AlertCircle } from 'lucide-react';
import { FootprintData, generateFootprintData } from '@/lib/trading-data';

export function FootprintChart() {
  const [footprintData, setFootprintData] = useState<FootprintData[]>([]);

  useEffect(() => {
    console.log('Initializing footprint chart data');
    
    const updateFootprint = () => {
      const newData = generateFootprintData(20);
      setFootprintData(newData);
      console.log('Footprint data updated with', newData.length, 'price levels');
    };

    updateFootprint();
    const interval = setInterval(updateFootprint, 5000);

    return () => clearInterval(interval);
  }, []);

  const getImbalanceColor = (imbalance: number) => {
    const absImbalance = Math.abs(imbalance);
    if (absImbalance > 0.6) return imbalance > 0 ? 'bg-trading-bull' : 'bg-trading-bear';
    if (absImbalance > 0.3) return imbalance > 0 ? 'bg-trading-bull/60' : 'bg-trading-bear/60';
    return 'bg-trading-muted/40';
  };

  const getVolumeBarWidth = (volume: number, maxVolume: number) => {
    return Math.max((volume / maxVolume) * 100, 5);
  };

  const maxBidVolume = Math.max(...footprintData.map(d => d.bidVolume));
  const maxAskVolume = Math.max(...footprintData.map(d => d.askVolume));

  return (
    <Card className="chart-container border-white/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-trading-info" />
            <CardTitle className="text-trading-text">Footprint Analysis</CardTitle>
          </div>
          <Badge variant="outline" className="border-white/20 text-trading-text">
            Volume Imbalance
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-1 max-h-80 overflow-y-auto">
          <div className="grid grid-cols-5 gap-2 text-xs text-trading-muted font-medium mb-2 px-2">
            <div>Price</div>
            <div className="text-center">Bid Vol</div>
            <div className="text-center">Ask Vol</div>
            <div className="text-center">Imbalance</div>
            <div className="text-center">Signal</div>
          </div>
          
          {footprintData.map((data, index) => (
            <div 
              key={index}
              className={`grid grid-cols-5 gap-2 items-center p-2 rounded-md transition-all duration-200 ${
                data.absorption ? 'bg-white/5 border border-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="font-mono text-sm font-medium text-trading-text">
                {data.price.toFixed(2)}
              </div>
              
              <div className="relative h-6 bg-trading-surface rounded">
                <div 
                  className="h-full bg-trading-bear/70 rounded flex items-center justify-center"
                  style={{ width: `${getVolumeBarWidth(data.bidVolume, maxBidVolume)}%` }}
                >
                  <span className="text-xs font-mono text-white">
                    {data.bidVolume}
                  </span>
                </div>
              </div>
              
              <div className="relative h-6 bg-trading-surface rounded">
                <div 
                  className="h-full bg-trading-bull/70 rounded flex items-center justify-center"
                  style={{ width: `${getVolumeBarWidth(data.askVolume, maxAskVolume)}%` }}
                >
                  <span className="text-xs font-mono text-white">
                    {data.askVolume}
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <div 
                  className={`px-2 py-1 rounded text-xs font-medium ${getImbalanceColor(data.imbalance)}`}
                >
                  {(data.imbalance * 100).toFixed(0)}%
                </div>
              </div>
              
              <div className="text-center">
                {data.absorption && (
                  <div className="flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-trading-bull animate-pulse-glow" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-trading-surface/30 rounded-lg">
          <div className="text-xs text-trading-muted mb-2">Legend:</div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-trading-bear/70 rounded"></div>
              <span className="text-trading-text">Bid Volume (Aggressive Sells)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-trading-bull/70 rounded"></div>
              <span className="text-trading-text">Ask Volume (Aggressive Buys)</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3 h-3 text-trading-bull" />
              <span className="text-trading-text">Absorption Pattern</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-trading-bull rounded"></div>
              <span className="text-trading-text">Strong Imbalance (&gt;60%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}