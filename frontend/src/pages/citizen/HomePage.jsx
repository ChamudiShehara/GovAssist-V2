import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';

const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Submit Complaints',
    description: 'File complaints directed to specific government departments with detailed descriptions and supporting information for prompt attention.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Track Progress',
    description: 'Monitor complaint status in real time through your personal dashboard. Receive updates as your complaint moves through review, assignment, and resolution.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Connect with Departments',
    description: 'Browse registered government departments and understand their responsibilities. Direct your concerns to the right authority for efficient handling.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Private Complaints',
    description: 'Submit sensitive or confidential complaints handled exclusively by the police department, ensuring your privacy and personal safety throughout the process.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Register Your Account',
    description: 'Create your citizen account on the GovConnect platform by providing your personal details and setting up secure credentials.',
  },
  {
    number: '02',
    title: 'Submit Your Complaint',
    description: 'Select the relevant government department, describe your issue in detail, and submit the complaint through the platform.',
  },
  {
    number: '03',
    title: 'Review and Assignment',
    description: 'The department minister reviews incoming complaints and assigns each one to an appropriate field agent in your district.',
  },
  {
    number: '04',
    title: 'Resolution and Updates',
    description: 'The assigned agent investigates your complaint, takes action, and updates the status. Track every stage from your dashboard.',
  },
];

const roles = [
  {
    role: 'Citizens',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    description: 'Register independently, submit complaints to government departments, track complaint progress, and file private complaints to the police.',
  },
  {
    role: 'Government Ministers',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Review complaints directed to their assigned department, analyze incoming issues, and delegate them to appropriate field agents for resolution.',
  },
  {
    role: 'Field Agents',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    description: 'View assigned complaints on their dashboard, investigate issues within their district, and update complaint status as work progresses through each stage.',
  },
  {
    role: 'Police Officers',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    description: 'Handle private and confidential complaints submitted by citizens. Review case details securely and respond directly through the platform.',
  },
];

