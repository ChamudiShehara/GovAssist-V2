import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-[#1a3a6b] text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">
            Administration
          </p>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-blue-200 text-sm mt-1">
            Manage system users, departments, and platform configuration.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Manage Users */}
            <Link
              to="/admin/user-management"
              className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-[#1a3a6b] hover:shadow-md transition-all duration-200 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-[#1a3a6b] transition-colors duration-200">
                <svg className="w-5 h-5 text-[#1a3a6b] group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-[#1a3a6b]">Manage Users</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Register and manage ministers, agents, and police officers.
                </p>
              </div>
            </Link>

            {/* Create Department */}
            <Link
              to="/admin/create-department"
              className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-[#1a3a6b] hover:shadow-md transition-all duration-200 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-[#1a3a6b] transition-colors duration-200">
                <svg className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-[#1a3a6b]">Create Department</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Add new government departments and assign ministers.
                </p>
              </div>
            </Link>

          </div>
        </div>

        {/* System Overview */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            System Overview
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-gray-600">Platform Status</span>
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Operational
              </span>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-sm text-gray-600">Access Level</span>
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                Full Administration
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;