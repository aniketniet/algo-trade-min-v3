import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://localhost:4000/api';

export const useRiskDisclaimer = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user has accepted risk disclaimer
  const checkRiskDisclaimerStatus = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const user = response.data.user;
        // Show modal only if user hasn't accepted the disclaimer
        setShowModal(!user.risk_disclaimer_accepted);
      }
    } catch (error) {
      console.error('Error checking risk disclaimer status:', error);
      setError('Failed to check risk disclaimer status');
      // If there's an error, don't show the modal to avoid blocking the user
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  // Update risk disclaimer acceptance
  const acceptRiskDisclaimer = async () => {
    try {
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        `${API_BASE_URL}/auth/risk-disclaimer`,
        { accepted: true },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setShowModal(false);
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to update risk disclaimer acceptance');
      }
    } catch (error) {
      console.error('Error accepting risk disclaimer:', error);
      setError('Failed to accept risk disclaimer');
      return false;
    }
  };

  useEffect(() => {
    checkRiskDisclaimerStatus();
  }, []);

  return {
    showModal,
    loading,
    error,
    acceptRiskDisclaimer,
    checkRiskDisclaimerStatus
  };
};
