// pages/agent/AgentDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AgentDashboard() {
  const [agent, setAgent]   = useState(null);
  const [stats, setStats]   = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/agent/login'); return; }
      try {
        const [profileRes, complaintsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/agent/profile',    { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/agent/complaints', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setAgent(profileRes.data);
        const all = complaintsRes.data;
        setStats({
          total:      all.length,
          pending:    all.filter(c => c.status === "PENDING").length,
          inProgress: all.filter(c => c.status === "IN_PROGRESS").length,
          resolved:   all.filter(c => c.status === "RESOLVED").length,
          rejected:   all.filter(c => c.status === "REJECTED").length,
        });
      } catch (err) {
        setError('Failed to load dashboard data. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <svg className="w-6 h-6 animate-spin text-[#1a3a6b]" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <span className="ml-3 text-sm text-gray-500">Loading dashboard...</span>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4 max-w-md">
        <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  );

  const statCards = [
    { label: "Total",       value: stats.total,      border: "border-gray-200",    valueColor: "text-gray-800",    bg: "bg-gray-50"     },
    { label: "Pending",     value: stats.pending,    border: "border-amber-200",   valueColor: "text-amber-700",   bg: "bg-amber-50"    },
    { label: "In Progress", value: stats.inProgress, border: "border-blue-200",    valueColor: "text-blue-700",    bg: "bg-blue-50"     },
    { label: "Resolved",    value: stats.resolved,   border: "border-emerald-200", valueColor: "text-emerald-700", bg: "bg-emerald-50"  },
    { label: "Rejected",    value: stats.rejected,   border: "border-red-200",     valueColor: "text-red-700",     bg: "bg-red-50"      },
  ];

  const profileFields = [
    { label: "Full Name",   value: agent.name },
    { label: "Email Address", value: agent.email },
    { label: "Department",  value: agent.department?.name || "Not assigned" },
    { label: "Agent Type",  value: agent.agentType || "Not specified" },
    { label: "District",    value: agent.district || "Not specified" },
    {
      label: "Member Since",
      value: new Date(agent.createdAt).toLocaleDateString('en-GB', {
        year: 'numeric', month: 'long', day: 'numeric'
      }),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-[#1a3a6b] text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">
            Agent Portal
          </p>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-blue-200 text-sm mt-1">
            Welcome back, <span className="text-white font-medium">{agent.name}</span>.
            Here is an overview of your assigned complaints.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">

        {/* Stats */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Complaint Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {statCards.map(stat => (
              <div
                key={stat.label}
                className={`rounded-xl border p-4 text-center ${stat.bg} ${stat.border}`}
              >
                <p className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Profile & Quick Actions side by side on larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile Details — takes 2/3 */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Profile Details
              </h3>
            </div>
            <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {profileFields.map(field => (
                <div key={field.label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">
                    {field.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions — takes 1/3 */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-fit">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Quick Actions
              </h3>
            </div>
            <div className="px-5 py-5 flex flex-col gap-3">
              <button
                onClick={() => navigate('/agent/complaints')}
                className="group w-full bg-white border border-gray-200 hover:border-[#1a3a6b] rounded-lg px-4 py-3 text-left flex items-center gap-3 transition-all duration-150 hover:shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 group-hover:bg-[#1a3a6b] flex items-center justify-center shrink-0 transition-colors">
                  <svg className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">All Complaints</p>
                  <p className="text-xs text-gray-400">{stats.total} total assigned</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/agent/complaints?status=PENDING')}
                className="group w-full bg-white border border-gray-200 hover:border-[#1a3a6b] rounded-lg px-4 py-3 text-left flex items-center gap-3 transition-all duration-150 hover:shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 group-hover:bg-[#1a3a6b] flex items-center justify-center shrink-0 transition-colors">
                  <svg className="w-4 h-4 text-amber-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Pending Complaints</p>
                  <p className="text-xs text-gray-400">{stats.pending} awaiting action</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/agent/departments')}
                className="group w-full bg-white border border-gray-200 hover:border-[#1a3a6b] rounded-lg px-4 py-3 text-left flex items-center gap-3 transition-all duration-150 hover:shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-[#1a3a6b] flex items-center justify-center shrink-0 transition-colors">
                  <svg className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Departments</p>
                  <p className="text-xs text-gray-400">View department info</p>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
