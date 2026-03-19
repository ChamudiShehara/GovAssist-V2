
import React from "react";
import { useNavigate } from "react-router-dom";

const CitizenEntries = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-[#1a3a6b] text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">
            Citizen Portal
          </p>
          <h1 className="text-2xl font-bold text-white">Entries</h1>
          <p className="text-blue-200 text-sm mt-1">
            View and manage your submitted entries and records.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          {/* Card header */}
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              My Entries
            </h3>
          </div>

          {/* Under Development notice */}
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>

            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-4">
              Under Development
            </span>

            <h2 className="text-base font-bold text-gray-800 mb-2">
              This feature is not yet available
            </h2>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              The Entries section is currently being developed. It will allow you to view and manage your submitted records once available.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => navigate("/citizen/dashboard")}
                className="text-sm font-semibold px-4 py-2.5 bg-[#1a3a6b] text-white rounded-lg hover:bg-[#15336b] transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate("/citizen/create-complaint")}
                className="text-sm font-semibold px-4 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-lg hover:border-gray-300 hover:text-gray-800 transition-colors"
              >
                Submit a Complaint
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CitizenEntries;