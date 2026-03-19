// pages/agent/AgentComplaintsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const STATUS_TABS = ["ALL", "PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"];

const statusConfig = {
  PENDING:     { class: "bg-amber-100 text-amber-700 border border-amber-200",   dot: "bg-amber-400"   },
  IN_PROGRESS: { class: "bg-blue-100 text-blue-700 border border-blue-200",      dot: "bg-blue-400"    },
  RESOLVED:    { class: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-400" },
  REJECTED:    { class: "bg-red-100 text-red-700 border border-red-200",         dot: "bg-red-400"     },
};

const priorityConfig = {
  HIGH:   "bg-red-50 text-red-600 border border-red-200",
  MEDIUM: "bg-amber-50 text-amber-600 border border-amber-200",
  LOW:    "bg-gray-100 text-gray-500 border border-gray-200",
};

const tabLabels = {
  ALL:         "All",
  PENDING:     "Pending",
  IN_PROGRESS: "In Progress",
  RESOLVED:    "Resolved",
  REJECTED:    "Rejected",
};

export default function AgentComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab]   = useState("ALL");
  const [loading, setLoading]       = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState('');
  const navigate = useNavigate();

  const fetchComplaints = async (status) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const url = status === "ALL"
        ? "http://localhost:5000/api/agent/complaints"
        : `http://localhost:5000/api/agent/complaints?status=${status}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(activeTab); }, [activeTab]);

  const handleStatusUpdate = async (complaintId, newStatus) => {
    const token = localStorage.getItem("token");
    setUpdatingId(complaintId);
    setUpdateError('');
    try {
      await axios.put(
        `http://localhost:5000/api/agent/complaints/${complaintId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComplaints(activeTab);
    } catch (err) {
      setUpdateError("Failed to update complaint status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const activeCount = complaints.filter(c => c.status === "IN_PROGRESS").length;
  const pendingCount = complaints.filter(c => c.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-[#1a3a6b] text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">
            Agent Portal
          </p>
          <h1 className="text-2xl font-bold text-white">Assigned Complaints</h1>
          <p className="text-blue-200 text-sm mt-1">
            Review, manage, and update the status of complaints assigned to you.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* Update Error */}
        {updateError && (
          <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
            <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-sm">{updateError}</p>
          </div>
        )}

        {/* Status Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit flex-wrap">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                activeTab === tab
                  ? "bg-[#1a3a6b] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* Complaints List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="w-6 h-6 animate-spin text-[#1a3a6b]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="ml-3 text-sm text-gray-500">Loading complaints...</span>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium text-gray-500">No complaints found</p>
            <p className="text-xs text-gray-400 mt-1">
              There are no {activeTab !== "ALL" ? tabLabels[activeTab].toLowerCase() : ""} complaints assigned to you.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.map(complaint => {
              const status = statusConfig[complaint.status] || statusConfig.PENDING;
              const priority = priorityConfig[complaint.priority] || priorityConfig.LOW;
              const isUpdating = updatingId === complaint._id;
              const isClosed = complaint.status === "RESOLVED" || complaint.status === "REJECTED";

              return (
                <div
                  key={complaint._id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow duration-150"
                >
                  {/* Card top accent by status */}
                  <div className={`h-0.5 ${status.dot}`} />

                  <div className="p-5">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate">
                          {complaint.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-gray-500">
                            {complaint.citizen?.name || "Unknown Citizen"}
                          </span>
                          {complaint.district && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-xs text-gray-500">{complaint.district}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {complaint.priority && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${priority}`}>
                            {complaint.priority}
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.class}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {complaint.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2">
                      {complaint.description}
                    </p>

                    {/* Footer row */}
                    <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
                      {/* Meta */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {complaint.department?.name && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                            </svg>
                            {complaint.department.name}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(complaint.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Status Actions */}
                      {!isClosed && (
                        <div className="flex items-center gap-2 shrink-0">
                          {complaint.status === "PENDING" && (
                            <button
                              onClick={() => handleStatusUpdate(complaint._id, "IN_PROGRESS")}
                              disabled={isUpdating}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {isUpdating ? (
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                              ) : null}
                              Start Progress
                            </button>
                          )}
                          {complaint.status === "IN_PROGRESS" && (
                            <button
                              onClick={() => handleStatusUpdate(complaint._id, "RESOLVED")}
                              disabled={isUpdating}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {isUpdating ? (
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                              ) : null}
                              Mark Resolved
                            </button>
                          )}
                          <button
                            onClick={() => handleStatusUpdate(complaint._id, "REJECTED")}
                            disabled={isUpdating}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {/* Closed indicator */}
                      {isClosed && (
                        <span className="text-xs text-gray-400 italic">No further actions</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
