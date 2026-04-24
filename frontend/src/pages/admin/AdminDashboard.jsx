import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/* ─── Tab config ───────────────────────────────────────────────────────── */
const TABS = [
  { key: 'departments', label: 'Departments', color: 'emerald' },
  { key: 'ministers',   label: 'Ministers',   color: 'violet'  },
  { key: 'agents',      label: 'Agents',      color: 'blue'    },
];

const tabActiveClass = {
  departments: 'bg-emerald-600 text-white border-emerald-600',
  ministers:   'bg-violet-600  text-white border-violet-600',
  agents:      'bg-blue-600    text-white border-blue-600',
};

const tabCountActiveClass = {
  departments: 'bg-emerald-500 text-white',
  ministers:   'bg-violet-500  text-white',
  agents:      'bg-blue-500    text-white',
};

const tabCountClass = {
  departments: 'bg-emerald-100 text-emerald-700',
  ministers:   'bg-violet-100  text-violet-700',
  agents:      'bg-blue-100    text-blue-700',
};

/* ─── Column headers per tab ───────────────────────────────────────────── */
const COLUMNS = {
  departments: ['Department', 'Description',    'Created'],
  ministers:   ['Minister',   'Department',     'Joined'],
  agents:      ['Agent',      'District / Type', 'Joined'],
};

/* ─── Row renderers ────────────────────────────────────────────────────── */
const DepartmentRow = ({ item }) => (
  <>
    <td className="px-5 py-3.5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-gray-800">{item.name}</span>
      </div>
    </td>
    <td className="px-5 py-3.5">
      <span className="text-sm text-gray-500">{item.description || '—'}</span>
    </td>
    <td className="px-5 py-3.5">
      <span className="text-xs text-gray-400">
        {item.createdAt
          ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          : '—'}
      </span>
    </td>
  </>
);

const MinisterRow = ({ item }) => (
  <>
    <td className="px-5 py-3.5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0 text-xs font-bold text-violet-700">
          {item.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{item.name}</p>
          <p className="text-xs text-gray-400">{item.email}</p>
        </div>
      </div>
    </td>
    <td className="px-5 py-3.5">
      {item.department?.name ? (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full">
          {item.department.name}
        </span>
      ) : (
        <span className="text-xs italic text-amber-500">Unassigned</span>
      )}
    </td>
    <td className="px-5 py-3.5">
      <span className="text-xs text-gray-400">
        {item.createdAt
          ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          : '—'}
      </span>
    </td>
  </>
);

const AgentRow = ({ item }) => (
  <>
    <td className="px-5 py-3.5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-xs font-bold text-blue-700">
          {item.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{item.name}</p>
          <p className="text-xs text-gray-400">{item.email}</p>
        </div>
      </div>
    </td>
    <td className="px-5 py-3.5">
      <div className="flex items-center gap-1.5 flex-wrap">
        {item.district && (
          <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            {item.district}
          </span>
        )}
        {item.agentType && (
          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
            {item.agentType}
          </span>
        )}
      </div>
    </td>
    <td className="px-5 py-3.5">
      <span className="text-xs text-gray-400">
        {item.createdAt
          ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          : '—'}
      </span>
    </td>
  </>
);

const ROW_COMPONENT = {
  departments: DepartmentRow,
  ministers:   MinisterRow,
  agents:      AgentRow,
};

/* ─── Skeleton ─────────────────────────────────────────────────────────── */
const SkeletonRows = () => (
  <>
    {[1, 2, 3, 4].map(i => (
      <tr key={i} className="animate-pulse border-b border-gray-100">
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
            <div className="space-y-1.5">
              <div className="h-3 bg-gray-100 rounded w-28" />
              <div className="h-2.5 bg-gray-100 rounded w-36" />
            </div>
          </div>
        </td>
        <td className="px-5 py-3.5"><div className="h-3 bg-gray-100 rounded w-24" /></td>
        <td className="px-5 py-3.5"><div className="h-3 bg-gray-100 rounded w-16" /></td>
      </tr>
    ))}
  </>
);

/* ─── Main Component ───────────────────────────────────────────────────── */
const AdminDashboard = () => {
  const [activeTab,   setActiveTab]   = useState('departments');
  const [ministers,   setMinisters]   = useState([]);
  const [agents,      setAgents]      = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading,     setLoading]     = useState({ ministers: true, agents: true, departments: true });
  const [error,       setError]       = useState({});

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const base = 'http://localhost:5000/api';

    axios.get(`${base}/admin/ministers`, { headers })
      .then(r => setMinisters(r.data))
      .catch(() => setError(e => ({ ...e, ministers: 'Failed to load ministers.' })))
      .finally(() => setLoading(l => ({ ...l, ministers: false })));

    axios.get(`${base}/admin/agents`, { headers })
      .then(r => setAgents(r.data))
      .catch(() => setError(e => ({ ...e, agents: 'Failed to load agents.' })))
      .finally(() => setLoading(l => ({ ...l, agents: false })));

    axios.get(`${base}/admin/departments`, { headers })
      .then(r => setDepartments(r.data))
      .catch(() => setError(e => ({ ...e, departments: 'Failed to load departments.' })))
      .finally(() => setLoading(l => ({ ...l, departments: false })));
  }, []);

  const dataMap       = { departments, ministers, agents };
  const activeData    = dataMap[activeTab] ?? [];
  const activeLoading = loading[activeTab];
  const activeError   = error[activeTab];
  const RowComponent  = ROW_COMPONENT[activeTab];
  const columns       = COLUMNS[activeTab];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page Header ── */}
      <div className="bg-[#1a3a6b] text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">
            Administration
          </p>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-blue-200 text-sm mt-1">
                Platform overview — users, departments, and system status.
              </p>
            </div>
            <Link
              to="/admin/user-management"
              className="shrink-0 bg-white text-[#1a3a6b] text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Manage Users
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">

        {/* ── Summary Stats ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Departments', value: departments.length, bg: 'bg-emerald-50', border: 'border-emerald-200', color: 'text-emerald-700', tab: 'departments' },
            { label: 'Ministers',   value: ministers.length,   bg: 'bg-violet-50',  border: 'border-violet-200',  color: 'text-violet-700',  tab: 'ministers'   },
            { label: 'Agents',      value: agents.length,      bg: 'bg-blue-50',    border: 'border-blue-200',    color: 'text-blue-700',    tab: 'agents'      },
          ].map(stat => (
            <button
              key={stat.label}
              onClick={() => setActiveTab(stat.tab)}
              className={`rounded-xl border p-4 text-center transition-all duration-150 cursor-pointer ${stat.bg} ${stat.border} ${
                activeTab === stat.tab ? 'ring-2 ring-offset-1 ring-current shadow-sm' : 'hover:shadow-sm'
              }`}
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{stat.label}</p>
            </button>
          ))}
        </div>

        {/* ── Unified Table Panel ── */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

          {/* Tab bar + status */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap bg-gray-50/60">
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              {TABS.map(tab => {
                const isActive = activeTab === tab.key;
                const count    = dataMap[tab.key]?.length ?? 0;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold border transition-all duration-150 ${
                      isActive
                        ? tabActiveClass[tab.key]
                        : 'bg-transparent text-gray-500 border-transparent hover:text-gray-700 hover:bg-white/60'
                    }`}
                  >
                    {tab.label}
                    {!loading[tab.key] && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none ${
                        isActive ? tabCountActiveClass[tab.key] : tabCountClass[tab.key]
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              System Operational
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {columns.map(col => (
                    <th key={col} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50/40">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeLoading ? (
                  <SkeletonRows />
                ) : activeError ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-10 text-center">
                      <p className="text-xs text-red-500">{activeError}</p>
                    </td>
                  </tr>
                ) : activeData.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-16 text-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-400">No {activeTab} found</p>
                      <p className="text-xs text-gray-300 mt-1">Records will appear here once added.</p>
                    </td>
                  </tr>
                ) : (
                  activeData.map(item => (
                    <tr key={item._id} className="hover:bg-gray-50/70 transition-colors">
                      <RowComponent item={item} />
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!activeLoading && !activeError && activeData.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing <span className="font-semibold text-gray-600">{activeData.length}</span> {activeTab}
              </p>
              <span className="text-xs text-gray-300">Last updated just now</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;