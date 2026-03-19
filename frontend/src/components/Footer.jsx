import React from 'react';
import { Link } from 'react-router-dom';

/* ─── LINK GROUPS ───────────────────────────────────────────────────────────── */

const citizenLinks = [
  { label: 'Register as Citizen',   to: '/citizen/register' },
  { label: 'Sign In',               to: '/citizen/login' },
  { label: 'Submit a Complaint',    to: '/citizen/create-complaint' },
  { label: 'Track My Complaints',   to: '/citizen/dashboard' },
  { label: 'Browse Departments',    to: '/citizen/departments' },
  { label: 'Community Complaints',  to: '/citizen/entries' },
];

const staffLinks = [
  { label: 'Minister Portal',   to: '/minister/login' },
  { label: 'Agent Portal',      to: '/agent/login' },
  { label: 'Police Portal',     to: '/police/login' },
  { label: 'Admin Portal',      to: '/admin/login' },
];

const legalLinks = [
  { label: 'Privacy Policy',        to: '#' },
  { label: 'Terms of Use',          to: '#' },
  { label: 'Accessibility',         to: '#' },
  { label: 'Data Protection',       to: '#' },
];

/* ─── SOCIAL / CONTACT ICONS ────────────────────────────────────────────────── */

const contactItems = [
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    text: 'support@govconnect.lk',
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    text: '+94 11 2 694 100',
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    text: 'Colombo 01, Sri Lanka',
  },
];

/* ─── COMPONENT ─────────────────────────────────────────────────────────────── */

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: '#0a1628',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Top accent line — matches navbar */}
      <div
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, #1d4ed8 0%, #38bdf8 50%, #1d4ed8 100%)',
          opacity: 0.7,
        }}
      />

      {/* Main footer body */}
      <div className="max-w-screen-xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand column ─────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <div>
                <p className="text-base font-bold text-white tracking-wide leading-none">GovConnect</p>
                <p
                  className="text-xs font-semibold uppercase tracking-widest leading-none mt-0.5"
                  style={{ color: '#60a5fa', letterSpacing: '0.18em' }}
                >
                  Sri Lanka
                </p>
              </div>
            </div>

            <p
              className="text-xs leading-relaxed mb-6"
              style={{ color: '#94a3b8', maxWidth: '240px' }}
            >
              The official integrated citizen services platform of the Democratic Socialist
              Republic of Sri Lanka. Bridging government and citizens through technology.
            </p>

            {/* Contact details */}
            <ul className="space-y-2.5">
              {contactItems.map((item) => (
                <li key={item.text} className="flex items-center gap-2.5">
                  <span style={{ color: '#60a5fa' }}>{item.icon}</span>
                  <span className="text-xs" style={{ color: '#94a3b8' }}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Citizen Services ─────────────────────────────────────────── */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: '#60a5fa', letterSpacing: '0.18em' }}
            >
              Citizen Services
            </h3>
            <ul className="space-y-2.5">
              {citizenLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-xs flex items-center gap-1.5 group transition-colors duration-150"
                    style={{ color: '#94a3b8' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#e2e8f0'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                  >
                    <svg
                      className="w-2.5 h-2.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="currentColor" viewBox="0 0 24 24"
                      style={{ color: '#38bdf8' }}
                    >
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Staff Portals ─────────────────────────────────────────────── */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: '#60a5fa', letterSpacing: '0.18em' }}
            >
              Staff Portals
            </h3>
            <ul className="space-y-2.5">
              {staffLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-xs flex items-center gap-1.5 group transition-colors duration-150"
                    style={{ color: '#94a3b8' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#e2e8f0'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                  >
                    <svg
                      className="w-2.5 h-2.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: '#38bdf8' }}
                      fill="none" viewBox="0 0 24 24"
                    >
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* System status badge */}
            <div
              className="mt-8 inline-flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: '#10b981',
                  boxShadow: '0 0 6px rgba(16,185,129,0.6)',
                }}
              />
              <span className="text-xs font-medium" style={{ color: '#6ee7b7' }}>
                All systems operational
              </span>
            </div>
          </div>

          {/* ── Legal & Info ─────────────────────────────────────────────── */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: '#60a5fa', letterSpacing: '0.18em' }}
            >
              Legal &amp; Policies
            </h3>
            <ul className="space-y-2.5 mb-8">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-xs flex items-center gap-1.5 group transition-colors duration-150"
                    style={{ color: '#94a3b8' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#e2e8f0'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                  >
                    <svg
                      className="w-2.5 h-2.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: '#38bdf8' }}
                      fill="none" viewBox="0 0 24 24"
                    >
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Official note */}
            <div
              className="p-3 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex items-start gap-2">
                <svg
                  className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                  style={{ color: '#60a5fa' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>
                  This is an official government digital service.
                  All data is protected under Sri Lanka's data protection legislation.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div
        className="max-w-screen-xl mx-auto px-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      />

      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Copyright */}
          <p className="text-xs text-center sm:text-left" style={{ color: '#475569' }}>
            &copy; {year} Democratic Socialist Republic of Sri Lanka. All rights reserved.
          </p>

          {/* Centre — Sri Lanka coat of arms text */}
          <div className="flex items-center gap-2">
            <div
              className="h-px w-10 hidden sm:block"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            />
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#334155', letterSpacing: '0.15em' }}
            >
              GovConnect · Integrated Citizen Services
            </p>
            <div
              className="h-px w-10 hidden sm:block"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            />
          </div>

          {/* Right — language / version hint */}
          <p className="text-xs" style={{ color: '#334155' }}>
            v1.0.0 &nbsp;·&nbsp; EN
          </p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;
