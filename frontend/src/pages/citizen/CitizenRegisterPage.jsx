import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const CitizenRegisterPage = () => {
  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError]                 = useState('');
  const [fieldErrors, setFieldErrors]     = useState({});
  const [loading, setLoading]             = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!name.trim() || name.trim().length < 2)
      errors.name = 'Full name must be at least 2 characters.';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errors.email = 'Enter a valid email address.';
    if (password.length < 8)
      errors.password = 'Password must be at least 8 characters.';
    if (password !== confirmPassword)
      errors.confirmPassword = 'Passwords do not match.';
    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/citizen/register', {
        name,
        email,
        password,
      });
      navigate('/citizen/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2.5 text-sm border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
      fieldErrors[field]
        ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
        : 'border-gray-300 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b]'
    }`;

  const FieldError = ({ field }) =>
    fieldErrors[field] ? (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {fieldErrors[field]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Top accent bar — sky for Citizen role */}
      <div className="h-1 bg-gradient-to-r from-sky-400 via-sky-300 to-sky-400" />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-[#1a3a6b] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Citizen Portal</h1>
            <p className="text-sm text-gray-500 mt-1">GovConnect Sri Lanka</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Card header strip */}
            <div className="bg-[#1a3a6b] px-6 py-4">
              <h2 className="text-sm font-semibold text-white">Create your account</h2>
              <p className="text-xs text-blue-300 mt-0.5">Register to access government services</p>
            </div>

            <div className="px-6 py-6">

              {/* Global Error */}
              {error && (
                <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <p className="text-xs leading-relaxed">{error}</p>
                </div>
              )}

              <form onSubmit={handleRegister} noValidate>

                {/* Full Name */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className={inputClass('name')}
                    placeholder="e.g. Kamal Perera"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setFieldErrors(p => ({ ...p, name: '' })); }}
                    required
                    autoComplete="name"
                  />
                  <FieldError field="name" />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={inputClass('email')}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: '' })); }}
                    required
                    autoComplete="email"
                  />
                  <FieldError field="email" />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    className={inputClass('password')}
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: '' })); }}
                    required
                    autoComplete="new-password"
                  />
                  <FieldError field="password" />
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className={inputClass('confirmPassword')}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors(p => ({ ...p, confirmPassword: '' })); }}
                    required
                    autoComplete="new-password"
                  />
                  <FieldError field="confirmPassword" />
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
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Login link */}
              <p className="mt-5 text-center text-xs text-gray-500">
                Already have an account?{' '}
                <Link to="/citizen/login" className="text-[#1a3a6b] font-semibold hover:underline">
                  Sign in here
                </Link>
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

export default CitizenRegisterPage;
