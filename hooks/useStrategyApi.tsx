// hooks/useStrategyApi.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getErrorMessage } from '../utils/errorMessages';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://localhost:4000/api';

type StrategyPayload = {
  strategyName: string;
  strategyType: "Time Based" | "Indicator Based";
  instruments: string[];
  orderType: string;
  startTime: string;
  squareOffTime: string;
  noTradeAfter: string;
  tradeDays: string[];
  riskManagement: {
    exitWhenProfit: number;
    exitWhenLoss: number;
  };
  profitTrailing: string;
  trailingConfig: Record<string, any>;
  legs: any[];
  mode: string;
  longEntryConditions?: any[];
  shortEntryConditions?: any[];
  exitConditions?: any[];
  useCombinedChart?: boolean;
  transactionType?: string;
  chartType?: string;
  interval?: string;
  maxTradeCycle?: string;
};

export const useStrategyApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveStrategyData = async (payload: StrategyPayload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get('token');
    
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('Sending strategy payload:', payload);

      const response = await axios.post(`${API_BASE_URL}/strategies`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Strategy creation response:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('Strategy creation error:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStrategyData = async (strategyId: string, payload: StrategyPayload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get('token');
    
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('Updating strategy payload:', payload);

      const response = await axios.put(`${API_BASE_URL}/strategies/${strategyId}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Strategy update response:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('Strategy update error:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveStrategyData,
    updateStrategyData,
    isLoading,
    error,
    resetError: () => setError(null)
  };
};



//getStrategies
export const useStrategiesList = () => {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    pages: 1
  });

  const fetchStrategies = async (page = 1, limit = 5) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get('token');
      console.log('🔍 Fetching strategies with token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('📡 Making request to:', `${API_BASE_URL}/strategies`);
      const response = await axios.get(`${API_BASE_URL}/strategies`, {
        params: { page, limit },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📊 Strategy API Response:', response.data);
      console.log('📊 Strategies data:', response.data.data?.strategies);
      console.log('📊 Pagination data:', response.data.data?.pagination);

      setStrategies(response.data.data.strategies || []);
      setPagination({
        page: response.data.data.pagination?.current || 1,
        limit: response.data.data.pagination?.limit || 10,
        total: response.data.data.pagination?.total || 0,
        pages: response.data.data.pagination?.pages || 1
      });
    } catch (err: any) {
      console.error('❌ Error fetching strategies:', err);
      console.error('❌ Error response:', err.response?.data);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  return {
    strategies,
    loading,
    error,
    pagination,
    refetch: fetchStrategies
  };
};