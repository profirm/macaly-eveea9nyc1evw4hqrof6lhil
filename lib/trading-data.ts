import { v4 as uuidv4 } from 'uuid';

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  phase: string;
  status: 'active' | 'inactive' | 'testing';
  winRate: number;
  profitLoss: number;
  trades: number;
  riskReward: number;
  maxDrawdown: number;
  category: 'order-flow' | 'momentum' | 'reversal' | 'breakout';
  signals: TradingSignal[];
  isActive: boolean;
}

export interface TradingSignal {
  id: string;
  timestamp: Date;
  type: 'buy' | 'sell';
  price: number;
  confidence: number;
  volume: number;
  status: 'active' | 'filled' | 'cancelled';
  strategy: string;
}

export interface MarketData {
  timestamp: Date;
  price: number;
  volume: number;
  bid: number;
  ask: number;
  delta: number;
  cumulativeDelta: number;
  aggBuyVolume: number;
  aggSellVolume: number;
}

export interface FootprintData {
  price: number;
  bidVolume: number;
  askVolume: number;
  imbalance: number;
  absorption: boolean;
}

export interface VolumeProfile {
  price: number;
  volume: number;
  type: 'HVN' | 'LVN' | 'POC';
}

// Generate realistic trading data
export function generateMarketData(hours: number = 24): MarketData[] {
  const data: MarketData[] = [];
  const basePrice = 4200;
  let currentPrice = basePrice;
  let cumulativeDelta = 0;
  
  for (let i = 0; i < hours * 60; i++) {
    const timestamp = new Date(Date.now() - (hours * 60 - i) * 60000);
    
    // Simulate price movement
    const volatility = 0.001;
    const priceChange = (Math.random() - 0.5) * basePrice * volatility;
    currentPrice += priceChange;
    
    // Simulate volume and order flow
    const baseVolume = 1000 + Math.random() * 2000;
    const aggBuyVolume = baseVolume * (0.3 + Math.random() * 0.4);
    const aggSellVolume = baseVolume - aggBuyVolume;
    const delta = aggBuyVolume - aggSellVolume;
    cumulativeDelta += delta;
    
    const bid = currentPrice - 0.5;
    const ask = currentPrice + 0.5;
    
    data.push({
      timestamp,
      price: currentPrice,
      volume: baseVolume,
      bid,
      ask,
      delta,
      cumulativeDelta,
      aggBuyVolume,
      aggSellVolume
    });
  }
  
  return data;
}

export function generateFootprintData(count: number = 20): FootprintData[] {
  return Array.from({ length: count }, (_, i) => {
    const basePrice = 4200 + i * 0.25;
    const bidVolume = Math.random() * 1000 + 100;
    const askVolume = Math.random() * 1000 + 100;
    const imbalance = (bidVolume - askVolume) / (bidVolume + askVolume);
    
    return {
      price: basePrice,
      bidVolume: Math.round(bidVolume),
      askVolume: Math.round(askVolume),
      imbalance,
      absorption: Math.abs(imbalance) > 0.6
    };
  });
}

export function generateVolumeProfile(): VolumeProfile[] {
  const profile: VolumeProfile[] = [];
  const basePrice = 4200;
  
  for (let i = 0; i < 100; i++) {
    const price = basePrice - 50 + i;
    let volume = Math.random() * 1000;
    let type: 'HVN' | 'LVN' | 'POC' = 'LVN';
    
    // Create some high volume nodes
    if (i === 25 || i === 50 || i === 75) {
      volume *= 5;
      type = 'HVN';
    }
    
    // Point of Control (highest volume)
    if (i === 50) {
      type = 'POC';
      volume *= 1.5;
    }
    
    profile.push({
      price,
      volume: Math.round(volume),
      type
    });
  }
  
  return profile.sort((a, b) => b.volume - a.volume);
}

