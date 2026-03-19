import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SRI_LANKA_DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

const AGENT_TYPES = [
  "Road Service", "Public Transport", "Water Supply", "Electricity",
  "Waste Management", "Health Services", "Education", "Housing",
  "Agriculture", "Police Services", "Fire & Rescue", "Social Services"
];

const CreateAgentPage = () => {
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [department, setDepartment]   = useState('');
  const [district, setDistrict]       = useState('');
  const [agentType, setAgentType]     = useState('');
  const [departments, setDepartments] = useState([]);
  const [error, setError]             = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess]         = useState('');
  const [loading, setLoading]         = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/admin/login');
      try {
        const response = await axios.get('http://localhost:5000/api/admin/departments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(response.data);
      } catch (err) {
        setError('Failed to fetch departments. Please refresh and try again.');
      }
    };
    fetchDepartments();
  }, [navigate]);

  const validate = () => {
    const errors = {};
    if (!name.trim() || name.trim().length < 2)
      errors.name = 'Full name must be at least 2 characters.';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errors.email = 'Enter a valid email address.';
    if (password.length < 8)
      errors.password = 'Password must be at least 8 characters.';
    if (!department)
      errors.department = 'Please select a department.';
    if (!district)
      errors.district = 'Please select a district.';
    if (!agentType)
      errors.agentType = 'Please select an agent type.';
    return errors;
  };

  const handleRegisterAgent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const token = localStorage.getItem('token');
    if (!token) return navigate('/admin/login');

    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/api/admin/register-agent',
        { name, email, password, department, district, agentType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Agent account has been registered successfully.');
      setName(''); setEmail(''); setPassword('');
      setDepartment(''); setDistrict(''); setAgentType('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register agent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field) =>
    setFieldErrors(prev => ({ ...prev, [field]: '' }));

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
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
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
            User Management
          </p>
          <h1 className="text-2xl font-bold text-white">Register New Agent</h1>
          <p className="text-blue-200 text-sm mt-1">
            Create a field agent account and assign department, district, and service type.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="max-w-2xl">

          {/* Global Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleRegisterAgent} noValidate>

            {/* Section: Account Details */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Account Details
                </h3>
              </div>
              <div className="px-5 py-5 grid grid-cols-1 gap-4">

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className={inputClass('name')}
                    placeholder="e.g. Nuwan Silva"
                    value={name}
                    onChange={(e) => { setName(e.target.value); clearFieldError('name'); }}
                    required
                  />
                  <FieldError field="name" />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={inputClass('email')}
                    placeholder="agent@govconnect.lk"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
                    required
                  />
                  <FieldError field="email" />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    className={inputClass('password')}
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
                    required
                  />
                  <FieldError field="password" />
                </div>

              </div>
            </div>

            {/* Section: Assignment Details */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Assignment Details
                </h3>
              </div>
              <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Department */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Department
                  </label>
                  <select
                    className={inputClass('department')}
                    value={department}
                    onChange={(e) => { setDepartment(e.target.value); clearFieldError('department'); }}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                  <FieldError field="department" />
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    District
                  </label>
                  <select
                    className={inputClass('district')}
                    value={district}
                    onChange={(e) => { setDistrict(e.target.value); clearFieldError('district'); }}
                    required
                  >
                    <option value="">Select District</option>
                    {SRI_LANKA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <FieldError field="district" />
                </div>

                {/* Agent Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Agent Type
                  </label>
                  <select
                    className={inputClass('agentType')}
                    value={agentType}
                    onChange={(e) => { setAgentType(e.target.value); clearFieldError('agentType'); }}
                    required
                  >
                    <option value="">Select Agent Type</option>
                    {AGENT_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <FieldError field="agentType" />
                </div>

              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1a3a6b] hover:bg-[#15336b] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Registering...
                  </>
                ) : (
                  'Register Agent'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-colors"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAgentPage;