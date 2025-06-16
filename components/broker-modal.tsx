import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const BrokerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [formData, setFormData] = useState({});
  const [brokers, setBrokers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const  token = Cookies.get('token');

  // Fetch brokers from API
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:4000/api/user/brokers', {
          headers: {
            'Authorization': 'Bearer ' + token,
          }
        });
        setBrokers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchBrokers();
    }
  }, [isOpen]);

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleFileChange = async (fieldName, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('brokerId', selectedBroker._id);
    formData.append('fieldId', fieldName);

    try {
      const response = await axios.post(
        'http://localhost:4000/api/user/submissions',
        formData,
        {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setFormData(prev => ({
        ...prev,
        [fieldName]: response.data.fileUrl // Assuming API returns file URL
      }));
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  const handleBrokerSelect = (broker) => {
    setSelectedBroker(broker);
    setFormData({});
  };

  const handleSubmit = async () => {
    try {
      const formPayload = new FormData();
      formPayload.append('brokerId', selectedBroker._id);
      
      // Append all fields to the form data
      Object.entries(formData).forEach(([fieldId, value]) => {
        if (value instanceof File) {
          formPayload.append('file', value);
          formPayload.append('fieldId', fieldId);
        } else {
          formPayload.append('fieldId', fieldId);
          formPayload.append('value', value);
        }
      });

      await axios.post('http://localhost:4000/api/user/submissions', formPayload, {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODRmYzYyYzgyYjU3NDYyZTE2NjUyMTYiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1MDA1ODU1MiwiZXhwIjoxNzUwNjYzMzUyfQ.pIaIN4yvK-X-_6xYE5u9d6Mnsnkzf3WVO4mL33VO4X4',
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsOpen(false);
      setSelectedBroker(null);
      setFormData({});
      alert('Broker submitted successfully!');
    } catch (err) {
      console.error('Error submitting broker:', err);
      alert('Failed to submit broker. Please try again.');
    }
  };

  const handleBack = () => {
    setSelectedBroker(null);
    setFormData({});
  };

  // Map API broker data to our expected format
  const getBrokerLogo = (brokerName) => {
    const logos = {
      'Home Insurance': '🏠',
      'Up Stock': '📈',
      'Upstock': '🔺',
      'satish': '👤'
    };
    return logos[brokerName] || '📊';
  };

  const getBrokerColor = (brokerName) => {
    const colors = {
      'Home Insurance': 'bg-green-500',
      'Up Stock': 'bg-purple-500',
      'Upstock': 'bg-blue-500',
      'satish': 'bg-yellow-500'
    };
    return colors[brokerName] || 'bg-gray-500';
  };

  return (
    <div className="p-8">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Broker
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                {selectedBroker && (
                  <button
                    onClick={handleBack}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ←
                  </button>
                )}
                <h2 className="text-xl font-semibold">
                  {selectedBroker ? `Add ${selectedBroker.name}` : 'Add new broker'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedBroker(null);
                  setFormData({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex h-[calc(90vh-80px)]">
              {/* Left side - Broker Selection */}
              <div className="w-1/2 p-6 border-r overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center p-4">{error}</div>
                ) : (
                  <>
                    <div className="mb-6">
                      <input
                        type="text"
                        placeholder="Search Brokers"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Available Brokers</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {brokers.map((broker) => (
                        <button
                          key={broker._id}
                          onClick={() => handleBrokerSelect(broker)}
                          className={`flex flex-col items-center p-4 border rounded-lg transition-all ${
                            selectedBroker?._id === broker._id 
                              ? 'border-blue-500 bg-blue-50 shadow-md' 
                              : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full ${getBrokerColor(broker.name)} flex items-center justify-center text-white text-lg mb-2`}>
                            {getBrokerLogo(broker.name)}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{broker.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Right side - Form or Empty State */}
              <div className="w-1/2 p-6 overflow-y-auto">
                {!selectedBroker ? (
                  // Empty state with placeholder image
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Broker</h3>
                    <p className="text-gray-500">Choose a broker from the left to configure your connection</p>
                  </div>
                ) : (
                  // Broker Form
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-12 h-12 rounded-full ${getBrokerColor(selectedBroker.name)} flex items-center justify-center text-white text-lg`}>
                        {getBrokerLogo(selectedBroker.name)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedBroker.name}</h3>
                        <p className="text-sm text-blue-600 cursor-pointer">How to add {selectedBroker.name} broker? →</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {selectedBroker.fields.map((field) => (
                        <div key={field._id}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          {field.type === 'file' ? (
                            <div>
                              <input
                                type="file"
                                onChange={(e) => handleFileChange(field.name, e.target.files[0])}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {formData[field.name] && (
                                <p className="text-sm text-green-600 mt-1">File uploaded successfully</p>
                              )}
                            </div>
                          ) : (
                            <input
                              type={field.type}
                              placeholder={field.placeholder}
                              value={formData[field.name] || ''}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required={field.required}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className={`w-full mt-6 ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 rounded-lg font-medium`}
                    >
                      {isLoading ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrokerModal;