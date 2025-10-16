export interface DashboardStats {
  totalTrades: number;
  activeStrategies: number;
  totalBrokers: number;
  portfolioValue: number;
  todayPnL: number;
  winRate: number;
  totalStrategies: number;
  completedStrategies: number;
  backtestedStrategies: number;
}

export interface DashboardStrategy {
  _id: string;
  name: string;
  type: 'time_based' | 'indicator_based';
  status: 'active' | 'paused' | 'stopped' | 'draft' | 'completed' | 'backtested';
  instruments: Array<{
    symbol: string;
    name?: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardActivity {
  id: string;
  type: 'trade' | 'backtest' | 'system';
  message: string;
  details: string;
  status: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
}

export interface DashboardBroker {
  _id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats | null;
  strategies: DashboardStrategy[];
  activities: DashboardActivity[];
  brokers: DashboardBroker[];
  loading: boolean;
  error: string | null;
}
