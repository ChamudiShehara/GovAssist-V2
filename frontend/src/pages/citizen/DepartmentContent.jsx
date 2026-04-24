import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const getPriorityStyle = (priority) => {
  const map = {
    HIGH:   { dot: "bg-red-500",    pill: "bg-red-50 text-red-700 border-red-200"       },
    MEDIUM: { dot: "bg-amber-500",  pill: "bg-amber-50 text-amber-700 border-amber-200" },
    LOW:    { dot: "bg-gray-400",   pill: "bg-gray-100 text-gray-600 border-gray-200"   },
  };
  return map[priority] ?? { dot: "bg-gray-400", pill: "bg-gray-100 text-gray-600 border-gray-200" };
};

const getStatusStyle = (status) => {
  const map = {
    PENDING:     "bg-amber-100 text-amber-700 border-amber-200",
    IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
    RESOLVED:    "bg-emerald-100 text-emerald-700 border-emerald-200",
    REJECTED:    "bg-red-100 text-red-700 border-red-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
};

const getStatusDot = (status) => {
  const map = {
    PENDING:     "bg-amber-400",
    IN_PROGRESS: "bg-blue-400",
    RESOLVED:    "bg-emerald-400",
    REJECTED:    "bg-red-400",
  };
  return map[status] ?? "bg-gray-400";
};

const getRankStyle = (rank) => {
  if (rank === 1) return { pill: "bg-red-100 text-red-600 border-red-200",     label: "🔴" };
  if (rank === 2) return { pill: "bg-amber-100 text-amber-600 border-amber-200", label: "🟠" };
  if (rank === 3) return { pill: "bg-blue-100 text-blue-600 border-blue-200",   label: "🔵" };
  return { pill: "bg-gray-100 text-gray-500 border-gray-200", label: null };
};

const getUrgencyColor = (score) => {
  if (score >= 0.7) return "bg-red-500";
  if (score >= 0.4) return "bg-amber-500";
  return "bg-emerald-500";
};

const getUrgencyLabel = (score) => {
  if (score >= 0.7) return { text: "High Urgency", style: "text-red-600 bg-red-50 border-red-200" };
  if (score >= 0.4) return { text: "Medium Urgency", style: "text-amber-600 bg-amber-50 border-amber-200" };
  return { text: "Low Urgency", style: "text-emerald-600 bg-emerald-50 border-emerald-200" };
};

const UrgencyBar = ({ score }) => {
  const pct = Math.round((score ?? 0) * 100);
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${getUrgencyColor(score ?? 0)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right tabular-nums">{pct}%</span>
    </div>
  );
};

const StatCard = ({ label, value, sub, color = "text-[#1a3a6b]" }) => (
  <div className="bg-white rounded-xl border border-gray-200 px-4 py-4">
    <p className={`text-2xl font-bold ${color} leading-none`}>{value}</p>
    <p className="text-xs font-semibold text-gray-700 mt-1">{label}</p>
    {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
  </div>
);

const DepartmentContent = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [votingId, setVotingId]     = useState(null);
  const [votedIds, setVotedIds]     = useState(new Set());
  const [weights, setWeights]       = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const { departmentId }            = useParams();
  const navigate                    = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/citizen/login");
        const response = await axios.get(
          `http://localhost:5000/api/citizen/complaints/department/${departmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data;
        if (Array.isArray(data)) {
          setComplaints(data);
        } else if (Array.isArray(data.scored)) {
          setComplaints(data.scored);
          if (data.model_info?.weights) setWeights(data.model_info.weights);
        } else {
          setComplaints([]);
        }
      } catch {
        setError("Failed to fetch complaints for this department.");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [departmentId, navigate]);

  const handleVote = async (complaintId) => {
    if (votedIds.has(complaintId) || votingId) return;
    const token = localStorage.getItem("token");
    if (!token) return navigate("/citizen/login");
    setVotingId(complaintId);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/citizen/complaints/vote",
        { complaintId, voteType: "upvote" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === complaintId ? { ...c, votes: response.data.complaint.votes } : c
        )
      );
      setVotedIds((prev) => new Set([...prev, complaintId]));
    } catch (err) {
      const msg = err.response?.data?.error;
      if (msg === "You have already voted on this complaint") {
        setVotedIds((prev) => new Set([...prev, complaintId]));
      } else {
        setError("Failed to submit vote. Please try again.");
      }
    } finally {
      setVotingId(null);
    }
  };

  const availableDistricts = [...new Set(
    complaints.map((c) => c.district).filter(Boolean)
  )].sort();

  const filteredComplaints = selectedDistrict === "ALL"
    ? complaints
    : complaints.filter((c) => c.district === selectedDistrict);

  const deptName       = complaints[0]?.department?.name ?? "Department";
  const scoringWeights = weights ?? { votes: 0.60, priority: 0.40 };

  // Stats derived from ALL complaints (not filtered)
  const totalVotes    = complaints.reduce((sum, c) => sum + (c.votes?.length ?? 0), 0);
  const highCount     = complaints.filter((c) => c.priority === "HIGH").length;
  const resolvedCount = complaints.filter((c) => c.status === "RESOLVED").length;
  const pendingCount  = complaints.filter((c) => c.status === "PENDING").length;

  // Status breakdown for sidebar
  const statusGroups = ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"].map((s) => ({
    status: s,
    count: complaints.filter((c) => c.status === s).length,
    label: s.replace("_", " "),
    dot: getStatusDot(s),
    style: getStatusStyle(s),
  }));

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-[#1a3a6b] text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-blue-300 hover:text-white text-xs mb-4 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">Citizen Portal</p>

          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {loading ? "Loading..." : deptName}
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Complaints ranked by ML urgency score — highest urgency first.
              </p>
            </div>
            {!loading && complaints.length > 0 && (
              <span className="shrink-0 text-xs font-medium bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-full mt-1">
                {filteredComplaints.length} of {complaints.length} complaint{complaints.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Quick stat strip inside header */}
          {!loading && complaints.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-6">
              {[
                { label: "Total",    value: complaints.length,  sub: "complaints" },
                { label: "High",     value: highCount,          sub: "priority"   },
                { label: "Pending",  value: pendingCount,       sub: "awaiting"   },
                { label: "Resolved", value: resolvedCount,      sub: "closed"     },
              ].map(({ label, value, sub }) => (
                <div key={label} className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-center">
                  <p className="text-xl font-bold text-white leading-none">{value}</p>
                  <p className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider mt-1">{label}</p>
                  <p className="text-[10px] text-blue-300/70">{sub}</p>
                </div>
              ))}
            </div>
          )}
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

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ── LEFT: Complaint list (2/3) ── */}
          <div className="lg:col-span-2">

            {/* Loading Skeletons */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-7 h-7 rounded-full bg-gray-100" />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full" />
                      <div className="w-8 h-2 bg-gray-100 rounded-full" />
                    </div>
                    <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-4/5" />
                  </div>
                ))}
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl py-16 text-center">
                <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {selectedDistrict === "ALL" ? (
                  <>
                    <p className="text-sm font-medium text-gray-500">No complaints filed yet</p>
                    <p className="text-xs text-gray-400 mt-1">This department has no complaints at this time.</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-500">No complaints from {selectedDistrict}</p>
                    <p className="text-xs text-gray-400 mt-1">Try selecting a different district.</p>
                    <button
                      type="button"
                      onClick={() => setSelectedDistrict("ALL")}
                      className="mt-4 text-xs font-semibold text-[#1a3a6b] border border-[#1a3a6b]/25 hover:bg-[#1a3a6b]/[0.04] px-4 py-2 rounded-lg transition-colors"
                    >
                      View All Districts
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComplaints.map((complaint, index) => {
                  const rank          = complaint._rank ?? index + 1;
                  const urgencyScore  = complaint._urgencyScore ?? 0;
                  const priority      = complaint.priority ?? "MEDIUM";
                  const status        = complaint.status ?? "PENDING";
                  const voteCount     = complaint.votes?.length ?? 0;
                  const hasVoted      = votedIds.has(complaint._id);
                  const isVoting      = votingId === complaint._id;
                  const priorityStyle = getPriorityStyle(priority);
                  const statusStyle   = getStatusStyle(status);
                  const statusDot     = getStatusDot(status);
                  const rankStyle     = getRankStyle(rank);
                  const urgencyLabel  = getUrgencyLabel(urgencyScore);

                  return (
                    <div
                      key={complaint._id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-150"
                    >
                      {/* Rank + Urgency bar */}
                      <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-gray-100">
                        <span className={`text-xs font-bold w-7 h-7 rounded-full border flex items-center justify-center shrink-0 ${rankStyle.pill}`}>
                          #{rank}
                        </span>
                        <UrgencyBar score={urgencyScore} />
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${urgencyLabel.style}`}>
                          {urgencyLabel.text}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="px-5 py-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                            {complaint.title}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${priorityStyle.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
                            {priority.charAt(0) + priority.slice(1).toLowerCase()}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mb-3">
                          Filed by{" "}
                          <span className="font-semibold text-gray-700">{complaint.name}</span>
                          {complaint.district && (
                            <>
                              <span className="text-gray-300 mx-1">•</span>
                              <span className="inline-flex items-center gap-1">
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {complaint.district}
                              </span>
                            </>
                          )}
                        </p>

                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
                          {complaint.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleVote(complaint._id)}
                              disabled={hasVoted || isVoting}
                              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                                hasVoted
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default"
                                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                              }`}
                            >
                              {isVoting ? (
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill={hasVoted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              )}
                              {voteCount} {hasVoted ? "Voted" : "Vote"}
                            </button>

                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyle}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                              {status.replace("_", " ").charAt(0) + status.replace("_", " ").slice(1).toLowerCase()}
                            </span>
                          </div>

                          <span className="text-xs text-gray-300 tabular-nums">
                            score: {urgencyScore.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT: Sticky Sidebar (1/3) ── */}
          <div className="space-y-5 lg:sticky lg:top-6">

            {/* District Filter */}
            {!loading && availableDistricts.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-3.5 h-3.5 text-[#1a3a6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Filter by District</p>
                </div>

                <div className="space-y-1.5">
                  {/* All button */}
                  <button
                    type="button"
                    onClick={() => setSelectedDistrict("ALL")}
                    className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                      selectedDistrict === "ALL"
                        ? "bg-[#1a3a6b] border-[#1a3a6b] text-white"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-[#1a3a6b]/30 hover:text-[#1a3a6b]"
                    }`}
                  >
                    <span>All Districts</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      selectedDistrict === "ALL" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                      {complaints.length}
                    </span>
                  </button>

                  {availableDistricts.map((district) => {
                    const count    = complaints.filter((c) => c.district === district).length;
                    const isActive = selectedDistrict === district;
                    return (
                      <button
                        key={district}
                        type="button"
                        onClick={() => setSelectedDistrict(district)}
                        className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                          isActive
                            ? "bg-[#1a3a6b] border-[#1a3a6b] text-white"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-[#1a3a6b]/30 hover:text-[#1a3a6b]"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {district}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Status Breakdown */}
            {!loading && complaints.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-3.5 h-3.5 text-[#1a3a6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status Breakdown</p>
                </div>
                <div className="space-y-2">
                  {statusGroups.filter((s) => s.count > 0).map(({ status, count, label, dot, style }) => {
                    const pct = Math.round((count / complaints.length) * 100);
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${style}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                            {label}
                          </span>
                          <span className="text-xs text-gray-500 font-semibold">{count}</span>
                        </div>
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${dot}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ML Scoring Weights */}
            {!loading && complaints.length > 0 && (
              <div className="bg-white rounded-xl border border-blue-100 px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 leading-none">ML Urgency Ranking</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Scoring weights</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {Object.entries(scoringWeights).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500 capitalize">{key}</span>
                        <span className="text-xs font-bold text-[#1a3a6b]">{Math.round(val * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1a3a6b] rounded-full"
                          style={{ width: `${Math.round(val * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total votes info */}
            {!loading && complaints.length > 0 && (
              <div className="bg-[#1a3a6b]/[0.04] rounded-xl border border-[#1a3a6b]/10 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a3a6b]/50 mb-3">Community Engagement</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#1a3a6b]">{totalVotes}</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">Total Votes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#1a3a6b]">{availableDistricts.length}</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">Districts</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentContent;