// Text Node: Detects {{variables}}, auto-creates Input nodes, and dynamically resizes textarea

import { useState, useEffect, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text);
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
          inputType: 'Text'
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

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  return (
    <div
      style={{
        width: 300,
        minHeight: 120,
        border: '1px solid black',
        padding: '10px',
        borderRadius: '5px',
        background: 'white',
        position: 'relative'
      }}
    >
      {/* Input handles for each variable */}
      {variables.map((variable, index) => {
        const topPosition = ((index + 1) / (variables.length + 1)) * 100;
        return (
          <Handle
            key={variable}
            type="target"
            position={Position.Left}
            id={`${id}-${variable}`}
            style={{
              top: `${topPosition}%`,
              background: '#555'
            }}
            title={variable}
          />
        );
      })}

      <div style={{
        fontWeight: 'bold',
        marginBottom: '8px',
        fontSize: '14px'
      }}>
        Text
      </div>
      <div style={{ marginBottom: '8px' }}>
        <label style={{
          fontSize: '11px',
          display: 'block',
          marginBottom: '4px',
          fontWeight: '500'
        }}>
          Text:
        </label>
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={handleTextChange}
          placeholder="Enter text with {{variables}}"
          style={{
            width: '100%',
            minHeight: '30px',
            resize: 'none',
            fontFamily: 'monospace',
            fontSize: '12px',
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '3px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {variables.length > 0 && (
        <div style={{
          fontSize: '10px',
          color: '#666',
          marginTop: '5px',
          padding: '5px',
          background: '#f0f0f0',
          borderRadius: '3px'
        }}>
          Variables: {variables.map(v => `{{${v}}}`).join(', ')}
        </div>
      )}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ background: '#555' }}
      />
    </div>
  );
}
