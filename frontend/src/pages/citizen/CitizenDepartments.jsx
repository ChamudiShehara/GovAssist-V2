import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CitizenDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/citizen/login");

        const response = await axios.get("http://localhost:5000/api/admin/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(response.data);
      } catch (err) {
        setError("Failed to fetch departments. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-[#1a3a6b] text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">
            Citizen Portal
          </p>
          <h1 className="text-2xl font-bold text-white">Government Departments</h1>
          <p className="text-blue-200 text-sm mt-1">
            Browse available departments and submit complaints to the relevant authority.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
            <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Departments Card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Available Departments
            </h3>
            {!loading && departments.length > 0 && (
              <span className="text-xs text-gray-400">
                {departments.length} department{departments.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <svg className="w-5 h-5 animate-spin text-[#1a3a6b]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="ml-3 text-sm text-gray-500">Loading departments...</span>
            </div>
          ) : departments.length === 0 ? (
            <div className="py-16 text-center">
              <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-sm font-medium text-gray-500">No departments available</p>
              <p className="text-xs text-gray-400 mt-1">Departments will appear here once they are added by the administrator.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">
                      Department Name
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">
                      Description
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-widest text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {departments.map((department) => (
                    <tr key={department._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#1a3a6b]/10 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-[#1a3a6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">{department.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-500 max-w-md line-clamp-2 leading-relaxed">
                          {department.description || "No description provided."}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => navigate(`/citizen/departments/${department._id}`)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                          >
                            View Details
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CitizenDepartments;
