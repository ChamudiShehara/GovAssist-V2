import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      setUserName('');
      setUserEmail('');
      setUserRole('');
      return;
    }

    const urlMap = {
      admin:    "http://localhost:5000/api/admin/profile",
      minister: "http://localhost:5000/api/minister/profile",
      agent:    "http://localhost:5000/api/agent/profile",
      citizen:  "http://localhost:5000/api/citizen/me",
    };

    const url = urlMap[role];
    if (!url) return;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(response.data.name);
      setUserEmail(response.data.email);
      setUserRole(role);
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    window.addEventListener("authChange", fetchUserDetails);
    return () => window.removeEventListener("authChange", fetchUserDetails);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    const role = localStorage.getItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("authChange"));
    setDropdownOpen(false);

    if (role === "admin")         navigate("/admin/login");
    else if (role === "minister") navigate("/minister/login");
    else if (role === "agent")    navigate("/agent/login");
    else                          navigate("/citizen/login");
  };

  const homeLink =
    userRole === "admin"    ? "/admin/dashboard" :
    userRole === "minister" ? "/minister/dashboard" :
    userRole === "agent"    ? "/agent/dashboard" :
    "/";

  const roleConfig = {
    admin:    { label: "Administrator", badgeClass: "bg-red-100 text-red-700 border border-red-200",    dotClass: "bg-red-500"    },
    minister: { label: "Minister",      badgeClass: "bg-violet-100 text-violet-700 border border-violet-200", dotClass: "bg-violet-500" },
    agent:    { label: "Agent",         badgeClass: "bg-emerald-100 text-emerald-700 border border-emerald-200", dotClass: "bg-emerald-500" },
    citizen:  { label: "Citizen",       badgeClass: "bg-sky-100 text-sky-700 border border-sky-200",    dotClass: "bg-sky-500"    },
  };

  const navLinkClass =
    "text-sm font-medium text-blue-100 hover:text-white px-3 py-1.5 rounded transition-colors duration-150 hover:bg-white/10";

  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'G';

  const avatarColors = {
    admin:    "bg-red-500",
    minister: "bg-violet-500",
    agent:    "bg-emerald-500",
    citizen:  "bg-sky-500",
  };

  return (
    <header className="bg-[#1a3a6b] text-white sticky top-0 z-50 shadow-md border-b border-[#15336b]">
      {/* Top accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-blue-400 via-sky-300 to-blue-400" />

      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Logo / Brand */}
        <Link to={homeLink} className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded bg-white/15 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          <div>
            <span className="text-base font-bold tracking-wide text-white">GovConnect</span>
            <span className="block text-[10px] text-blue-300 leading-none tracking-widest uppercase">
              Sri Lanka
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 flex-1">

          <Link to={homeLink} className={navLinkClass}>Home</Link>

          {userRole === "admin" && (
            <>
              <Link to="/admin/dashboard"    className={navLinkClass}>Dashboard</Link>
              <Link to="/admin/manage-users" className={navLinkClass}>Manage Users</Link>
            </>
          )}

          {userRole === "minister" && (
            <>
              <Link to="/minister/dashboard"   className={navLinkClass}>Dashboard</Link>
              <Link to="/minister/complaints"  className={navLinkClass}>Complaints</Link>
              <Link to="/minister/departments" className={navLinkClass}>Departments</Link>
            </>
          )}

          {userRole === "agent" && (
            <>
              <Link to="/agent/dashboard"   className={navLinkClass}>Dashboard</Link>
              <Link to="/agent/complaints"  className={navLinkClass}>Complaints</Link>
              <Link to="/agent/departments" className={navLinkClass}>Departments</Link>
            </>
          )}

          {userRole === "citizen" && (
            <>
              <Link to="/citizen/dashboard"        className={navLinkClass}>Dashboard</Link>
              <Link to="/citizen/create-complaint" className={navLinkClass}>Complaints</Link>
              <Link to="/citizen/departments"      className={navLinkClass}>Departments</Link>
              <Link to="/citizen/entries"          className={navLinkClass}>Entries</Link>
            </>
          )}

          {!userRole && (
            <>
              <Link to="/citizen/login"    className={navLinkClass}>Login</Link>
              <Link to="/citizen/register" className={navLinkClass}>Register</Link>
            </>
          )}
        </nav>

        {/* Profile Dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-3 pr-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors duration-150 group"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${avatarColors[userRole] || 'bg-white/20'}`}>
              {initials}
            </div>

            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-white leading-tight">
                {userName || "Guest"}
              </p>
              {userRole && (
                <p className="text-[11px] text-blue-300 leading-tight capitalize">
                  {roleConfig[userRole]?.label || userRole}
                </p>
              )}
            </div>

            {/* Chevron */}
            <svg
              className={`w-4 h-4 text-blue-300 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Panel */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 shadow-xl rounded-xl border border-gray-100 overflow-hidden z-50">

              {userName ? (
                <>
                  {/* User Info Header */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${avatarColors[userRole] || 'bg-gray-400'}`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                      </div>
                    </div>
                    <span className={`mt-2 inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${roleConfig[userRole]?.badgeClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${roleConfig[userRole]?.dotClass}`} />
                      {roleConfig[userRole]?.label || userRole}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    {userRole === "admin" && (
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                        onClick={() => { navigate("/admin/dashboard"); setDropdownOpen(false); }}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        My Dashboard
                      </button>
                    )}

                    {userRole === "minister" && (
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                        onClick={() => { navigate("/minister/dashboard"); setDropdownOpen(false); }}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        My Dashboard
                      </button>
                    )}

                    {userRole === "agent" && (
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                        onClick={() => { navigate("/agent/dashboard"); setDropdownOpen(false); }}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        My Dashboard
                      </button>
                    )}

                    {userRole === "citizen" && (
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                        onClick={() => { navigate("/citizen/update-profile"); setDropdownOpen(false); }}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Update Profile
                      </button>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 py-1">
                    <button
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                      onClick={handleLogout}
                    >
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                    onClick={() => { navigate("/citizen/login"); setDropdownOpen(false); }}
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                    onClick={() => { navigate("/citizen/register"); setDropdownOpen(false); }}
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Register
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
