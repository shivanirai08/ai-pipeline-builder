// BaseNode.js
// A flexible, reusable node component that accepts configuration

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Trash2 } from 'lucide-react';
import { useStore } from '../store';

export const BaseNode = ({ id, data, config, selected }) => {
  const onNodesChange = useStore((state) => state.onNodesChange);

  // Initialize state for all fields defined in config
  const [fieldValues, setFieldValues] = useState(() => {
    const initialState = {};
    config.fields?.forEach(field => {
      initialState[field.name] = data?.[field.name] || field.defaultValue || '';
    });
    return initialState;
  });

  // Delete node handler
  const handleDelete = () => {
    onNodesChange([{ id, type: 'remove' }]);
  };

  // Handle field value changes
  const handleFieldChange = (fieldName, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Render a single field based on its type
  const renderField = (field) => {
    const value = fieldValues[field.name];

    const baseInputClass = "w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-md bg-[#F9FAFB] text-[#111827] placeholder-[#6B7280] focus:border-[#3B82F6] focus:outline-none transition-colors";

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseInputClass}
          >
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className={`${baseInputClass} resize-none`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            className={baseInputClass}
          />
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleFieldChange(field.name, e.target.checked)}
            className="w-4 h-4 text-[#3B82F6] border-[#E5E7EB] rounded focus:ring-[#3B82F6]"
          />
        );

      default:
        return null;
    }
  };

  // Render handles based on configuration
  const renderHandles = () => {
    if (!config.handles) return null;

    return config.handles.map((handle, index) => {
      // Set color based on handle type: green for input (target), orange for output (source)
      const handleColor = handle.type === 'target' ? '#10B981' : '#F59E0B';
      
      return (
        <Handle
          key={`${handle.type}-${handle.id || index}`}
          type={handle.type} // 'source' or 'target'
          position={handle.position || (handle.type === 'source' ? Position.Right : Position.Left)}
          id={`${id}-${handle.id || index}`}
          className={`w-2.5 h-2.5 border-2 border-white`}
          style={{ 
            backgroundColor: handleColor,
            ...handle.style 
          }}
          title={handle.label || ''}
        />
      );
    });
  };

  // Get icon color based on config
  const iconColor = config.iconColor || config.borderColor || '#3B82F6';

  return (
    <div
      className={`bg-white border rounded-xl shadow-md transition-shadow ${selected ? 'border-[#3B82F6] shadow-lg' : 'border-[#E5E7EB]'}`}
      style={{
        minWidth: config.minWidth || 280,
        width: config.width || 280,
        minHeight: config.minHeight || 120
      }}
    >
      {/* Render all handles */}
      {renderHandles()}

      {/* Header Section */}
      {config.title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-center gap-2">
            {config.Icon && <config.Icon size={16} strokeWidth={2} style={{ color: iconColor }} />}
            <span className="font-semibold text-sm text-[#111827]">{config.title}</span>
          </div>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-[#FEE2E2] rounded transition-colors"
            aria-label="Delete node"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      )}

      {/* Body Section */}
      <div className="p-4 space-y-3">
        {/* Node description/subtitle */}
        {config.description && (
          <div className="text-xs text-[#6B7280] -mt-1 mb-1">
            {config.description}
          </div>
        )}

        {/* Render all fields */}
        {config.fields && config.fields.map(field => {
          // Show variable name as label for auto-created inputs (e.g., "age:" instead of "Name:")
          let displayLabel = field.label;
          if (field.name === 'inputName') {
            const value = data?.inputName || fieldValues[field.name];
            if (data?.inputName && value && value !== field.defaultValue) {
              displayLabel = `${value}:`;
            }
          }

          return (
            <div key={field.name}>
              {displayLabel && (
                <label className="block text-xs font-medium text-[#6B7280] mb-1">
                  {displayLabel}
                </label>
              )}
              {renderField(field)}
            </div>
          );
        })}

        {/* Custom content area */}
        {config.content && (
          <div>
            {config.content}
          </div>
        )}
      </div>
    </div>
  );
};
