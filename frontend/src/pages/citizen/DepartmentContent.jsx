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
  if (rank === 1) return "bg-red-100 text-red-600 border-red-200";
  if (rank === 2) return "bg-amber-100 text-amber-600 border-amber-200";
  if (rank === 3) return "bg-blue-100 text-blue-600 border-blue-200";
  return "bg-gray-100 text-gray-500 border-gray-200";
};

const getUrgencyColor = (score) => {
  if (score >= 0.7) return "bg-red-500";
  if (score >= 0.4) return "bg-amber-500";
  return "bg-emerald-500";
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

const DepartmentContent = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [votingId, setVotingId]     = useState(null);
  const [votedIds, setVotedIds]     = useState(new Set());
  const [weights, setWeights]       = useState(null);
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
      } catch (err) {
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

  const deptName      = complaints[0]?.department?.name ?? "Department";
  const scoringWeights = weights ?? { votes: 0.60, priority: 0.40 };

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
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">
            Citizen Portal
          </p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {loading ? "Loading..." : deptName}
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Complaints ranked by ML urgency score — highest urgency first.
              </p>
            </div>
            {!loading && complaints.length > 0 && (
              <span className="shrink-0 text-xs font-medium bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-full">
                {complaints.length} complaint{complaints.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="max-w-3xl">

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

          {/* ML Info Banner */}
          {!loading && complaints.length > 0 && (
            <div className="mb-6 bg-white border border-blue-100 rounded-xl px-5 py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">ML Urgency Ranking</p>
                  <p className="text-xs text-gray-500">Scoring weights applied to this ranking</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(scoringWeights).map(([key, val]) => (
                  <div key={key} className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-center">
                    <p className="text-sm font-bold text-[#1a3a6b]">{Math.round(val * 100)}%</p>
                    <p className="text-xs text-gray-500 capitalize mt-0.5">{key}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-gray-100" />
                    <div className="flex-1 h-2 bg-gray-100 rounded-full" />
                    <div className="w-8 h-2 bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : complaints.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl py-16 text-center">
              <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-500">No complaints filed yet</p>
              <p className="text-xs text-gray-400 mt-1">This department has no complaints at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint, index) => {
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

                return (
                  <div
                    key={complaint._id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow duration-150"
                  >
                    {/* Rank + Urgency bar */}
                    <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-gray-100">
                      <span className={`text-xs font-bold w-7 h-7 rounded-full border flex items-center justify-center shrink-0 ${rankStyle}`}>
                        #{rank}
                      </span>
                      <UrgencyBar score={urgencyScore} />
                      <span className="text-xs text-gray-400 shrink-0">Urgency</span>
                    </div>

                    {/* Body */}
                    <div className="px-5 py-4">
                      {/* Title + Priority */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                          {complaint.title}
                        </h3>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${priorityStyle.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
                          {priority.charAt(0) + priority.slice(1).toLowerCase()}
                        </span>
                      </div>

                      {/* Filed by */}
                      <p className="text-xs text-gray-500 mb-3">
                        Filed by{" "}
                        <span className="font-semibold text-gray-700">{complaint.name}</span>
                        {complaint.district && (
                          <>
                            <span className="text-gray-300 mx-1">•</span>
                            <span>{complaint.district}</span>
                          </>
                        )}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
                        {complaint.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          {/* Vote button */}
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

                          {/* Status badge */}
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyle}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                            {status.replace("_", " ").charAt(0) + status.replace("_", " ").slice(1).toLowerCase()}
                          </span>
                        </div>

                        {/* Raw score */}
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
      </div>
    </div>
  );
};

export default DepartmentContent;