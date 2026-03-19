import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateComplaint = () => {
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress]         = useState("");
  const [district, setDistrict]       = useState("");
  const [department, setDepartment]   = useState("");
  const [departments, setDepartments] = useState([]);
  const [priority, setPriority]       = useState("MEDIUM");
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [citizenName, setCitizenName] = useState("");
  const [citizenEmail, setCitizenEmail] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionNote, setSuggestionNote] = useState("");
  const [submitting, setSubmitting]   = useState(false);
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
    setSuccess("");
    const token = localStorage.getItem("token");
    if (!token) return setError("Session expired. Please log in again.");
    setSubmitting(true);
    try {
      await axios.post(
        "http://localhost:5000/api/citizen/complaints/add",
        { title, description, phoneNumber, address, district, department, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Complaint submitted successfully. You will be redirected shortly.");
      setTimeout(() => navigate("/citizen/dashboard"), 2000);
    } catch {
      setError("Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Parse suggestion note into type + message
  const getSuggestionDisplay = () => {
    if (!suggestionNote) return null;
    const [type, ...rest] = suggestionNote.split(":");
    const msg = rest.join(":");
    if (type === "matched")
      return { style: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "check", text: `AI suggested and matched: "${msg}"` };
    if (type === "partial")
      return { style: "bg-amber-50 text-amber-700 border-amber-200", icon: "warn", text: `AI suggested "${msg}" — no exact match found. Please select manually.` };
    if (type === "none")
      return { style: "bg-gray-50 text-gray-500 border-gray-200", icon: "info", text: "No suggestion available. Please select manually." };
    return { style: "bg-red-50 text-red-600 border-red-200", icon: "error", text: "Could not get a suggestion. Please select manually." };
  };

  const suggestion = getSuggestionDisplay();

  const inputBase = "w-full px-3 py-2.5 text-sm border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b] transition-colors text-gray-800";

  const initials = citizenName?.charAt(0)?.toUpperCase() || "C";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-[#1a3a6b] text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate("/citizen/dashboard")}
            className="flex items-center gap-1.5 text-blue-300 hover:text-white text-xs mb-4 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">
            Citizen Portal
          </p>
          <h1 className="text-2xl font-bold text-white">File a Complaint</h1>
          <p className="text-blue-200 text-sm mt-1">
            Submit your complaint to the relevant government department.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="max-w-2xl">

          {/* Citizen Info Card */}
          <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{citizenName || "Loading..."}</p>
              <p className="text-xs text-gray-400 truncate">{citizenEmail || ""}</p>
            </div>
            <span className="ml-auto shrink-0 text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded-full">
              Citizen
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Section: Complaint Details */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Complaint Details
                </h3>
              </div>
              <div className="px-5 py-5 space-y-5">

                {/* Title + Suggest */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Complaint Title <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className={`${inputBase} flex-1`}
                      placeholder="e.g. Road damage near school, Water supply issue..."
                      value={title}
                      onChange={(e) => { setTitle(e.target.value); setSuggestionNote(""); }}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleSuggestDepartment}
                      disabled={isSuggesting || !title.trim()}
                      className="shrink-0 flex items-center gap-1.5 bg-[#1a3a6b] hover:bg-[#15336b] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                    >
                      {isSuggesting ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          AI Suggest
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400">
                    Enter your complaint title, then click <span className="font-medium text-gray-500">AI Suggest</span> to auto-detect the relevant department.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className={`${inputBase} resize-none`}
                    placeholder="Describe your complaint in detail..."
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

            {/* Section: Contact & Location */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Contact & Location
                </h3>
              </div>
              <div className="px-5 py-5 space-y-4">

                {/* Phone + District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
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
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
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

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
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

            {/* Section: Assignment */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Department & Priority
                </h3>
              </div>
              <div className="px-5 py-5 space-y-5">

                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Department <span className="text-red-400">*</span>
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

                  {/* AI Suggestion feedback */}
                  {suggestion && (
                    <div className={`mt-2 flex items-start gap-2 text-xs px-3 py-2 rounded-lg border ${suggestion.style}`}>
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
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Priority Level <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-3">
                    {[
                      { level: "LOW",    activeStyle: "bg-gray-100 border-gray-400 text-gray-700",     dot: "bg-gray-400"    },
                      { level: "MEDIUM", activeStyle: "bg-amber-50 border-amber-400 text-amber-700",   dot: "bg-amber-400"   },
                      { level: "HIGH",   activeStyle: "bg-red-50 border-red-400 text-red-700",         dot: "bg-red-400"     },
                    ].map(({ level, activeStyle, dot }) => (
                      <label
                        key={level}
                        className={`flex-1 flex items-center justify-center gap-2 cursor-pointer border-2 rounded-lg py-2.5 text-xs font-semibold transition-all ${
                          priority === level
                            ? activeStyle
                            : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
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
                        <span className={`w-2 h-2 rounded-full ${priority === level ? dot : "bg-gray-300"}`} />
                        {level.charAt(0) + level.slice(1).toLowerCase()}
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate("/citizen/dashboard")}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#1a3a6b] hover:bg-[#15336b] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
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
                  "Submit Complaint"
                )}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-5">
              Your complaint will be reviewed by the assigned department.
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;