// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
// New nodes using the abstraction
import { FilterNode } from './nodes/filterNode';
import { TransformNode } from './nodes/transformNode';
import { ConditionNode } from './nodes/conditionNode';
import { AggregateNode } from './nodes/aggregateNode';
import { ApiNode } from './nodes/apiNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  // New node types
  filter: FilterNode,
  transform: TransformNode,
  condition: ConditionNode,
  aggregate: AggregateNode,
  api: ApiNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();

          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }

            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };

            addNode(newNode);
          }
        },
        [reactFlowInstance]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <div ref={reactFlowWrapper} className="w-full h-full flex-1 bg-[#F9FAFB] relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                defaultEdgeOptions={{
                    animated: true,
                    style: { stroke: '#94A3B8', strokeWidth: 2 }
                }}
            >
                <Background
                    color="#a0a5acff"
                    gap={gridSize}
                    variant="dots"
                    style={{ background: '#F9FAFB' }}
                />
                <Controls
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px'
                    }}
                />
                <MiniMap
                    nodeColor={(node) => {
                        switch (node.type) {
                            case 'customInput': return '#10B981';
                            case 'customOutput': return '#F59E0B';
                            case 'llm': return '#8B5CF6';
                            case 'text': return '#3B82F6';
                            case 'filter': return '#02551bff';
                            case 'transform': return '#f64e3bff';
                            case 'condition': return '#f63bd7ff';
                            case 'aggregate': return '#cedb18ff';
                            case 'api': return '#401eebff';
                            default: return '#94A3B8';
                        }
                    }}
                    style={{
                        background: '#e6e6e6ff',
                        border: '1px solid #e0e1e4ff',
                        borderRadius: '8px'
                    }}
                    maskColor="rgba(249, 250, 251, 0.6)"
                />
            </ReactFlow>
        </div>
    )
}
