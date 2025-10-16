import { useState, useEffect } from 'react';
import axios from 'axios';
// @ts-ignore
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://localhost:4000/api';

export const useProfileApi = () => {
  const [profileData, setProfileData] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookies.get('token');

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setProfileData(response.data.user);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch referrals
  const fetchReferrals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/referrals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setReferrals(response.data.referrals);
      }
    } catch (err) {
      console.error('Error fetching referrals:', err);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  // Fetch subscriptions
  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSubscriptions(response.data.subscriptions);
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    }
  };

  // Update profile
  const updateProfile = async (updateData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setProfileData(response.data.user);
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to update profile' 
      };
    }
  };

  // Load all data
  const loadAllData = async () => {
    await Promise.all([
      fetchProfile(),
      fetchReferrals(),
      fetchNotifications(),
      fetchSubscriptions()
    ]);
  };

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  return {
    profileData,
    referrals,
    notifications,
    subscriptions,
    loading,
    error,
    updateProfile,
    refetch: loadAllData
  };
};
