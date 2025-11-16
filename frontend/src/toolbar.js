// toolbar.js

import { DraggableNode } from './draggableNode';
import { SubmitButton } from './submit';

export const PipelineToolbar = () => {
    return (
        <div className="flex justify-between items-center py-4 px-6 bg-white border-b border-[#E5E7EB]">
            {/* Nodes on the left */}
            <div className="flex gap-3 items-center">
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='filter' label='Filter' />
                <DraggableNode type='transform' label='Transform' />
                <DraggableNode type='condition' label='Condition' />
                <DraggableNode type='aggregate' label='Aggregate' />
                <DraggableNode type='api' label='API' />
            </div>

            {/* Submit button on the right */}
            <SubmitButton />
        </div>
    );
};
