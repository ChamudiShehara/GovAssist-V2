import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const getPriorityConfig = (priority) => {
  const map = {
    HIGH:   { dot: "bg-red-500",   pill: "bg-red-50 text-red-700 border-red-200",      bar: "bg-red-500",   label: "High"   },
    MEDIUM: { dot: "bg-amber-500", pill: "bg-amber-50 text-amber-700 border-amber-200", bar: "bg-amber-500", label: "Medium" },
    LOW:    { dot: "bg-gray-400",  pill: "bg-gray-100 text-gray-600 border-gray-200",  bar: "bg-gray-400",  label: "Low"    },
  };
  return map[priority] ?? map.MEDIUM;
};

const getStatusConfig = (status) => {
  const map = {
    PENDING:     { pill: "bg-amber-100 text-amber-700 border-amber-200",    dot: "bg-amber-400",   label: "Pending",     icon: "clock"   },
    IN_PROGRESS: { pill: "bg-blue-100 text-blue-700 border-blue-200",       dot: "bg-blue-400",    label: "In Progress", icon: "refresh" },
    RESOLVED:    { pill: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-400", label: "Resolved",  icon: "check"   },
    REJECTED:    { pill: "bg-red-100 text-red-700 border-red-200",          dot: "bg-red-400",     label: "Rejected",    icon: "x"       },
  };
  return map[status] ?? map.PENDING;
};

const StatusIcon = ({ type, className }) => {
  if (type === "clock")
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  if (type === "refresh")
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    );
  if (type === "check")
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
};

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

const timelineSteps = [
  { key: "PENDING",     label: "Submitted",   sub: "Complaint received"        },
  { key: "IN_PROGRESS", label: "In Progress",  sub: "Being reviewed"            },
  { key: "RESOLVED",    label: "Resolved",     sub: "Issue addressed"           },
];

const getTimelineIndex = (status) => {
  if (status === "REJECTED") return -1;
  return ["PENDING", "IN_PROGRESS", "RESOLVED"].indexOf(status);
};

/* ─── Detail row helper ───────────────────────────────────────────────── */
const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium leading-snug">{value || "—"}</p>
    </div>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────── */
