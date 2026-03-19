import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateDepartmentPage = () => {
  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [error, setError]             = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess]         = useState('');
  const [loading, setLoading]         = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!name.trim() || name.trim().length < 3)
      errors.name = 'Department name must be at least 3 characters.';
    if (!description.trim() || description.trim().length < 10)
      errors.description = 'Description must be at least 10 characters.';
    return errors;
  };

  const handleCreateDepartment = async (e) => {
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
        'http://localhost:5000/api/admin/create-department',
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Department has been created successfully.');
      setName('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create department. Please try again.');
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
            Administration
          </p>
          <h1 className="text-2xl font-bold text-white">Create Department</h1>
          <p className="text-blue-200 text-sm mt-1">
            Add a new government department to the platform and configure its details.
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

          <form onSubmit={handleCreateDepartment} noValidate>

            {/* Form Card */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Department Details
                </h3>
              </div>
              <div className="px-5 py-5 grid grid-cols-1 gap-5">

                {/* Department Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Department Name
                  </label>
                  <input
                    type="text"
                    className={inputClass('name')}
                    placeholder="e.g. Ministry of Health"
                    value={name}
                    onChange={(e) => { setName(e.target.value); clearFieldError('name'); }}
                    required
                  />
                  <FieldError field="name" />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className={`${inputClass('description')} resize-none`}
                    placeholder="Briefly describe the department's mandate and responsibilities..."
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); clearFieldError('description'); }}
                    required
                  />
                  <div className="flex items-start justify-between mt-1">
                    <FieldError field="description" />
                    <span className="text-xs text-gray-400 ml-auto shrink-0">
                      {description.length} characters
                    </span>
                  </div>
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
                    Creating...
                  </>
                ) : (
                  'Create Department'
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

export default CreateDepartmentPage;