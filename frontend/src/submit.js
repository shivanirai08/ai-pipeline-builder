// submit.js
// added the endpoint to submit the nodes and edges to the backend

import { useState } from 'react';
import { useStore } from './store';
import { Play } from 'lucide-react';
import { Modal } from './components/Modal';

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const [showModal, setShowModal] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        try {
            setError(null);
            // Send nodes and edges to backend
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
            setShowModal(true);
        } catch (error) {
            console.error('Error submitting pipeline:', error);
            setError(error.message);
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setResult(null);
        setError(null);
    };

    return (
        <>
            <button
                type="submit"
                onClick={handleSubmit}
                className="flex items-center gap-2 py-2 px-4 rounded-lg bg-[#3B82F6] text-white text-sm font-medium hover:bg-[#2563EB] transition-colors duration-200 cursor-pointer"
            >
                <Play size={16} strokeWidth={2} />
                Submit
            </button>

            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={error ? 'Error' : 'Pipeline Analysis'}
            >
                {error ? (
                    <div className="text-red-600 text-sm leading-relaxed mb-6">
                        {error}
                    </div>
                ) : result ? (
                    <div className="mb-6">
                        <div className="flex justify-between py-3 border-b border-[#E5E7EB]">
                            <span className="text-[#6B7280] text-sm">Number of Nodes</span>
                            <span className="text-[#111827] text-sm font-semibold">
                                {result.num_nodes}
                            </span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-[#E5E7EB]">
                            <span className="text-[#6B7280] text-sm">Number of Edges</span>
                            <span className="text-[#111827] text-sm font-semibold">
                                {result.num_edges}
                            </span>
                        </div>
                        <div className="flex justify-between py-3">
                            <span className="text-[#6B7280] text-sm">Is DAG</span>
                            <span className={`text-sm font-semibold ${result.is_dag ? 'text-[#10B981]' : 'text-red-600'}`}>
                                {result.is_dag ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                ) : null}

                <button
                    onClick={closeModal}
                    className="w-full py-2.5 px-5 bg-[#3B82F6] text-white border-0 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-[#2563EB]"
                >
                    Close
                </button>
            </Modal>
        </>
    );
}
