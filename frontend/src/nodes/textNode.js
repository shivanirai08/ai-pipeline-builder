// textNode.js
// Enhanced Text Node with:
// 1. Dynamic resizing based on content (natural overflow-based)
// 2. Variable detection {{variableName}}
// 3. Auto-create Input nodes for variables and connect them

import { useState, useEffect, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const createdNodesRef = useRef({}); // Track which input nodes we've created

  // Hook to update React Flow's internal node registry
  const updateNodeInternals = useUpdateNodeInternals();

  // Access store for creating nodes and edges
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const addNode = useStore((state) => state.addNode);
  const getNodeID = useStore((state) => state.getNodeID);
  const onConnect = useStore((state) => state.onConnect);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);

  // Extract variables from text using regex
  // Matches valid JavaScript variable names: {{variableName}}
  const extractVariables = (text) => {
    // Regex: matches {{ followed by valid JS variable name followed by }}
    const regex = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
    const vars = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      vars.push(match[1]); // match[1] is the captured variable name
    }

    // Return unique variables only (no duplicates)
    return [...new Set(vars)];
  };

  // Get current text node position
  const getCurrentNode = () => {
    return nodes.find(node => node.id === id);
  };

  // Step 1: Detect variables and update state (this triggers handle rendering)
  useEffect(() => {
    const detectedVars = extractVariables(currText);
    setVariables(detectedVars);
    // Force React Flow to update its internal registry of this node's handles
    // This must be called after the component re-renders with new handles
    setTimeout(() => {
      updateNodeInternals(id);
    }, 0);
  }, [currText, id, updateNodeInternals]);

  // Step 2: Create Input nodes after variables state is updated and handles are rendered
  useEffect(() => {
    const currentNode = getCurrentNode();
    if (!currentNode) return;

    // Create Input nodes for new variables
    variables.forEach((variable, index) => {
      // Skip if we already created a node for this variable
      if (createdNodesRef.current[variable]) return;

      // Create new Input node
      const inputNodeId = getNodeID('customInput');
      const inputNode = {
        id: inputNodeId,
        type: 'customInput',
        position: {
          x: currentNode.position.x - 300, // Position to the left
          y: currentNode.position.y + (index * 100) // Stack vertically
        },
        data: {
          id: inputNodeId,
          nodeType: 'customInput',
          inputName: variable, // Set the variable name as the input name
          inputType: 'Text'
        }
      };

      addNode(inputNode);
      createdNodesRef.current[variable] = inputNodeId;

      // Create edge connecting Input node to Text node
      // Wait for both nodes to be fully registered by React Flow
      // The Text node's handles are updated via updateNodeInternals in the first useEffect
      // We just need to wait for the Input node to render and for React Flow to process
      setTimeout(() => {
        // Update internals for the newly created input node to register its handles
        updateNodeInternals(inputNodeId);
        // Small additional delay to ensure React Flow has processed the update
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

    // Remove tracking for deleted variables
    Object.keys(createdNodesRef.current).forEach(variable => {
      if (!variables.includes(variable)) {
        const nodeIdToRemove = createdNodesRef.current[variable];

        // Remove the node
        onNodesChange([{
          id: nodeIdToRemove,
          type: 'remove'
        }]);

        // Remove edges connected to this node
        const edgesToRemove = edges
          .filter(edge => edge.source === nodeIdToRemove || edge.target === nodeIdToRemove)
          .map(edge => ({ id: edge.id, type: 'remove' }));

        if (edgesToRemove.length > 0) {
          onEdgesChange(edgesToRemove);
        }

        delete createdNodesRef.current[variable];
      }
    });
  }, [variables]); // Now depends on variables, not currText

  // Simple auto-resize: grow height up to 600px, then scroll
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Set height to 1px temporarily to get accurate scrollHeight
      // This prevents the jumping issue
      textarea.style.height = '1px';

      // Get the actual content height
      const scrollHeight = textarea.scrollHeight;

      // Set height to content height, max 600px
      const newHeight = Math.min(scrollHeight, 600);
      textarea.style.height = `${newHeight}px`;

      // Enable scroll if content exceeds 600px
      if (scrollHeight > 600) {
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
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
      {/* Dynamic handles for variables - positioned on the left */}
      {variables.map((variable, index) => {
        // Calculate position to distribute handles evenly
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
            title={variable} // Tooltip showing variable name
          />
        );
      })}

      {/* Node title */}
      <div style={{
        fontWeight: 'bold',
        marginBottom: '8px',
        fontSize: '14px'
      }}>
        Text
      </div>

      {/* Text input area */}
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

      {/* Display detected variables */}
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

      {/* Output handle - always on the right */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ background: '#555' }}
      />
    </div>
  );
}
