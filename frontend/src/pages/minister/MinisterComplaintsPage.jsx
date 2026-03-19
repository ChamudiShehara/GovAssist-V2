// pages/minister/MinisterComplaintsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const STATUS_TABS = ["ALL", "PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"];

const tabLabels = {
  ALL:         "All",
  PENDING:     "Pending",
  IN_PROGRESS: "In Progress",
  RESOLVED:    "Resolved",
  REJECTED:    "Rejected",
};

const statusConfig = {
  PENDING:     { class: "bg-amber-100 text-amber-700 border border-amber-200",       dot: "bg-amber-400"    },
  IN_PROGRESS: { class: "bg-blue-100 text-blue-700 border border-blue-200",          dot: "bg-blue-400"     },
  RESOLVED:    { class: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-400"  },
  REJECTED:    { class: "bg-red-100 text-red-700 border border-red-200",             dot: "bg-red-400"      },
};

const priorityConfig = {
  HIGH:   "bg-red-50 text-red-600 border border-red-200",
  MEDIUM: "bg-amber-50 text-amber-600 border border-amber-200",
  LOW:    "bg-gray-100 text-gray-500 border border-gray-200",
};

export default function MinisterComplaintsPage() {
  const [complaints, setComplaints]           = useState([]);
  const [activeTab, setActiveTab]             = useState("ALL");
  const [loading, setLoading]                 = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [agents, setAgents]                   = useState([]);
  const [selectedAgent, setSelectedAgent]     = useState("");
  const [assigning, setAssigning]             = useState(false);
  const [modalOpen, setModalOpen]             = useState(false);
  const [assignError, setAssignError]         = useState("");
  const [updateError, setUpdateError]         = useState("");

  const token = localStorage.getItem("token");

  const fetchComplaints = async (status) => {
    setLoading(true);
    try {
      const url = status === "ALL"
        ? "http://localhost:5000/api/minister/complaints"
        : `http://localhost:5000/api/minister/complaints?status=${status}`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setComplaints(res.data);
    } catch {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(activeTab); }, [activeTab]);

  const openAssignModal = async (complaint) => {
    setSelectedComplaint(complaint);
    setSelectedAgent("");
    setAssignError("");
    setModalOpen(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/minister/agents?department=${complaint.department?._id}&district=${complaint.district}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAgents(res.data);
    } catch {
      setAgents([]);
    }
  };

  const handleAssign = async () => {
    if (!selectedAgent) {
      setAssignError("Please select an agent before assigning.");
      return;
    }
    setAssigning(true);
    setAssignError("");
    try {
      await axios.post(
        "http://localhost:5000/api/minister/assign-agent",
        { complaintId: selectedComplaint._id, agentId: selectedAgent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalOpen(false);
      fetchComplaints(activeTab);
    } catch {
      setAssignError("Failed to assign agent. Please try again.");
    } finally {
      setAssigning(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedComplaint(null);
    setSelectedAgent("");
    setAssignError("");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-[#1a3a6b] text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">
            Minister Portal
          </p>
          <h1 className="text-2xl font-bold text-white">Department Complaints</h1>
          <p className="text-blue-200 text-sm mt-1">
            Review complaints in your department and assign field agents for resolution.
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
              There are no {activeTab !== "ALL" ? tabLabels[activeTab].toLowerCase() : ""} complaints in your department.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.map(complaint => {
              const status   = statusConfig[complaint.status] || statusConfig.PENDING;
              const priority = priorityConfig[complaint.priority] || priorityConfig.LOW;

              return (
                <div
                  key={complaint._id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow duration-150"
                >
                  {/* Top status accent */}
                  <div className={`h-0.5 ${status.dot}`} />

                  <div className="p-5">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate">
                          {complaint.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {complaint.citizen?.name && (
                            <span className="text-xs text-gray-500">{complaint.citizen.name}</span>
                          )}
                          {complaint.district && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-xs text-gray-500">{complaint.district}</span>
                            </>
                          )}
                          {complaint.department?.name && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-xs text-gray-500">{complaint.department.name}</span>
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

                    {/* Assigned Agent */}
                    {complaint.assignedAgent ? (
                      <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-xs text-emerald-700">
                          Assigned to{" "}
                          <span className="font-semibold">{complaint.assignedAgent.name}</span>
                          {" — "}{complaint.assignedAgent.agentType}
                          {complaint.assignedAgent.district && ` · ${complaint.assignedAgent.district}`}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                        <p className="text-xs text-amber-700">No agent assigned yet</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(complaint.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </span>

                      {complaint.status === "PENDING" && (
                        <button
                          onClick={() => openAssignModal(complaint)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {complaint.assignedAgent ? "Reassign Agent" : "Assign Agent"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Assign Agent Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* Modal Header */}
            <div className="bg-[#1a3a6b] px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Assign Field Agent</h2>
                <p className="text-xs text-blue-300 mt-0.5">Select an agent for this complaint</p>
              </div>
              <button
                onClick={closeModal}
                className="text-blue-300 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5">

              {/* Complaint Summary */}
              <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 mb-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Complaint</p>
                <p className="text-sm font-semibold text-gray-800">{selectedComplaint?.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{selectedComplaint?.district}</span>
                  {selectedComplaint?.department?.name && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{selectedComplaint.department.name}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Agent Select */}
              {agents.length === 0 ? (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-4 py-3 mb-5">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <p className="text-sm">No agents available for this district and department.</p>
                </div>
              ) : (
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Select Agent
                  </label>
                  <select
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b] transition-colors"
                    value={selectedAgent}
                    onChange={(e) => { setSelectedAgent(e.target.value); setAssignError(""); }}
                  >
                    <option value="">Select an agent</option>
                    {agents.map(agent => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name} — {agent.agentType} ({agent.district})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Assign Error */}
              {assignError && (
                <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2.5">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <p className="text-xs">{assignError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={closeModal}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={assigning || !selectedAgent || agents.length === 0}
                  className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-[#1a3a6b] hover:bg-[#15336b] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {assigning ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Assigning...
                    </>
                  ) : (
                    'Assign Agent'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

