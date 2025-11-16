// nodeConfigs.js
// Declarative node configurations - adding a new node is now just defining a config object.
// This demonstrates the power and flexibility of the BaseNode abstraction

import { Position } from 'reactflow';

export const inputNodeConfig = {
  title: 'Input',
  fields: [
    {
      name: 'inputName',
      type: 'text',
      label: 'Name:',
      defaultValue: 'input',
      placeholder: 'Enter input name'
    },
    {
      name: 'inputType',
      type: 'select',
      label: 'Type:',
      defaultValue: 'Text',
      options: [
        { value: 'Text', label: 'Text' },
        { value: 'File', label: 'File' }
      ]
    }
  ],
  handles: [
    {
      type: 'source',
      position: Position.Right,
      id: 'value'
    }
  ]
};

export const outputNodeConfig = {
  title: 'Output',
  fields: [
    {
      name: 'outputName',
      type: 'text',
      label: 'Name:',
      defaultValue: 'output',
      placeholder: 'Enter output name'
    },
    {
      name: 'outputType',
      type: 'select',
      label: 'Type:',
      defaultValue: 'Text',
      options: [
        { value: 'Text', label: 'Text' },
        { value: 'Image', label: 'Image' }
      ]
    }
  ],
  handles: [
    {
      type: 'target',
      position: Position.Left,
      id: 'value'
    }
  ]
};

export const llmNodeConfig = {
  title: 'LLM',
  description: 'This is a LLM.',
  handles: [
    {
      type: 'target',
      position: Position.Left,
      id: 'system',
      style: { top: '33%' },
      label: 'System'
    },
    {
      type: 'target',
      position: Position.Left,
      id: 'prompt',
      style: { top: '67%' },
      label: 'Prompt'
    },
    {
      type: 'source',
      position: Position.Right,
      id: 'response',
      label: 'Response'
    }
  ]
};

export const textNodeConfig = {
  title: 'Text',
  fields: [
    {
      name: 'text',
      type: 'text',
      label: 'Text:',
      defaultValue: '{{input}}',
      placeholder: 'Enter text with {{variables}}'
    }
  ],
  handles: [
    {
      type: 'source',
      position: Position.Right,
      id: 'output'
    }
  ]
};

// 5 NEW NODE CONFIGURATIONS

// 1. Filter Node - Filters data based on conditions
export const filterNodeConfig = {
  title: 'Filter',
  description: 'Filter data based on conditions',
  style: {
    width: 220,
    height: 140,
    background: '#f0f9ff'
  },
  fields: [
    {
      name: 'condition',
      type: 'select',
      label: 'Condition:',
      defaultValue: 'equals',
      options: [
        { value: 'equals', label: 'Equals' },
        { value: 'contains', label: 'Contains' },
        { value: 'greater_than', label: 'Greater Than' },
        { value: 'less_than', label: 'Less Than' }
      ]
    },
    {
      name: 'value',
      type: 'text',
      label: 'Value:',
      defaultValue: '',
      placeholder: 'Filter value'
    }
  ],
  handles: [
    {
      type: 'target',
      position: Position.Left,
      id: 'input',
      label: 'Input'
    },
    {
      type: 'source',
      position: Position.Right,
      id: 'passed',
      style: { top: '40%' },
      label: 'Passed'
    },
    {
      type: 'source',
      position: Position.Right,
      id: 'failed',
      style: { top: '60%' },
      label: 'Failed'
    }
  ]
};

// 2. Transform Node - Transforms/processes data
export const transformNodeConfig = {
  title: 'Transform',
  description: 'Transform data',
  style: {
    width: 220,
    height: 130,
    background: '#fef3c7'
  },
  fields: [
    {
      name: 'operation',
      type: 'select',
      label: 'Operation:',
      defaultValue: 'uppercase',
      options: [
        { value: 'uppercase', label: 'To Uppercase' },
        { value: 'lowercase', label: 'To Lowercase' },
        { value: 'trim', label: 'Trim Whitespace' },
        { value: 'reverse', label: 'Reverse' },
        { value: 'length', label: 'Get Length' }
      ]
    }
  ],
  handles: [
    {
      type: 'target',
      position: Position.Left,
      id: 'input',
      label: 'Input'
    },
    {
      type: 'source',
      position: Position.Right,
      id: 'output',
      label: 'Output'
    }
  ]
};

