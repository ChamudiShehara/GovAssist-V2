import React from "react";

const SuccessModal = ({ isOpen, onDone }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl px-8 py-8 w-full max-w-sm mx-4 flex flex-col items-center text-center animate-fadeInScale">

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
          <svg
            className="w-8 h-8 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Complaint Submitted!
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-500 mb-7 leading-relaxed">
          Your complaint has been submitted successfully. The relevant department
          will review it and get back to you shortly.
        </p>

        {/* Done Button */}
        <button
          onClick={onDone}
          className="w-full bg-[#1a3a6b] hover:bg-[#15336b] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;