import { useState, useEffect } from 'react';

interface InstrumentsData {
  categories?: {
    Options?: string[];
    Equity?: string[];
    Futures?: string[];
    Indices?: string[];
    MCX?: string[];
    CDS?: string[];
  };
}

export const useInstruments = () => {
  const [instrumentsData, setInstrumentsData] = useState<InstrumentsData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the same backend URL as other API calls
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://localhost:4000/api';

  const fetchInstruments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/instruments`);
      if (!response.ok) {
        throw new Error('Failed to fetch instruments');
      }
      
      const result = await response.json();
      setInstrumentsData(result.data);
    } catch (err) {
      console.error('Error fetching instruments:', err);
      setError('Failed to load instruments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchInstruments = async (query: string, category?: string) => {
    if (!query.trim()) {
      return [];
    }

    try {
      let url = `${API_BASE_URL}/auth/instruments/search?query=${encodeURIComponent(query)}`;
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to search instruments');
      }
      
      const result = await response.json();
      return result.data || [];
    } catch (err) {
      console.error('Error searching instruments:', err);
      return [];
    }
  };

  const getInstrumentsByCategory = async (category: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/instruments/category/${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch instruments by category');
      }
      
      const result = await response.json();
      return result.data || [];
    } catch (err) {
      console.error('Error fetching instruments by category:', err);
      return [];
    }
  };

  // Get instruments for a specific category from cached data
  const getCurrentCategoryInstruments = (category: string): string[] => {
    if (!instrumentsData.categories) return [];
    
    switch (category) {
      case "Options":
        return instrumentsData.categories.Options || [];
      case "Equity":
        return instrumentsData.categories.Equity || [];
      case "Futures":
        return instrumentsData.categories.Futures || [];
      case "Indices":
        return instrumentsData.categories.Indices || [];
      case "MCX":
        return instrumentsData.categories.MCX || [];
      case "CDS":
        return instrumentsData.categories.CDS || [];
      default:
        return [];
    }
  };

  // Get all available categories
  const getAvailableCategories = (): string[] => {
    if (!instrumentsData.categories) return [];
    
    return Object.keys(instrumentsData.categories).filter(
      category => (instrumentsData.categories as any)[category]?.length > 0
    );
  };

  return {
    instrumentsData,
    loading,
    error,
    fetchInstruments,
    searchInstruments,
    getInstrumentsByCategory,
    getCurrentCategoryInstruments,
    getAvailableCategories
  };
};
