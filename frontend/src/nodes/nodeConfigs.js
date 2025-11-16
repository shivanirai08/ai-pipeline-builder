// nodeConfigs.js
// Declarative node configurations - adding a new node is now just defining a config object.

import { Position } from 'reactflow';
import { FileInput, Brain, FileOutput, Type, Filter, Shuffle, GitBranch, BarChart3, Globe } from 'lucide-react';

export const inputNodeConfig = {
  title: 'Input',
  Icon: FileInput,
  iconColor: '#10B981',
  borderColor: '#10B981',
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
  Icon: FileOutput,
  iconColor: '#F59E0B',
  borderColor: '#F59E0B',
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
  Icon: Brain,
  description: 'Large Language Model',
  iconColor: '#8B5CF6',
  borderColor: '#8B5CF6',
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
  Icon: Type,
  iconColor: '#3B82F6',
  borderColor: '#3B82F6',
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

// 5 ADDITIONAL NODE CONFIGURATIONS

// 1. Filter Node - Filters data based on conditions
export const filterNodeConfig = {
  title: 'Filter',
  Icon: Filter,
  description: 'Filter data based on conditions',
  iconColor: '#02551bff',
  borderColor: '#02551bff',
  width: 280,
  minHeight: 140,
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
  Icon: Shuffle,
  description: 'Transform data',
  iconColor: '#f64e3bff',
  borderColor: '#f64e3bff',
  width: 280,
  minHeight: 130,
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
  Icon: GitBranch,
  description: 'If/Else branching logic',
  iconColor: '#f63bd7ff',
  borderColor: '#f63bd7ff',
  width: 280,
  minHeight: 150,
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
  Icon: BarChart3,
  description: 'Combine multiple inputs',
  iconColor: '#cedb18ff',
  borderColor: '#cedb18ff',
  width: 280,
  minHeight: 160,
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
  Icon: Globe,
  description: 'External API request',
  iconColor: '#401eebff',
  borderColor: '#401eebff',
  width: 280,
  minHeight: 180,
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
