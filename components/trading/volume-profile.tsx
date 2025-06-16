'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart2, Crown, Zap } from 'lucide-react';
import { VolumeProfile, generateVolumeProfile } from '@/lib/trading-data';

export function VolumeProfileChart() {
  const [profileData, setProfileData] = useState<VolumeProfile[]>([]);

  useEffect(() => {
    console.log('Initializing volume profile data');
    
    const updateProfile = () => {
      const newData = generateVolumeProfile();
      setProfileData(newData);
      console.log('Volume profile updated with', newData.length, 'price levels');
    };

    updateProfile();
    const interval = setInterval(updateProfile, 8000);

    return () => clearInterval(interval);
  }, []);

  const maxVolume = Math.max(...profileData.map(d => d.volume));
  const pocLevel = profileData.find(d => d.type === 'POC');
  const hvnLevels = profileData.filter(d => d.type === 'HVN');

  const getVolumeBarWidth = (volume: number) => {
    return (volume / maxVolume) * 100;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'POC': return <Crown className="w-3 h-3 text-yellow-400" />;
      case 'HVN': return <Zap className="w-3 h-3 text-trading-bull" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'POC': return 'bg-yellow-500';
      case 'HVN': return 'bg-trading-bull';
      default: return 'bg-trading-info/50';
    }
  };

  return (
    <Card className="chart-container border-white/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-trading-info" />
            <CardTitle className="text-trading-text">Volume Profile</CardTitle>
          </div>
          <Badge variant="outline" className="border-white/20 text-trading-text">
            Session Volume
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Key Level Summary */}
          <div className="grid grid-cols-3 gap-4 p-3 bg-trading-surface/30 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-trading-muted">Point of Control</div>
              <div className="font-mono font-bold text-yellow-400">
                ${pocLevel?.price.toFixed(2) || '0.00'}
              </div>
              <div className="text-xs text-trading-muted">
                {pocLevel?.volume.toLocaleString()} vol
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-trading-muted">HVN Count</div>
              <div className="font-mono font-bold text-trading-bull">
                {hvnLevels.length}
              </div>
              <div className="text-xs text-trading-muted">levels</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-trading-muted">Total Volume</div>
              <div className="font-mono font-bold text-trading-text">
                {profileData.reduce((sum, d) => sum + d.volume, 0).toLocaleString()}
              </div>
              <div className="text-xs text-trading-muted">contracts</div>
            </div>
          </div>

          {/* Volume Profile Chart */}
          <div className="space-y-1 max-h-80 overflow-y-auto">
            <div className="grid grid-cols-4 gap-2 text-xs text-trading-muted font-medium mb-2 px-2">
              <div>Price</div>
              <div className="col-span-2 text-center">Volume Distribution</div>
              <div className="text-center">Type</div>
            </div>
            
            {profileData.slice(0, 30).map((data, index) => (
              <div 
                key={index}
                className={`grid grid-cols-4 gap-2 items-center p-2 rounded-md transition-all duration-200 ${
                  data.type !== 'LVN' ? 'bg-white/5 border border-white/10' : 'hover:bg-white/5'
                }`}
              >
                <div className="font-mono text-sm font-medium text-trading-text">
                  {data.price.toFixed(2)}
                </div>
                
                <div className="col-span-2 relative h-6 bg-trading-surface rounded overflow-hidden">
                  <div 
                    className={`h-full ${getTypeColor(data.type)} transition-all duration-300 flex items-center justify-end pr-2`}
                    style={{ width: `${getVolumeBarWidth(data.volume)}%` }}
                  >
                    <span className="text-xs font-mono text-white font-medium">
                      {data.volume.toLocaleString()}
                    </span>
                  </div>
                  {data.type === 'POC' && (
                    <div className="absolute inset-0 bg-yellow-400/20 animate-pulse-glow"></div>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {getTypeIcon(data.type)}
                    <span className={`text-xs font-medium ${
                      data.type === 'POC' ? 'text-yellow-400' :
                      data.type === 'HVN' ? 'text-trading-bull' :
                      'text-trading-muted'
                    }`}>
                      {data.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="p-3 bg-trading-surface/30 rounded-lg">
            <div className="text-xs text-trading-muted mb-2">Legend:</div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Crown className="w-3 h-3 text-yellow-400" />
                <span className="text-trading-text">POC - Point of Control</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-trading-bull" />
                <span className="text-trading-text">HVN - High Volume Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-trading-info/50 rounded"></div>
                <span className="text-trading-text">LVN - Low Volume Node</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}