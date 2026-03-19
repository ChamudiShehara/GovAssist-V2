import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MinisterLoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/minister/login-minister', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', 'minister');
      window.dispatchEvent(new Event("authChange"));
      navigate('/minister/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Top accent bar — violet for Minister role */}
      <div className="h-1 bg-gradient-to-r from-violet-400 via-violet-300 to-violet-400" />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-[#1a3a6b] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Minister Portal</h1>
            <p className="text-sm text-gray-500 mt-1">GovConnect Sri Lanka</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Card header strip */}
            <div className="bg-[#1a3a6b] px-6 py-4">
              <h2 className="text-sm font-semibold text-white">Sign in to your account</h2>
              <p className="text-xs text-blue-300 mt-0.5">Department ministers — authorised personnel only</p>
            </div>

            <div className="px-6 py-6">

              {/* Error Alert */}
              {error && (
                <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <p className="text-xs leading-relaxed">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} noValidate>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b] transition-colors"
                    placeholder="minister@govconnect.lk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b] transition-colors"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1a3a6b] hover:bg-[#15336b] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Note — ministers are registered by admin */}
              <p className="mt-5 text-center text-xs text-gray-400">
                Minister accounts are provisioned by the system administrator.
              </p>
            </div>
          </div>

          {/* Back to portal */}
          <p className="text-center mt-5">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Portal
            </button>
          </p>

        </div>
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

export default MinisterLoginPage;