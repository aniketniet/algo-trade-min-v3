

"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api'; // Adjust the import path as necessary

const StrategyContext = createContext();

export const StrategyProvider = ({ children }) => {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStrategy, setCurrentStrategy] = useState(null);

  const fetchStrategies = async (params = {}) => {
    setLoading(true);
    try {
      const response = await api.getStrategies(params);
      setStrategies(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch strategies');
    } finally {
      setLoading(false);
    }
  };

  const createStrategy = async (strategyData) => {
    setLoading(true);
    try {
      const response = await api.createStrategy(strategyData);
      await fetchStrategies();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create strategy');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStrategy = async (id) => {
    setLoading(true);
    try {
      const response = await api.getStrategyById(id);
      setCurrentStrategy(response.data.data);
      setError(null);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch strategy');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStrategyStatus = async (id, status) => {
    setLoading(true);
    try {
      await api.updateStrategyStatus(id, status);
      await fetchStrategies();
      if (currentStrategy?._id === id) {
        setCurrentStrategy(prev => ({ ...prev, status }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update strategy status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <StrategyContext.Provider
      value={{
        strategies,
        currentStrategy,
        loading,
        error,
        fetchStrategies,
        createStrategy,
        getStrategy,
        updateStrategyStatus,
      }}
    >
      {children}
    </StrategyContext.Provider>
  );
};

export const useStrategies = () => useContext(StrategyContext);