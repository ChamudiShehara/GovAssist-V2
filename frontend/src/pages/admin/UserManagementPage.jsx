import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserManagementPage = () => {
  const navigate = useNavigate();

  /* ── Department form state ── */
  const [deptForm,    setDeptForm]    = useState({ name: '', description: '' });
  const [deptLoading, setDeptLoading] = useState(false);
  const [deptError,   setDeptError]   = useState('');
  const [deptSuccess, setDeptSuccess] = useState('');

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    setDeptError('');
    setDeptSuccess('');
    if (!deptForm.name.trim() || !deptForm.description.trim()) {
      setDeptError('Both name and description are required.');
      return;
    }
    setDeptLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/admin/create-department',
        deptForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDeptSuccess(`Department "${deptForm.name}" created successfully.`);
      setDeptForm({ name: '', description: '' });
    } catch (err) {
      setDeptError(err.response?.data?.error ?? 'Failed to create department. Please try again.');
    } finally {
      setDeptLoading(false);
    }
  };

  /* ── Role cards ── */
  const roles = [
    {
      label: 'Minister',
      description: 'Oversees a government department and manages complaint assignments.',
      to: '/admin/create-minister',
      accent: 'border-violet-200 hover:border-violet-400',
      iconBg: 'bg-violet-50 group-hover:bg-violet-100',
      iconColor: 'text-violet-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: 'Agent',
      description: 'Field officer assigned to a department, district, and service type.',
      to: '/admin/create-agent',
      accent: 'border-emerald-200 hover:border-emerald-400',
      iconBg: 'bg-emerald-50 group-hover:bg-emerald-100',
      iconColor: 'text-emerald-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: 'Police Officer',
      description: 'Handles and responds to private complaints submitted by citizens.',
      to: '/admin/create-police',
      accent: 'border-red-200 hover:border-red-400',
      iconBg: 'bg-red-50 group-hover:bg-red-100',
      iconColor: 'text-red-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page Header ── */}
      <div className="bg-[#1a3a6b] text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-1.5 text-blue-300 hover:text-white text-xs mb-4 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">
            Administration
          </p>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-blue-200 text-sm mt-1">
            Register users and manage departments from one place.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-8">

        {/* ── Register New User ── */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Register New User
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Link
                key={role.label}
                to={role.to}
                className={`group bg-white border-2 rounded-xl p-5 hover:shadow-md transition-all duration-200 flex items-start gap-4 ${role.accent}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${role.iconBg}`}>
                  <span className={role.iconColor}>{role.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-0.5">
                    Register {role.label}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {role.description}
                  </p>
                </div>
                <svg className="w-4 h-4 text-gray-300 shrink-0 mt-0.5 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Create Department (moved from AdminDashboard) ── */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Create Department
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                New Department
              </h3>
            </div>

            <div className="px-6 py-6">
              {/* Success */}
              {deptSuccess && (
                <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 mb-5">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">{deptSuccess}</p>
                </div>
              )}

              {/* Error */}
              {deptError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <p className="text-sm">{deptError}</p>
                </div>
              )}

              <form onSubmit={handleDeptSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                    Department Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={deptForm.name}
                    onChange={e => setDeptForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Road Development"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/20 focus:border-[#1a3a6b] transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={deptForm.description}
                    onChange={e => setDeptForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Brief description of the department"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/20 focus:border-[#1a3a6b] transition-colors"
                  />
                </div>

                {/* Submit */}
                <div className="sm:col-span-2 flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={deptLoading}
                    className="inline-flex items-center gap-2 bg-[#1a3a6b] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#15305a] transition-colors disabled:opacity-60"
                  >
                    {deptLoading ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                    {deptLoading ? 'Creating…' : 'Create Department'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ── Access Notes ── */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Access & Registration Notes
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                color: 'text-blue-500',
                text: 'Ministers, agents, and police officers are registered exclusively by the administrator.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
                color: 'text-sky-500',
                text: 'Citizens self-register through the public portal and do not require admin provisioning.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
                color: 'text-amber-500',
                text: 'All user credentials are securely stored. Ensure passwords meet the minimum security requirements.',
              },
            ].map((note, i) => (
              <div key={i} className="px-5 py-4 flex items-start gap-3">
                <svg className={`w-4 h-4 mt-0.5 shrink-0 ${note.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {note.icon}
                </svg>
                <p className="text-sm text-gray-600 leading-relaxed">{note.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserManagementPage;