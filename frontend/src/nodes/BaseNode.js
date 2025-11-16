// BaseNode.js
// A flexible, reusable node component that accepts configuration

import { useState } from 'react';
import { Handle, Position } from 'reactflow';

export const BaseNode = ({ id, data, config }) => {
  // Initialize state for all fields defined in config
  const [fieldValues, setFieldValues] = useState(() => {
    const initialState = {};
    config.fields?.forEach(field => {
      initialState[field.name] = data?.[field.name] || field.defaultValue || '';
    });
    return initialState;
  });

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

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            style={{ width: '100%', ...field.style }}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            style={{ width: '100%', ...field.style }}
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
            style={{ width: '100%', resize: 'vertical', ...field.style }}
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
            style={{ width: '100%', ...field.style }}
          />
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleFieldChange(field.name, e.target.checked)}
            style={field.style}
          />
        );

      default:
        return null;
    }
  };

  // Render handles based on configuration
  const renderHandles = () => {
    if (!config.handles) return null;

    return config.handles.map((handle, index) => (
      <Handle
        key={`${handle.type}-${handle.id || index}`}
        type={handle.type} // 'source' or 'target'
        position={handle.position || (handle.type === 'source' ? Position.Right : Position.Left)}
        id={`${id}-${handle.id || index}`}
        style={handle.style || {}}
        title={handle.label || ''}
      />
    ));
  };

  // Default styles with ability to override
  const defaultStyle = {
    width: 200,
    height: 80,
    border: '1px solid black',
    padding: '10px',
    borderRadius: '5px',
    background: 'white',
  };

  const nodeStyle = {
    ...defaultStyle,
    ...config.style,
    ...(config.dynamicHeight && fieldValues[config.dynamicHeight.field]
      ? { height: 'auto', minHeight: 80 }
      : {})
  };

  return (
    <div style={nodeStyle}>
      {/* Render all handles */}
      {renderHandles()}

      {/* Node title/header */}
      {config.title && (
        <div style={{
          fontWeight: 'bold',
          marginBottom: '8px',
          fontSize: '14px',
          ...config.titleStyle
        }}>
          {config.title}
        </div>
      )}

      {/* Node description/subtitle */}
      {config.description && (
        <div style={{
          fontSize: '11px',
          color: '#666',
          marginBottom: '8px',
          ...config.descriptionStyle
        }}>
          {config.description}
        </div>
      )}

      {/* Render all fields */}
      {config.fields && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {config.fields.map(field => {
            // Use the field's current value as label if it's 'inputName' (for auto-created Input nodes)
            const fieldValue = fieldValues[field.name];
            const displayLabel = field.name === 'inputName' && fieldValue
              ? `${fieldValue}:`
              : field.label;

            return (
              <div key={field.name}>
                {displayLabel && (
                  <label style={{
                    fontSize: '11px',
                    display: 'block',
                    marginBottom: '2px',
                    fontWeight: '500'
                  }}>
                    {displayLabel}
                  </label>
                )}
                {renderField(field)}
              </div>
            );
          })}
        </div>
      )}

      {/* Custom content area */}
      {config.content && (
        <div style={config.contentStyle}>
          {config.content}
        </div>
      )}
    </div>
  );
};
