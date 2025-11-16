// Text Node: Detects {{variables}}, auto-creates Input nodes, and dynamically resizes textarea

import { useState, useEffect, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { Type, Trash2 } from 'lucide-react';
import { useStore } from '../store';

export const TextNode = ({ id, data, selected }) => {
  const [currText, setCurrText] = useState(data?.text || '');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const createdNodesRef = useRef({});

  const updateNodeInternals = useUpdateNodeInternals();
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const addNode = useStore((state) => state.addNode);
  const getNodeID = useStore((state) => state.getNodeID);
  const onConnect = useStore((state) => state.onConnect);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);

  // Extract unique variables matching {{variableName}} pattern
  const extractVariables = (text) => {
    const regex = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
    const vars = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      vars.push(match[1]);
    }
    return [...new Set(vars)];
  };

  const getCurrentNode = () => nodes.find(node => node.id === id);

  // Detect variables and register handles with React Flow
  useEffect(() => {
    const detectedVars = extractVariables(currText);
    setVariables(detectedVars);
    setTimeout(() => updateNodeInternals(id), 0);
  }, [currText, id, updateNodeInternals]);

  // Auto-create Input nodes for detected variables
  useEffect(() => {
    const currentNode = getCurrentNode();
    if (!currentNode) return;

    variables.forEach((variable, index) => {
      if (createdNodesRef.current[variable]) return;

      const inputNodeId = getNodeID('customInput');
      const inputNode = {
        id: inputNodeId,
        type: 'customInput',
        position: {
          x: currentNode.position.x - 300,
          y: currentNode.position.y + (index * 100)
        },
        data: {
          id: inputNodeId,
          nodeType: 'customInput',
          inputName: variable,
          inputType: 'Text',
          autoCreated: true
        }
      };

      addNode(inputNode);
      createdNodesRef.current[variable] = inputNodeId;

      // Connect Input node to Text node after React Flow registers both nodes
      setTimeout(() => {
        updateNodeInternals(inputNodeId);
        setTimeout(() => {
          onConnect({
            source: inputNodeId,
            sourceHandle: `${inputNodeId}-value`,
            target: id,
            targetHandle: `${id}-${variable}`
          });
        }, 50);
      }, 50);
    });

    // Clean up deleted variables
    Object.keys(createdNodesRef.current).forEach(variable => {
      if (!variables.includes(variable)) {
        const nodeIdToRemove = createdNodesRef.current[variable];
        onNodesChange([{ id: nodeIdToRemove, type: 'remove' }]);

        const edgesToRemove = edges
          .filter(edge => edge.source === nodeIdToRemove || edge.target === nodeIdToRemove)
          .map(edge => ({ id: edge.id, type: 'remove' }));

        if (edgesToRemove.length > 0) {
          onEdgesChange(edgesToRemove);
        }

        delete createdNodesRef.current[variable];
      }
    });
  }, [variables]);

  // Auto-resize textarea: grow up to 600px, then scroll
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '1px'; // Reset to measure accurately
      const newHeight = Math.min(textarea.scrollHeight, 600);
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = newHeight === 600 ? 'auto' : 'hidden';
    }
  }, [currText]);

  // Delete node handler
  const handleDelete = () => {
    onNodesChange([{ id, type: 'remove' }]);
  };

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  return (
    <div
      className="bg-white border rounded-xl shadow-md transition-shadow border-[#E5E7EB] shadow-lg"
      style={{
        width: 300,
        minHeight: 120
      }}
    >
      {/* Permanent input handle - always visible */}
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-input`}
        className="w-2.5 h-2.5 !bg-[#10B981] border-2 border-white"
        style={{
          top: variables.length > 0 ? '20%' : '50%'
        }}
        title="Input"
      />

      {/* Input handles for each variable */}
      {variables.map((variable, index) => {
        // Adjust positioning to account for the permanent handle
        const totalHandles = variables.length + 1;
        const topPosition = ((index + 2) / (totalHandles + 1)) * 100;
        return (
          <Handle
            key={variable}
            type="target"
            position={Position.Left}
            id={`${id}-${variable}`}
            className="w-2.5 h-2.5 !bg-[#10B981] border-2 border-white"
            style={{
              top: `${topPosition}%`
            }}
            title={variable}
          />
        );
      })}

      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
        <div className="flex items-center justify-center gap-2">
          <Type size={16} strokeWidth={2} style={{ color: '#3B82F6' }} />
          <span className="font-semibold text-sm text-[#111827]">Text</span>
        </div>
        <button
          onClick={handleDelete}
          className="p-1 hover:bg-[#FEE2E2] rounded transition-colors"
          aria-label="Delete node"
        >
          <Trash2 size={16} className="text-red-500" />
        </button>
      </div>

      {/* Body Section */}
      <div className="p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-[#6B7280] mb-1">
            Text:
          </label>
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleTextChange}
            placeholder="Enter text with {{variables}}"
            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-md bg-[#F9FAFB] text-[#111827] placeholder-[#6B7280] focus:border-[#3B82F6] focus:outline-none transition-colors resize-none font-mono"
            style={{
              minHeight: '60px',
              maxHeight: '400px'
            }}
          />
        </div>

        {variables.length > 0 && (
          <div className="text-xs text-[#6B7280] px-3 py-2 bg-[#F0F9FF] border border-[#BFDBFE] rounded-md">
            <span className="font-medium">Variables:</span> {variables.map(v => `{{${v}}}`).join(', ')}
          </div>
        )}
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        className="w-2.5 h-2.5 !bg-[#F59E0B] border-2 border-white"
      />
    </div>
  );
};