const principles = [
  {
    title: 'Transparency',
    description: 'Open and visible complaint tracking at every stage of the resolution process.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: 'Accountability',
    description: 'Clear assignment of responsibility from minister to agent at every stage.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Efficiency',
    description: 'Streamlined workflows that reduce delay and accelerate complaint resolution.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Security',
    description: 'Protected citizen data, secure authentication, and confidential complaint handling.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1929]/95 via-[#12304f]/90 to-[#0a1929]/95" />

        {/* Decorative grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
          {/* Emblem */}
          <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-full border border-white/15 bg-white/5 mb-8">
            <svg className="w-9 h-9 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] mb-8">
            <span className="text-blue-200/70 text-[11px] font-semibold uppercase tracking-[0.25em]">
              Government of Sri Lanka
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-5 leading-[1.08]">
            GovConnect
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-white/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="w-12 h-px bg-white/20" />
          </div>

          {/* Subtitle */}
          <p className="text-blue-100/60 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-3">
            The Official Digital Platform for Citizen-Government Communication
          </p>
          <p className="text-blue-200/35 text-sm max-w-lg mx-auto leading-relaxed mb-12">
            Submit complaints directly to government departments, track resolutions
            in real time, and contribute to improving public services across Sri Lanka.
          </p>

          {/* CTA Buttons */}
          {!isAuthenticated && (
            <>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link
                  to="/citizen/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#1a3a6b] text-sm font-bold px-9 py-3.5 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg shadow-black/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </Link>
                <Link
                  to="/citizen/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/[0.08] border border-white/20 text-white text-sm font-semibold px-9 py-3.5 rounded-lg hover:bg-white/[0.15] transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register as Citizen
                </Link>
              </div>

              <p className="text-[11px] text-blue-300/35">
                Government staff?{' '}
                <Link to="/" className="underline hover:text-white/70 transition-colors">
                  Access the staff portal
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/25 text-[10px] font-medium tracking-[0.3em] uppercase">
            Scroll
          </span>
          <div className="w-[22px] h-[34px] rounded-full border-2 border-white/15 flex items-start justify-center pt-1.5">
            <div className="w-[3px] h-[6px] rounded-full bg-white/40 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ============ PLATFORM SERVICES ============ */}
      <section className="bg-white py-24">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1a3a6b]/60 mb-3">
              Platform Services
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              What You Can Do on GovConnect
            </h2>
            <p className="text-gray-500 text-[15px] max-w-2xl mx-auto leading-relaxed">
              GovConnect provides a centralized, secure platform for citizens to interact with
              government departments, submit complaints, and receive timely resolutions through
              a structured, transparent process.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="group relative bg-gray-50 border border-gray-100 rounded-xl p-7 hover:border-[#1a3a6b]/20 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-[#1a3a6b]/[0.08] flex items-center justify-center text-[#1a3a6b] mb-5 group-hover:bg-[#1a3a6b] group-hover:text-white transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="bg-gray-50 py-24 border-y border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1a3a6b]/60 mb-3">
              Process Overview
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              How the Complaint Resolution Process Works
            </h2>
            <p className="text-gray-500 text-[15px] max-w-2xl mx-auto leading-relaxed">
              From submission to resolution, every complaint follows a structured process
              to ensure accountability and timely action by the relevant government authorities.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-[#1a3a6b]/10" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
              {steps.map((item, index) => (
                <div key={item.number} className="text-center relative">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#1a3a6b] text-white text-sm font-bold flex items-center justify-center mx-auto mb-5 relative z-10 shadow-lg shadow-[#1a3a6b]/20">
                    {item.number}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed max-w-[260px] mx-auto">
                    {item.description}
                  </p>
                  {index < steps.length - 1 && (
                    <div className="lg:hidden w-px h-8 bg-[#1a3a6b]/10 mx-auto mt-6" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ PLATFORM ROLES ============ */}
      <section className="bg-white py-24">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1a3a6b]/60 mb-3">
              Stakeholders
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Who Uses the GovConnect Platform
            </h2>
            <p className="text-gray-500 text-[15px] max-w-2xl mx-auto leading-relaxed">
              The platform serves multiple stakeholders across government administration, each with
              dedicated tools and dashboards tailored to their specific responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((user) => (
              <div
                key={user.role}
                className="border border-gray-200 rounded-xl p-7 hover:border-[#1a3a6b]/25 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-lg bg-[#1a3a6b]/[0.08] flex items-center justify-center text-[#1a3a6b] mb-5">
                  {user.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{user.role}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{user.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CORE PRINCIPLES ============ */}
      <section className="bg-[#0c1e3a] py-20">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-300/40 mb-3">
              Our Commitment
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
              Built on Core Principles of Good Governance
            </h2>
            <p className="text-blue-200/35 text-sm max-w-lg mx-auto leading-relaxed">
              Every aspect of the GovConnect platform is designed to uphold the highest
              standards of public service delivery for the citizens of Sri Lanka.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((p) => (
              <div key={p.title} className="text-center">
                <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 mx-auto mb-4">
                  {p.icon}
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{p.title}</h3>
                <p className="text-[12px] text-blue-200/35 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ABOUT THE SYSTEM ============ */}
      <section className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1a3a6b]/60 mb-3">
                About the Platform
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
                Bridging the Gap Between Citizens and Government
              </h2>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
                GovConnect was developed as a comprehensive solution for citizen-government
                communication under the Government of Sri Lanka. The platform enables citizens to
                raise issues with the appropriate departments while providing government officials with
                the tools to manage, assign, and resolve complaints efficiently.
              </p>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
                The system is managed by a central administration that creates and oversees
                government departments, assigns ministers to their respective departments, and
                registers government staff including ministers, field agents, and police officers
                through a secure user management module.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Department-Based Routing', desc: 'Complaints go directly to the right department' },
                  { label: 'District-Level Agents', desc: 'Field agents assigned by district and agency' },
                  { label: 'Real-Time Status Tracking', desc: 'Approved, In Progress, and Done stages' },
                  { label: 'Administrative Oversight', desc: 'Centralized user and department management' },
                ].map((item) => (
                  <div key={item.label} className="bg-white border border-gray-100 rounded-lg p-4">
                    <p className="text-[13px] font-bold text-gray-800 mb-0.5">{item.label}</p>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-[#1a3a6b]/[0.04] border border-[#1a3a6b]/10 rounded-2xl p-8 sm:p-10">
                <div className="space-y-6">
                  {[
                    {
                      step: 'Citizen',
                      action: 'Submits a complaint to the Department of Education',
                      status: 'Submitted',
                      statusColor: 'bg-blue-100 text-blue-700',
                    },
                    {
                      step: 'Minister',
                      action: 'Reviews the complaint and assigns it to a field agent in Colombo district',
                      status: 'Assigned',
                      statusColor: 'bg-amber-100 text-amber-700',
                    },
                    {
                      step: 'Agent',
                      action: 'Investigates the issue, takes corrective measures, and updates the status',
                      status: 'In Progress',
                      statusColor: 'bg-orange-100 text-orange-700',
                    },
                    {
                      step: 'Resolution',
                      action: 'Complaint is resolved and the citizen is notified of the outcome',
                      status: 'Done',
                      statusColor: 'bg-green-100 text-green-700',
                    },
                  ].map((item, i) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#1a3a6b] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </div>
                        {i < 3 && <div className="w-px h-full bg-[#1a3a6b]/15 mt-1" />}
                      </div>
                      <div className="pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[13px] font-bold text-gray-900">{item.step}</p>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.statusColor}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[12px] text-gray-500 leading-relaxed">{item.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CALL TO ACTION ============ */}
      {!isAuthenticated && (
        <section className="bg-white py-20 border-t border-gray-100">
          <div className="max-w-screen-md mx-auto px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#1a3a6b]/[0.08] flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-[#1a3a6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="text-gray-500 text-[15px] mb-10 max-w-md mx-auto leading-relaxed">
              Join the GovConnect platform today to submit your complaints and contribute
              to improving government services in your community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/citizen/register"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#1a3a6b] text-white text-sm font-bold px-10 py-3.5 rounded-lg hover:bg-[#0f2a52] transition-colors shadow-lg shadow-[#1a3a6b]/15"
              >
                Register Now
              </Link>
              <Link
                to="/citizen/login"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-[#1a3a6b] text-sm font-semibold px-10 py-3.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ FOOTER ============ */}
      <Footer />
    </div>
  );
}