// hooks/useStrategyApi.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://103.189.173.82:4000/api';

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
  longEntryConditions?: any[];
  shortEntryConditions?: any[];
  exitConditions?: any[];
  useCombinedChart?: boolean;
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

      const response = await axios.post(`${API_BASE_URL}/user/strategies`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save strategy';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveStrategyData,
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
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${API_BASE_URL}/user/my-strategies`, {
        params: { page, limit },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setStrategies(response.data.data);
      setPagination({
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        pages: response.data.meta.pages
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch strategies');
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