export const tradingStrategies: TradingStrategy[] = [
  {
    id: uuidv4(),
    name: 'Liquidity Absorption & Exhaustion',
    description: 'Identifies when large orders are being absorbed at key levels, indicating potential reversal points',
    phase: 'Phase 3.1',
    status: 'active',
    winRate: 68.5,
    profitLoss: 12450,
    trades: 127,
    riskReward: 1.85,
    maxDrawdown: 4.2,
    category: 'reversal',
    signals: [],
    isActive: true
  },
  {
    id: uuidv4(),
    name: 'Hidden Order Detection (Iceberg)',
    description: 'Detects large hidden orders being executed in small chunks to avoid market impact',
    phase: 'Phase 3.2',
    status: 'active',
    winRate: 72.3,
    profitLoss: 8920,
    trades: 89,
    riskReward: 2.1,
    maxDrawdown: 3.1,
    category: 'order-flow',
    signals: [],
    isActive: true
  },
  {
    id: uuidv4(),
    name: 'Liquidity Fades & Traps',
    description: 'Identifies fake liquidity walls that disappear when price approaches, creating trading opportunities',
    phase: 'Phase 3.3',
    status: 'testing',
    winRate: 61.2,
    profitLoss: 5640,
    trades: 98,
    riskReward: 1.65,
    maxDrawdown: 6.8,
    category: 'reversal',
    signals: [],
    isActive: false
  },
  {
    id: uuidv4(),
    name: 'Momentum & Breakout Confirmation',
    description: 'Confirms genuine breakouts using aggressive volume analysis and momentum indicators',
    phase: 'Phase 3.4',
    status: 'active',
    winRate: 58.7,
    profitLoss: 15680,
    trades: 156,
    riskReward: 1.92,
    maxDrawdown: 5.5,
    category: 'breakout',
    signals: [],
    isActive: true
  },
  {
    id: uuidv4(),
    name: 'Stop Run Anticipation',
    description: 'Anticipates and trades stop-loss hunting moves by identifying clustered stop levels',
    phase: 'Phase 3.5',
    status: 'active',
    winRate: 64.8,
    profitLoss: 9320,
    trades: 94,
    riskReward: 1.75,
    maxDrawdown: 4.9,
    category: 'momentum',
    signals: [],
    isActive: true
  },
  {
    id: uuidv4(),
    name: 'Volume Imbalance & Absorption',
    description: 'Analyzes footprint charts for volume imbalances and absorption patterns at price extremes',
    phase: 'Phase 3.6',
    status: 'active',
    winRate: 70.1,
    profitLoss: 11240,
    trades: 118,
    riskReward: 1.95,
    maxDrawdown: 3.8,
    category: 'order-flow',
    signals: [],
    isActive: true
  },
  {
    id: uuidv4(),
    name: 'Delta Divergence & Exhaustion',
    description: 'Identifies momentum shifts through delta divergence and exhaustion patterns',
    phase: 'Phase 3.7',
    status: 'active',
    winRate: 66.9,
    profitLoss: 7890,
    trades: 105,
    riskReward: 1.68,
    maxDrawdown: 4.4,
    category: 'reversal',
    signals: [],
    isActive: true
  },
  {
    id: uuidv4(),
    name: 'High Volume Nodes (HVNs)',
    description: 'Trades bounces and breakouts at high volume acceptance areas using volume profile analysis',
    phase: 'Phase 3.8',
    status: 'active',
    winRate: 62.4,
    profitLoss: 13560,
    trades: 142,
    riskReward: 1.88,
    maxDrawdown: 5.2,
    category: 'breakout',
    signals: [],
    isActive: true
  },
  {
    id: uuidv4(),
    name: 'Low Volume Nodes (LVNs)',
    description: 'Exploits rapid price movement through low volume areas and gap-filling scenarios',
    phase: 'Phase 3.9',
    status: 'testing',
    winRate: 59.3,
    profitLoss: 4680,
    trades: 76,
    riskReward: 1.55,
    maxDrawdown: 7.1,
    category: 'momentum',
    signals: [],
    isActive: false
  },
  {
    id: uuidv4(),
    name: 'Cumulative Delta Confirmation',
    description: 'Uses cumulative delta analysis for trend confirmation and reversal identification',
    phase: 'Phase 3.10',
    status: 'active',
    winRate: 69.2,
    profitLoss: 10150,
    trades: 134,
    riskReward: 1.82,
    maxDrawdown: 4.1,
    category: 'momentum',
    signals: [],
    isActive: true
  }
];

// Real-time data simulation
export class TradingDataSimulator {
  private callbacks: ((data: MarketData) => void)[] = [];
  private interval: NodeJS.Timeout | null = null;
  private currentPrice = 4200;
  private cumulativeDelta = 0;

  subscribe(callback: (data: MarketData) => void) {
    this.callbacks.push(callback);
    console.log('Trading data subscriber added');
  }

  unsubscribe(callback: (data: MarketData) => void) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
    console.log('Trading data subscriber removed');
  }

  start() {
    if (this.interval) return;
    
    console.log('Starting trading data simulation');
    this.interval = setInterval(() => {
      const priceChange = (Math.random() - 0.5) * 2;
      this.currentPrice += priceChange;
      
      const baseVolume = 800 + Math.random() * 400;
      const aggBuyVolume = baseVolume * (0.3 + Math.random() * 0.4);
      const aggSellVolume = baseVolume - aggBuyVolume;
      const delta = aggBuyVolume - aggSellVolume;
      this.cumulativeDelta += delta;

      const marketData: MarketData = {
        timestamp: new Date(),
        price: this.currentPrice,
        volume: baseVolume,
        bid: this.currentPrice - 0.5,
        ask: this.currentPrice + 0.5,
        delta,
        cumulativeDelta: this.cumulativeDelta,
        aggBuyVolume,
        aggSellVolume
      };

      this.callbacks.forEach(callback => callback(marketData));
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('Trading data simulation stopped');
    }
  }
}

export const dataSimulator = new TradingDataSimulator();