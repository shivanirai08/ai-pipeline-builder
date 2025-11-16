// draggableNode.js

import { FileInput, Brain, FileOutput, Type, Filter, Shuffle, GitBranch, BarChart3, Globe } from 'lucide-react';

const iconMap = {
  customInput: FileInput,
  llm: Brain,
  customOutput: FileOutput,
  text: Type,
  filter: Filter,
  transform: Shuffle,
  condition: GitBranch,
  aggregate: BarChart3,
  api: Globe,
};

const colorMap = {
  customInput: '#10B981',
  llm: '#8B5CF6',
  customOutput: '#F59E0B',
  text: '#3B82F6',
  filter: '#02551bff',
  transform: '#f64e3bff',
  condition: '#f63bd7ff',
  aggregate: '#cedb18ff',
  api: '#401eebff',
};

export const DraggableNode = ({ type, label }) => {
    const Icon = iconMap[type];
    const iconColor = colorMap[type];

    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    return (
      <div
        className="cursor-grab flex items-center gap-2 py-2 px-4 rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors duration-200"
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable
      >
          {Icon && <Icon size={16} strokeWidth={2} style={{ color: iconColor }} />}
          <span className="text-sm font-medium text-[#111827]">{label}</span>
      </div>
    );
  };