const ComplaintDetails = () => {
  const { complaintId } = useParams();
  const navigate        = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/citizen/login");
      try {
        const res = await axios.get(
          `http://localhost:5000/api/citizen/complaints/${complaintId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComplaint(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Complaint not found.");
        } else {
          setError("Failed to load complaint details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [complaintId, navigate]);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#1a3a6b] h-40" />
        <div className="max-w-screen-xl mx-auto px-6 -mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 h-56" />
              <div className="bg-white rounded-xl border border-gray-200 h-40" />
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 h-48" />
              <div className="bg-white rounded-xl border border-gray-200 h-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">{error || "Something went wrong"}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-3 text-xs font-semibold text-[#1a3a6b] border border-[#1a3a6b]/25 hover:bg-[#1a3a6b]/[0.04] px-4 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const priorityCfg    = getPriorityConfig(complaint.priority);
  const statusCfg      = getStatusConfig(complaint.status);
  const timelineIdx    = getTimelineIndex(complaint.status);
  const isRejected     = complaint.status === "REJECTED";
  const voteCount      = complaint.votes?.length ?? 0;
  const deptName       = complaint.department?.name ?? "Not Assigned";
  const agentName      = complaint.assignedAgent?.name ?? null;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page Header ── */}
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

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white leading-snug pr-4">
                {complaint.title}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {/* Status badge */}
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusCfg.pill}`}>
                  <StatusIcon type={statusCfg.icon} className="w-3 h-3" />
                  {statusCfg.label}
                </span>
                {/* Priority badge */}
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${priorityCfg.pill}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${priorityCfg.dot}`} />
                  {priorityCfg.label} Priority
                </span>
                {/* Vote count */}
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 border border-white/20 text-white px-2.5 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  {voteCount} vote{voteCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Complaint ID chip */}
            <div className="shrink-0 text-right">
              <p className="text-[10px] text-blue-300 uppercase tracking-widest mb-1">Complaint ID</p>
              <p className="text-xs font-mono text-white/70 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                {complaint._id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ── LEFT: Main content (2/3) ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Status Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-5 flex items-center gap-2">
                <span className="inline-block w-3 h-px bg-gray-300" />
                Progress Timeline
                <span className="flex-1 h-px bg-gray-100" />
              </p>

              {isRejected ? (
                <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-700">Complaint Rejected</p>
                    <p className="text-xs text-red-500 mt-0.5">This complaint has been reviewed and rejected by the department.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-0">
                  {timelineSteps.map((step, i) => {
                    const isDone    = i <= timelineIdx;
                    const isCurrent = i === timelineIdx;
                    const isLast    = i === timelineSteps.length - 1;

                    return (
                      <div key={step.key} className="flex-1 flex flex-col items-center relative">
                        {/* Connector line */}
                        {!isLast && (
                          <div className="absolute top-5 left-1/2 w-full h-0.5 z-0">
                            <div className="h-full bg-gray-100" />
                            <div
                              className="h-full bg-[#1a3a6b] absolute top-0 left-0 transition-all duration-500"
                              style={{ width: i < timelineIdx ? "100%" : "0%" }}
                            />
                          </div>
                        )}

                        {/* Step circle */}
                        <div className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                          isCurrent
                            ? "bg-[#1a3a6b] border-[#1a3a6b] shadow-md"
                            : isDone
                            ? "bg-[#1a3a6b] border-[#1a3a6b]"
                            : "bg-white border-gray-200"
                        }`}>
                          {isDone ? (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-gray-300" />
                          )}
                        </div>

                        {/* Label */}
                        <div className="mt-3 text-center px-1">
                          <p className={`text-xs font-bold ${isDone ? "text-[#1a3a6b]" : "text-gray-400"}`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{step.sub}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Complaint Description */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <span className="inline-block w-3 h-px bg-gray-300" />
                Complaint Description
                <span className="flex-1 h-px bg-gray-100" />
              </p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {/* Contact & Location */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                <span className="inline-block w-3 h-px bg-gray-300" />
                Contact & Location
                <span className="flex-1 h-px bg-gray-100" />
              </p>

              <DetailRow
                label="Full Name"
                value={complaint.name}
                icon={
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
              <DetailRow
                label="Email"
                value={complaint.email}
                icon={
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              <DetailRow
                label="Phone Number"
                value={complaint.phoneNumber}
                icon={
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />
              <DetailRow
                label="District"
                value={complaint.district}
                icon={
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
              <DetailRow
                label="Address"
                value={complaint.address}
                icon={
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* ── RIGHT: Sidebar (1/3) ── */}
          <div className="space-y-5 lg:sticky lg:top-6">

            {/* Department & Assignment */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <span className="inline-block w-3 h-px bg-gray-300" />
                Assignment
                <span className="flex-1 h-px bg-gray-100" />
              </p>

              {/* Department */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Department</p>
                <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border ${
                  complaint.department ? "bg-[#1a3a6b]/[0.04] border-[#1a3a6b]/15" : "bg-gray-50 border-gray-200"
                }`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    complaint.department ? "bg-[#1a3a6b]" : "bg-gray-200"
                  }`}>
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{deptName}</p>
                    {!complaint.department && (
                      <p className="text-[10px] text-gray-400">Awaiting assignment</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Assigned Agent */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Assigned Agent</p>
                <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border ${
                  agentName ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
                }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    agentName ? "bg-emerald-500" : "bg-gray-200"
                  }`}>
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${agentName ? "text-emerald-800" : "text-gray-400"}`}>
                      {agentName ?? "Not yet assigned"}
                    </p>
                    {agentName && <p className="text-[10px] text-emerald-600">Handling this complaint</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <span className="inline-block w-3 h-px bg-gray-300" />
                Metadata
                <span className="flex-1 h-px bg-gray-100" />
              </p>

              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Filed On</p>
                  <p className="text-sm font-semibold text-gray-700">{formatDate(complaint.createdAt)}</p>
                  <p className="text-[10px] text-gray-400">{formatTime(complaint.createdAt)}</p>
                </div>
                <div className="h-px bg-gray-100" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Last Updated</p>
                  <p className="text-sm font-semibold text-gray-700">{formatDate(complaint.updatedAt)}</p>
                  <p className="text-[10px] text-gray-400">{formatTime(complaint.updatedAt)}</p>
                </div>
                <div className="h-px bg-gray-100" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Community Support</p>
                  <div className="flex items-center gap-2 mt-1">
                    <svg className="w-4 h-4 text-[#1a3a6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="text-sm font-bold text-[#1a3a6b]">{voteCount}</span>
                    <span className="text-xs text-gray-500">citizen{voteCount !== 1 ? "s" : ""} voted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Priority visual */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <span className="inline-block w-3 h-px bg-gray-300" />
                Priority Level
                <span className="flex-1 h-px bg-gray-100" />
              </p>
              <div className={`flex items-center gap-3 px-3 py-3 rounded-lg border ${priorityCfg.pill}`}>
                <span className={`w-3 h-3 rounded-full shrink-0 ${priorityCfg.dot}`} />
                <span className="text-sm font-bold">{priorityCfg.label} Priority</span>
              </div>
              {/* Priority bar */}
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${priorityCfg.bar}`}
                  style={{ width: complaint.priority === "HIGH" ? "100%" : complaint.priority === "MEDIUM" ? "60%" : "25%" }}
                />
              </div>
            </div>

            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 bg-white rounded-xl py-3 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;