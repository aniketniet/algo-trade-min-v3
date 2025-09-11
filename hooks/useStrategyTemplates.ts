import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getErrorMessage } from '../utils/errorMessages';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://103.189.173.82:4000/api';

export interface StrategyTemplate {
  _id: string;
  templateName: string;
  description?: string;
  category: 'Time Based' | 'Indicator Based' | 'Custom';
  isPublic: boolean;
  tags?: string[];
  strategyType: 'Time Based' | 'Indicator Based';
  instruments: string[];
  orderType: 'MIS' | 'CNC' | 'BTST';
  startTime: string;
  squareOffTime: string;
  noTradeAfter: string;
  tradeDays: string[];
  riskManagement: {
    exitWhenProfit: number;
    exitWhenLoss: number;
  };
  profitTrailing: string;
  trailingConfig: {
    lockProfitAt?: number;
    trailProfitBy?: number;
    everyIncrease?: number;
  };
  legs: any[];
  longEntryConditions?: any[];
  shortEntryConditions?: any[];
  exitConditions?: any[];
  useCombinedChart?: boolean;
  transactionType?: string;
  chartType?: string;
  interval?: string;
  maxTradeCycle?: string;
  usageCount: number;
  lastUsed?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplatePayload {
  templateName: string;
  description?: string;
  category: 'Time Based' | 'Indicator Based' | 'Custom';
  isPublic?: boolean;
  tags?: string[];
  strategyType: 'Time Based' | 'Indicator Based';
  instruments: string[];
  orderType: 'MIS' | 'CNC' | 'BTST';
  startTime: string;
  squareOffTime: string;
  noTradeAfter?: string;
  tradeDays: string[];
  riskManagement: {
    exitWhenProfit: number;
    exitWhenLoss: number;
  };
  profitTrailing: string;
  trailingConfig: {
    lockProfitAt?: number;
    trailProfitBy?: number;
    everyIncrease?: number;
  };
  legs: any[];
  longEntryConditions?: any[];
  shortEntryConditions?: any[];
  exitConditions?: any[];
  useCombinedChart?: boolean;
  transactionType?: string;
  chartType?: string;
  interval?: string;
  maxTradeCycle?: string;
}

export const useStrategyTemplates = () => {
  const [templates, setTemplates] = useState<StrategyTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const fetchTemplates = async (page = 1, limit = 10, category?: string, search?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const response = await axios.get(`${API_BASE_URL}/user/templates?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setTemplates(response.data.data);
      setPagination({
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        pages: response.data.meta.pages
      });
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicTemplates = async (page = 1, limit = 10, category?: string, search?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const response = await axios.get(`${API_BASE_URL}/user/templates/public?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setTemplates(response.data.data);
      setPagination({
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        pages: response.data.meta.pages
      });
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (payload: CreateTemplatePayload) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.post(`${API_BASE_URL}/user/templates`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (templateId: string, payload: CreateTemplatePayload) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.put(`${API_BASE_URL}/user/templates/${templateId}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (templateId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.delete(`${API_BASE_URL}/user/templates/${templateId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTemplateById = async (templateId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${API_BASE_URL}/user/templates/${templateId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const useTemplate = async (templateId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.post(`${API_BASE_URL}/user/templates/${templateId}/use`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    templates,
    loading,
    error,
    pagination,
    fetchTemplates,
    fetchPublicTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplateById,
    useTemplate,
    resetError: () => setError(null)
  };
};
