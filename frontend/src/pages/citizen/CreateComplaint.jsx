import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../../components/SuccessModal";

const CreateComplaint = () => {
  const [title, setTitle]               = useState("");
  const [description, setDescription]   = useState("");
  const [phoneNumber, setPhoneNumber]   = useState("");
  const [address, setAddress]           = useState("");
  const [district, setDistrict]         = useState("");
  const [department, setDepartment]     = useState("");
  const [departments, setDepartments]   = useState([]);
  const [priority, setPriority]         = useState("MEDIUM");
  const [error, setError]               = useState("");
  const [citizenName, setCitizenName]   = useState("");
  const [citizenEmail, setCitizenEmail] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionNote, setSuggestionNote] = useState("");
  const [submitting, setSubmitting]     = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const districtsList = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle",
    "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Batticaloa",
    "Ampara", "Trincomalee", "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa",
    "Badulla", "Moneragala", "Ratnapura", "Kegalle", "Mullaitivu",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/citizen/login");
      try {
        const [deptRes, citizenRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/departments", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/citizen/me",         { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setDepartments(deptRes.data);
        setCitizenName(citizenRes.data.name);
        setCitizenEmail(citizenRes.data.email);
      } catch {
        setError("Failed to load form data. Please refresh and try again.");
      }
    };
    fetchData();
  }, [navigate]);

  const handleSuggestDepartment = async () => {
    if (!title.trim()) {
      setSuggestionNote("Please enter a complaint title first.");
      return;
    }
    setIsSuggesting(true);
    setSuggestionNote("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/citizen/complaints/suggest-department",
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { suggestedDepartment, suggestedDepartmentId } = response.data;
      if (suggestedDepartmentId) {
        setDepartment(suggestedDepartmentId);
        setSuggestionNote(`matched:${suggestedDepartment}`);
      } else if (suggestedDepartment) {
        setSuggestionNote(`partial:${suggestedDepartment}`);
      } else {
        setSuggestionNote("none:");
      }
    } catch {
      setSuggestionNote("error:");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    if (!token) return setError("Session expired. Please log in again.");
    setSubmitting(true);
    try {
      await axios.post(
        "http://localhost:5000/api/citizen/complaints/add",
        { title, description, phoneNumber, address, district, department, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowSuccessModal(true);
    } catch {
      setError("Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getSuggestionDisplay = () => {
    if (!suggestionNote) return null;
    const [type, ...rest] = suggestionNote.split(":");
    const msg = rest.join(":");
    if (type === "matched")
      return { style: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "check", text: `AI matched: "${msg}"` };
    if (type === "partial")
      return { style: "bg-amber-50 text-amber-700 border-amber-200", icon: "warn", text: `AI suggested "${msg}" — select manually.` };
    if (type === "none")
      return { style: "bg-gray-50 text-gray-500 border-gray-200", icon: "info", text: "No suggestion found. Please select manually." };
    return { style: "bg-red-50 text-red-600 border-red-200", icon: "error", text: "Could not get a suggestion. Please select manually." };
  };

  const suggestion = getSuggestionDisplay();

  const inputBase =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/20 focus:border-[#1a3a6b] transition-all text-gray-800 placeholder-gray-400";

  const SectionLabel = ({ children }) => (
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
      <span className="inline-block w-4 h-px bg-gray-300" />
      {children}
      <span className="flex-1 h-px bg-gray-100" />
    </p>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-[#1a3a6b] text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">
            Citizen Portal
          </p>
          <h1 className="text-2xl font-bold text-white">File a Complaint</h1>
          <p className="text-blue-200 text-sm mt-1">
            Submit your complaint to the relevant government department.
          </p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="max-w-screen-xl mx-auto px-6 pt-4">
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Main content — two-column grid */}
      <div className="max-w-screen-xl mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

            {/* ── LEFT COLUMN (3/5) — Complaint core details ── */}
            <div className="lg:col-span-3 space-y-4">

              {/* Complaint Details card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 pt-5 pb-4">
                  <SectionLabel>Complaint Details</SectionLabel>

                  {/* Title */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Complaint Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputBase}
                      placeholder="e.g. Road damage near school, Water supply issue..."
                      value={title}
                      onChange={(e) => { setTitle(e.target.value); setSuggestionNote(""); }}
                      required
                    />
                  </div>

                  {/* AI Suggest button + inline feedback — right below title */}
                  <div className="mb-4 p-3.5 rounded-lg border border-dashed border-[#1a3a6b]/20 bg-[#1a3a6b]/[0.03]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[#1a3a6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-xs font-semibold text-[#1a3a6b]">AI Department Suggestion</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleSuggestDepartment}
                        disabled={isSuggesting || !title.trim()}
                        className="flex items-center gap-1.5 bg-[#1a3a6b] hover:bg-[#15336b] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors"
                      >
                        {isSuggesting ? (
                          <>
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Analyzing...
                          </>
                        ) : "Suggest Dept"}
                      </button>
                    </div>

                    {/* Suggestion result — visible right here */}
                    {suggestion ? (
                      <div className={`flex items-start gap-2 text-xs px-3 py-2 rounded-lg border ${suggestion.style}`}>
                        {suggestion.icon === "check" && (
                          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {suggestion.icon === "warn" && (
                          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                          </svg>
                        )}
                        {(suggestion.icon === "info" || suggestion.icon === "error") && (
                          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        <span>{suggestion.text}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">
                        Enter a title above, then click <span className="font-medium text-gray-500">Suggest Dept</span> to auto-detect the department.
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={5}
                      className={`${inputBase} resize-none`}
                      placeholder="Describe your complaint in detail — include specific location, date, and any relevant context..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-gray-400">{description.length} characters</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Location card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 pt-5 pb-5">
                  <SectionLabel>Contact & Location</SectionLabel>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        className={inputBase}
                        placeholder="07X XXX XXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        District <span className="text-red-400">*</span>
                      </label>
                      <select
                        className={inputBase}
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        required
                      >
                        <option value="">Select District</option>
                        {districtsList.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputBase}
                      placeholder="Your full address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN (2/5) — Department, Priority, Submit ── */}
            <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-20">

              {/* Department card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 pt-5 pb-5">
                  <SectionLabel>Department</SectionLabel>

                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Assign to Department <span className="text-red-400">*</span>
                  </label>
                  <select
                    className={`${inputBase} ${department ? "border-emerald-300 bg-emerald-50 focus:border-emerald-400 focus:ring-emerald-200/50" : ""}`}
                    value={department}
                    onChange={(e) => { setDepartment(e.target.value); setSuggestionNote(""); }}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>

                  {department && (
                    <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Department selected
                    </p>
                  )}
                </div>
              </div>

              {/* Priority card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 pt-5 pb-5">
                  <SectionLabel>Priority Level</SectionLabel>

                  <div className="space-y-2">
                    {[
                      {
                        level: "LOW",
                        label: "Low",
                        desc: "Non-urgent, can wait",
                        activeStyle: "border-gray-400 bg-gray-50",
                        dot: "bg-gray-400",
                        textActive: "text-gray-700",
                      },
                      {
                        level: "MEDIUM",
                        label: "Medium",
                        desc: "Needs attention soon",
                        activeStyle: "border-amber-400 bg-amber-50",
                        dot: "bg-amber-400",
                        textActive: "text-amber-700",
                      },
                      {
                        level: "HIGH",
                        label: "High",
                        desc: "Urgent, immediate action",
                        activeStyle: "border-red-400 bg-red-50",
                        dot: "bg-red-500",
                        textActive: "text-red-700",
                      },
                    ].map(({ level, label, desc, activeStyle, dot, textActive }) => (
                      <label
                        key={level}
                        className={`flex items-center gap-3 cursor-pointer border-2 rounded-lg px-4 py-3 transition-all ${
                          priority === level
                            ? `${activeStyle}`
                            : "bg-white border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={level}
                          checked={priority === level}
                          onChange={() => setPriority(level)}
                          className="hidden"
                        />
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${priority === level ? dot : "bg-gray-200"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold ${priority === level ? textActive : "text-gray-500"}`}>
                            {label}
                          </p>
                          <p className="text-[10px] text-gray-400 leading-tight">{desc}</p>
                        </div>
                        {priority === level && (
                          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-5 space-y-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#1a3a6b] hover:bg-[#15336b] active:bg-[#102d5a] text-white text-sm font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                  >
                    {submitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Submit Complaint
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/citizen/dashboard")}
                    className="w-full text-sm font-medium text-gray-500 hover:text-gray-700 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-colors"
                  >
                    Cancel
                  </button>

                  <p className="text-center text-[11px] text-gray-400 pt-1">
                    Your complaint will be reviewed by the assigned department.
                  </p>
                </div>
              </div>

              {/* Quick checklist */}
              <div className="bg-[#1a3a6b]/[0.04] rounded-xl border border-[#1a3a6b]/10 px-4 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a3a6b]/60 mb-2.5">Before you submit</p>
                {[
                  "Title clearly describes the issue",
                  "Description includes relevant details",
                  "Contact info is correct",
                  "Department selected",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1.5">
                    <div className="w-4 h-4 rounded border border-[#1a3a6b]/20 bg-white flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1a3a6b]/20" />
                    </div>
                    <span className="text-xs text-gray-500">{item}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </form>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onDone={() => {
          setShowSuccessModal(false);
          navigate("/citizen/dashboard");
        }}
      />
    </div>
  );
};

export default CreateComplaint;