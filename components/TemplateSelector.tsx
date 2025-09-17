import React, { useState, useEffect } from 'react';
import { Search, Star, Clock, Users, Copy, Eye } from 'lucide-react';
import { useStrategyTemplates, StrategyTemplate } from '../hooks/useStrategyTemplates';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: StrategyTemplate) => void;
  strategyType?: 'Time Based' | 'Indicator Based';
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  strategyType
}) => {
  const [activeTab, setActiveTab] = useState<'my' | 'public'>('my');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const {
    templates,
    loading,
    error,
    pagination,
    fetchTemplates,
    fetchPublicTemplates,
    useTemplate
  } = useStrategyTemplates();

  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'my') {
        fetchTemplates(1, 20, selectedCategory, searchTerm);
      } else {
        fetchPublicTemplates(1, 20, selectedCategory, searchTerm);
      }
    }
  }, [isOpen, activeTab, selectedCategory, searchTerm]);

  const handleSelectTemplate = async (template: StrategyTemplate) => {
    try {
      await useTemplate(template._id);
      onSelectTemplate(template);
      onClose();
    } catch (error) {
      console.error('Error using template:', error);
    }
  };

  const filteredTemplates = templates.filter(template => {
    if (strategyType && template.strategyType !== strategyType) {
      return false;
    }
    return true;
  });

  const categories = ['Time Based', 'Indicator Based', 'Custom'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Select Strategy Template</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'my'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              My Templates
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'public'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Public Templates
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading templates...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  if (activeTab === 'my') {
                    fetchTemplates(1, 20, selectedCategory, searchTerm);
                  } else {
                    fetchPublicTemplates(1, 20, selectedCategory, searchTerm);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No templates found matching your criteria.</p>
              {activeTab === 'my' && (
                <p className="text-sm mt-2">Create your first template to get started!</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{template.templateName}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye className="w-3 h-3" />
                      {template.usageCount}
                    </div>
                  </div>
                  
                  {template.description && (
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {template.strategyType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {template.instruments.length} instruments
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {template.legs.length} legs
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags?.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags && template.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{template.tags.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  {/* <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      by {template.createdBy}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(template);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      Use Template
                    </button>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {pagination.total} templates found
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
