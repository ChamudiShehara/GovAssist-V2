// pages/minister/MinisterDepartmentPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MinisterDepartmentPage() {
  const [minister, setMinister] = useState(null);
  const [agents, setAgents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get(
          "http://localhost:5000/api/minister/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMinister(profileRes.data);

        const agentsRes = await axios.get(
          `http://localhost:5000/api/minister/agents?department=${profileRes.data.department?._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAgents(agentsRes.data);
      } catch (err) {
        setError('Failed to load department data. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <svg className="w-6 h-6 animate-spin text-[#1a3a6b]" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <span className="ml-3 text-sm text-gray-500">Loading department...</span>
    </div>
  );

  const dept = minister?.department;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-[#1a3a6b] text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/minister/dashboard')}
            className="flex items-center gap-1.5 text-blue-300 hover:text-white text-xs mb-4 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">
            Minister Portal
          </p>
          <h1 className="text-2xl font-bold text-white">My Department</h1>
          <p className="text-blue-200 text-sm mt-1">
            Department overview and assigned field agents.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
            <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Department Info Card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Department Information
            </h3>
          </div>
          <div className="px-5 py-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg bg-[#1a3a6b]/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#1a3a6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-gray-900">
                  {dept?.name || "No Department Assigned"}
                </h2>
                {dept?.description && (
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {dept.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    {minister?.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {agents.length} agent{agents.length !== 1 ? 's' : ''} assigned
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agents Card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Field Agents
            </h3>
            <span className="text-xs text-gray-400">
              {agents.length} agent{agents.length !== 1 ? 's' : ''}
            </span>
          </div>

          {agents.length === 0 ? (
            <div className="py-14 text-center">
              <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm font-medium text-gray-500">No agents assigned</p>
              <p className="text-xs text-gray-400 mt-1">
                Agents will appear here once assigned to this department by the administrator.
              </p>
            </div>
          ) : (
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              {agents.map(agent => {
                const initials = agent.name
                  ? agent.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  : 'AG';
                return (
                  <div
                    key={agent._id}
                    className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 hover:shadow-sm transition-all duration-150"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-800 truncate">{agent.name}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{agent.email}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                            {agent.agentType}
                          </span>
                          <span className="text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full">
                            {agent.district}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}