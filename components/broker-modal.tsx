import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const BrokerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [formData, setFormData] = useState({});

  const brokers = [
    {
      id: 'xts',
      name: 'XTS',
      logo: '🔸',
      color: 'bg-orange-500',
      fields: [
        { name: 'brokerId', label: 'Enter Broker ID', type: 'text', placeholder: 'Enter your broker ID' },
        { name: 'appName', label: 'App Name (Any)', type: 'text', placeholder: 'Enter app name' },
        { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Enter your API key' },
        { name: 'apiSecret', label: 'API Secret Key', type: 'password', placeholder: 'Enter your API secret key' }
      ]
    },
    {
      id: 'zerodha',
      name: 'Zerodha',
      logo: '📊',
      color: 'bg-red-500',
      fields: [
        { name: 'userId', label: 'User ID', type: 'text', placeholder: 'Enter your user ID' },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
        { name: 'pin', label: 'PIN', type: 'password', placeholder: 'Enter your PIN' },
        { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Enter your API key' }
      ]
    },
    {
      id: 'upstox',
      name: 'Upstox',
      logo: '🔺',
      color: 'bg-purple-500',
      fields: [
        { name: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Enter your client ID' },
        { name: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'Enter your client secret' },
        { name: 'redirectUri', label: 'Redirect URI', type: 'text', placeholder: 'Enter redirect URI' }
      ]
    },
    {
      id: 'fyers',
      name: 'FYERS',
      logo: '🔷',
      color: 'bg-blue-500',
      fields: [
        { name: 'fyToken', label: 'FY Token', type: 'password', placeholder: 'Enter your FY token' },
        { name: 'appId', label: 'App ID', type: 'text', placeholder: 'Enter your app ID' },
        { name: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'Enter your access token' }
      ]
    },
    {
      id: 'angelone',
      name: 'Angel One',
      logo: '📈',
      color: 'bg-green-500',
      fields: [
        { name: 'clientCode', label: 'Client Code', type: 'text', placeholder: 'Enter your client code' },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
        { name: 'totp', label: 'TOTP', type: 'text', placeholder: 'Enter TOTP from authenticator' },
        { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Enter your API key' }
      ]
    },
    {
      id: 'dhan',
      name: 'Dhan',
      logo: '💰',
      color: 'bg-teal-500',
      fields: [
        { name: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Enter your client ID' },
        { name: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'Enter your access token' }
      ]
    }
  ];

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleBrokerSelect = (broker) => {
    setSelectedBroker(broker);
    setFormData({});
  };

  const handleSubmit = () => {
    console.log('Submitting:', { broker: selectedBroker.id, data: formData });
    setIsOpen(false);
    setSelectedBroker(null);
    setFormData({});
  };

  const handleBack = () => {
    setSelectedBroker(null);
    setFormData({});
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
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search Brokers"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <h3 className="text-sm font-medium text-gray-500 mb-4">Popular Brokers</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {brokers.map((broker) => (
                    <button
                      key={broker.id}
                      onClick={() => handleBrokerSelect(broker)}
                      className={`flex flex-col items-center p-4 border rounded-lg transition-all ${
                        selectedBroker?.id === broker.id 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full ${broker.color} flex items-center justify-center text-white text-lg mb-2`}>
                        {broker.logo}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{broker.name}</span>
                    </button>
                  ))}
                </div>
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
                      <div className={`w-12 h-12 rounded-full ${selectedBroker.color} flex items-center justify-center text-white text-lg`}>
                        {selectedBroker.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedBroker.name}</h3>
                        <p className="text-sm text-blue-600 cursor-pointer">How to add {selectedBroker.name} broker? →</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {selectedBroker.fields.map((field) => (
                        <div key={field.name}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>

                    {selectedBroker.id === 'xts' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Redirect Url: ℹ️
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value="https://web.algorooms.com/connect-broker"
                            readOnly
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                          <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">
                            📋
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                    >
                      Submit
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