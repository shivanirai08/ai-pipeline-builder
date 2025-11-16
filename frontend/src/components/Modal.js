// Modal.js
// Reusable modal component with close icon

import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000] animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-8 max-w-md w-[90%] shadow-2xl border border-[#E5E7EB] animate-slideUp relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-[#F9FAFB] transition-colors"
          aria-label="Close"
        >
          <X size={20} className="text-[#6B7280]" />
        </button>

        {/* Title */}
        {title && (
          <h2 className="m-0 mb-6 text-xl font-semibold text-[#111827] border-b border-[#E5E7EB] pb-4 pr-8">
            {title}
          </h2>
        )}

        {/* Content */}
        <div>{children}</div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease;
        }
      `}</style>
    </div>
  );
};