// 3. Condition Node - Branching logic (if/else)
export const conditionNodeConfig = {
  title: 'Condition',
  description: 'If/Else branching logic',
  style: {
    width: 240,
    height: 150,
    background: '#fce7f3'
  },
  fields: [
    {
      name: 'condition',
      type: 'text',
      label: 'Condition:',
      defaultValue: '',
      placeholder: 'e.g., value > 10'
    }
  ],
  handles: [
    {
      type: 'target',
      position: Position.Left,
      id: 'input',
      label: 'Input'
    },
    {
      type: 'source',
      position: Position.Right,
      id: 'true',
      style: { top: '40%' },
      label: 'True'
    },
    {
      type: 'source',
      position: Position.Right,
      id: 'false',
      style: { top: '60%' },
      label: 'False'
    }
  ]
};

// 4. Aggregate Node - Combines multiple inputs
export const aggregateNodeConfig = {
  title: 'Aggregate',
  description: 'Combine multiple inputs',
  style: {
    width: 220,
    height: 160,
    background: '#e0e7ff'
  },
  fields: [
    {
      name: 'operation',
      type: 'select',
      label: 'Operation:',
      defaultValue: 'concat',
      options: [
        { value: 'concat', label: 'Concatenate' },
        { value: 'sum', label: 'Sum' },
        { value: 'average', label: 'Average' },
        { value: 'merge', label: 'Merge Objects' }
      ]
    },
    {
      name: 'separator',
      type: 'text',
      label: 'Separator:',
      defaultValue: ', ',
      placeholder: 'For concat'
    }
  ],
  handles: [
    {
      type: 'target',
      position: Position.Left,
      id: 'input1',
      style: { top: '25%' },
      label: 'Input 1'
    },
    {
      type: 'target',
      position: Position.Left,
      id: 'input2',
      style: { top: '50%' },
      label: 'Input 2'
    },
    {
      type: 'target',
      position: Position.Left,
      id: 'input3',
      style: { top: '75%' },
      label: 'Input 3'
    },
    {
      type: 'source',
      position: Position.Right,
      id: 'output',
      label: 'Result'
    }
  ]
};

// 5. API Node - Makes external API calls
export const apiNodeConfig = {
  title: 'API Call',
  description: 'External API request',
  style: {
    width: 240,
    height: 180,
    background: '#d1fae5'
  },
  fields: [
    {
      name: 'method',
      type: 'select',
      label: 'Method:',
      defaultValue: 'GET',
      options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' }
      ]
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL:',
      defaultValue: '',
      placeholder: 'https://api.example.com'
    },
    {
      name: 'timeout',
      type: 'number',
      label: 'Timeout (ms):',
      defaultValue: 5000,
      min: 100,
      max: 30000,
      step: 100
    }
  ],
  handles: [
    {
      type: 'target',
      position: Position.Left,
      id: 'body',
      style: { top: '40%' },
      label: 'Body'
    },
    {
      type: 'source',
      position: Position.Right,
      id: 'response',
      style: { top: '40%' },
      label: 'Response'
    },
    {
      type: 'source',
      position: Position.Right,
      id: 'error',
      style: { top: '60%' },
      label: 'Error'
    }
  ]
};

// Export all configs as a map for easy access
export const nodeConfigs = {
  customInput: inputNodeConfig,
  customOutput: outputNodeConfig,
  llm: llmNodeConfig,
  text: textNodeConfig,
  filter: filterNodeConfig,
  transform: transformNodeConfig,
  condition: conditionNodeConfig,
  aggregate: aggregateNodeConfig,
  api: apiNodeConfig
};
