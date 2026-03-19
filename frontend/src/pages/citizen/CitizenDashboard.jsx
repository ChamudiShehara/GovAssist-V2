// CitizenDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  PENDING:     { class: "bg-amber-100 text-amber-700 border border-amber-200",       dot: "bg-amber-400"    },
  IN_PROGRESS: { class: "bg-blue-100 text-blue-700 border border-blue-200",          dot: "bg-blue-400"     },
  RESOLVED:    { class: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-400"  },
  REJECTED:    { class: "bg-red-100 text-red-700 border border-red-200",             dot: "bg-red-400"      },
};

const CitizenDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/citizen/complaints", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(response.data);
      } catch (err) {
        setError("Failed to fetch complaints. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const handleDeleteComplaint = async (id) => {
    const token = localStorage.getItem("token");
    setDeletingId(id);
    setError("");
    try {
      await axios.delete(`http://localhost:5000/api/citizen/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(complaints.filter((c) => c._id !== id));
    } catch (err) {
      setError("Failed to delete complaint. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/citizen/complaints/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaints(complaints.map((c) => c._id === id ? { ...c, status } : c));
    } catch (err) {
      setError("Failed to update status. Please try again.");
    }
  };

  // Summary counts
  const total      = complaints.length;
  const pending    = complaints.filter(c => c.status === "PENDING").length;
  const inProgress = complaints.filter(c => c.status === "IN_PROGRESS").length;
  const resolved   = complaints.filter(c => c.status === "RESOLVED").length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-[#1a3a6b] text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">
            Citizen Portal
          </p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
              <p className="text-blue-200 text-sm mt-1">
                View and manage your submitted complaints.
              </p>
            </div>
            <button
              onClick={() => navigate("/citizen/create-complaint")}
              className="shrink-0 bg-white text-[#1a3a6b] text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Complaint
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total",       value: total,      bg: "bg-gray-50",      border: "border-gray-200",    color: "text-gray-800"    },
            { label: "Pending",     value: pending,    bg: "bg-amber-50",     border: "border-amber-200",   color: "text-amber-700"   },
            { label: "In Progress", value: inProgress, bg: "bg-blue-50",      border: "border-blue-200",    color: "text-blue-700"    },
            { label: "Resolved",    value: resolved,   bg: "bg-emerald-50",   border: "border-emerald-200", color: "text-emerald-700" },
          ].map(stat => (
            <div key={stat.label} className={`rounded-xl border p-4 text-center ${stat.bg} ${stat.border}`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

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

        {/* Complaints Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Submitted Complaints
            </h3>
            {!loading && complaints.length > 0 && (
              <span className="text-xs text-gray-400">{complaints.length} record{complaints.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <svg className="w-5 h-5 animate-spin text-[#1a3a6b]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="ml-3 text-sm text-gray-500">Loading complaints...</span>
            </div>
          ) : complaints.length === 0 ? (
            <div className="py-16 text-center">
              <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-500">No complaints submitted yet</p>
              <p className="text-xs text-gray-400 mt-1">Use the "New Complaint" button to submit your first complaint.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">Title</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">Department</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">Date</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-widest text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {complaints.map((complaint) => {
                    const status = statusConfig[complaint.status] || statusConfig.PENDING;
                    const isDeleting = deletingId === complaint._id;
                    return (
                      <tr key={complaint._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {complaint.title}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-600">
                            {complaint.department?.name || "N/A"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.class}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {complaint.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs text-gray-400">
                            {complaint.createdAt
                              ? new Date(complaint.createdAt).toLocaleDateString('en-GB', {
                                  day: '2-digit', month: 'short', year: 'numeric'
                                })
                              : "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/citizen/complaint/${complaint._id}`)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteComplaint(complaint._id)}
                              disabled={isDeleting}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                              {isDeleting ? (
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                              ) : null}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CitizenDashboard;
