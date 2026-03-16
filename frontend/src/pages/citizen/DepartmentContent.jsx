import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const getPriorityStyle = (priority) => {
  const map = {
    HIGH:   { dot: "bg-red-500",    pill: "bg-red-50 text-red-700 border-red-200" },
    MEDIUM: { dot: "bg-amber-500",  pill: "bg-amber-50 text-amber-700 border-amber-200" },
    LOW:    { dot: "bg-slate-400",  pill: "bg-slate-50 text-slate-600 border-slate-200" },
  };
  return map[priority] ?? { dot: "bg-gray-400", pill: "bg-gray-50 text-gray-600 border-gray-200" };
};

const getStatusStyle = (status) => {
  const map = {
    PENDING:     "bg-yellow-50 text-yellow-700 border-yellow-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    RESOLVED:    "bg-green-50 text-green-700 border-green-200",
    REJECTED:    "bg-red-50 text-red-700 border-red-200",
  };
  return map[status] ?? "bg-gray-50 text-gray-600 border-gray-200";
};

const getRankStyle = (rank) => {
  if (rank === 1) return "bg-red-100 text-red-600";
  if (rank === 2) return "bg-amber-100 text-amber-600";
  if (rank === 3) return "bg-blue-100 text-blue-600";
  return "bg-slate-100 text-slate-500";
};

const getUrgencyColor = (score) => {
  if (score >= 0.7) return "bg-red-500";
  if (score >= 0.4) return "bg-amber-500";
  return "bg-green-500";
};

const UrgencyBar = ({ score }) => {
  const pct = Math.round((score ?? 0) * 100);
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${getUrgencyColor(score ?? 0)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 w-8 text-right tabular-nums">{pct}%</span>
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
          c._id === complaintId
            ? { ...c, votes: response.data.complaint.votes }
            : c
        )
      );
      setVotedIds((prev) => new Set([...prev, complaintId]));
    } catch (err) {
      const msg = err.response?.data?.error;
      if (msg === "You have already voted on this complaint") {
        setVotedIds((prev) => new Set([...prev, complaintId]));
      } else {
        setError("Failed to vote. Please try again.");
      }
    } finally {
      setVotingId(null);
    }
  };

  const deptName = complaints[0]?.department?.name ?? "Department";
  const scoringWeights = weights ?? { votes: 0.60, priority: 0.40 };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1 transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{deptName}</h1>
              <p className="text-sm text-slate-500 mt-1">
                Complaints ranked by urgency score
              </p>
            </div>
            {complaints.length > 0 && (
              <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-full font-medium flex-shrink-0">
                {complaints.length} complaint{complaints.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* ML Info Banner */}
        {complaints.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">ML Urgency Ranking</p>
                <p className="text-xs text-blue-500">Sorted highest urgency first</p>
              </div>
            </div>

            {/* Scoring weights — 2 cols */}
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(scoringWeights).map(([key, val]) => (
                <div key={key} className="bg-white rounded-lg px-2 py-1.5 text-center border border-blue-100">
                  <div className="text-xs font-bold text-blue-700">{Math.round(val * 100)}%</div>
                  <div className="text-xs text-slate-500 capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                <div className="h-3 bg-slate-100 rounded w-full mb-3" />
                <div className="h-4 bg-slate-100 rounded w-2/3 mb-3" />
                <div className="h-3 bg-slate-100 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-medium">No complaints yet</p>
            <p className="text-sm mt-1">This department has no complaints filed.</p>
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
              const rankStyle     = getRankStyle(rank);

              return (
                <div
                  key={complaint._id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  {/* Rank + Urgency bar */}
                  <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-slate-50">
                    <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${rankStyle}`}>
                      #{rank}
                    </span>
                    <UrgencyBar score={urgencyScore} />
                    <span className="text-xs text-slate-400 flex-shrink-0">Urgency</span>
                  </div>

                  {/* Body */}
                  <div className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-slate-800 text-base leading-snug">
                        {complaint.title}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 flex items-center gap-1 ${priorityStyle.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
                        {priority.charAt(0) + priority.slice(1).toLowerCase()}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 mb-1">
                      Filed by <span className="font-medium text-slate-700">{complaint.name}</span>
                      {complaint.district && <span> · {complaint.district}</span>}
                    </p>

                    <p className="text-sm text-slate-600 mt-2 mb-4 leading-relaxed line-clamp-2">
                      {complaint.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVote(complaint._id)}
                          disabled={hasVoted || isVoting}
                          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border font-medium transition-all ${
                            hasVoted
                              ? "bg-green-50 border-green-200 text-green-700 cursor-default"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
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

                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusStyle}`}>
                          {status.replace("_", " ").charAt(0) + status.replace("_", " ").slice(1).toLowerCase()}
                        </span>
                      </div>

                      <span className="text-xs text-slate-300 tabular-nums">
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
  );
};

export default DepartmentContent;