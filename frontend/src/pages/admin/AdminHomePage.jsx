import React from 'react';
import { useNavigate } from 'react-router-dom';

const roles = [
  {
    key: "citizen",
    label: "Citizen",
    description: "Submit complaints and track service requests.",
    path: "/citizen/login",
    registerPath: "/citizen/register",
    accent: "border-sky-200 hover:border-sky-400",
    iconBg: "bg-sky-50 group-hover:bg-sky-100",
    iconColor: "text-sky-600",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    key: "minister",
    label: "Minister",
    description: "Oversee department operations and complaints.",
    path: "/minister/login",
    accent: "border-violet-200 hover:border-violet-400",
    iconBg: "bg-violet-50 group-hover:bg-violet-100",
    iconColor: "text-violet-600",
    badgeClass: "bg-violet-50 text-violet-700 border-violet-200",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    key: "agent",
    label: "Agent",
    description: "Review and resolve assigned service complaints.",
    path: "/agent/login",
    accent: "border-emerald-200 hover:border-emerald-400",
    iconBg: "bg-emerald-50 group-hover:bg-emerald-100",
    iconColor: "text-emerald-600",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    key: "police",
    label: "Police",
    description: "Manage and respond to private citizen complaints.",
    path: "/police/login",
    accent: "border-red-200 hover:border-red-400",
    iconBg: "bg-red-50 group-hover:bg-red-100",
    iconColor: "text-red-600",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    key: "admin",
    label: "Administrator",
    description: "Full system access, user and department management.",
    path: "/admin/login",
    accent: "border-amber-200 hover:border-amber-400",
    iconBg: "bg-amber-50 group-hover:bg-amber-100",
    iconColor: "text-amber-600",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const AdminHomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = (role) => {
    if (role === "admin")     navigate("/admin/login");
    else if (role === "minister") navigate("/minister/login");
    else if (role === "agent")    navigate("/agent/login");
    else if (role === "police")   navigate("/police/login");
    else if (role === "citizen")  navigate("/citizen/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Hero Header */}
      <div className="bg-[#1a3a6b] text-white">
        <div className="max-w-screen-md mx-auto px-6 py-12 text-center">
          {/* Emblem */}
          <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">GovConnect Sri Lanka</h1>
          <p className="mt-2 text-blue-200 text-sm max-w-sm mx-auto leading-relaxed">
            Integrated citizen services and government administration portal.
            Select your role to continue.
          </p>
        </div>
      </div>

      {/* Role Selection */}
      <div className="flex-1 max-w-screen-md mx-auto w-full px-6 py-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5 text-center">
          Select Portal Access
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roles.map((role) => (
            <button
              key={role.key}
              onClick={() => handleNavigate(role.key)}
              className={`group bg-white border-2 rounded-xl p-5 text-left hover:shadow-md transition-all duration-200 flex items-start gap-4 ${role.accent}`}
            >
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${role.iconBg}`}>
                <span className={role.iconColor}>{role.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-gray-800">{role.label}</p>
                  {role.key === "citizen" && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${role.badgeClass}`}>
                      Public
                    </span>
                  )}
                  {role.key === "admin" && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${role.badgeClass}`}>
                      Restricted
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{role.description}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 shrink-0 mt-0.5 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Citizen register shortcut */}
        <p className="text-center text-xs text-gray-400 mt-6">
          New to GovConnect?{' '}
          <button
            onClick={() => navigate("/citizen/register")}
            className="text-[#1a3a6b] font-medium hover:underline"
          >
            Register as a Citizen
          </button>
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white">
        <p className="text-center text-xs text-gray-400 py-4">
          Government of Sri Lanka &mdash; GovConnect Platform
        </p>
      </div>

    </div>
  );
};

export default AdminHomePage;