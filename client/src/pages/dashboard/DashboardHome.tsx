import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  const cards = [
    { title: 'Leave', to: '/leave', description: 'Submit and monitor leave requests.' },
    { title: 'Reimburse', to: '/reimburse', description: 'Create and track reimbursement requests.' },
    { title: 'Penalty', to: '/penalty', description: 'View and manage penalty records.' },
    { title: 'Profile', to: '/profile', description: 'Update your contact and profile details.' },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Overview</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">Welcome back, {user?.name || user?.email || 'Team member'}</h3>
          <p className="mt-2 text-sm text-slate-600">Use the modules below to manage HR workflows quickly and securely.</p>
        </div>
        <div className="rounded-xl bg-brand-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Active Role</p>
          <p className="mt-2 text-xl font-bold text-brand-900">{user?.role}</p>
          <p className="mt-2 text-sm text-brand-800">Access is automatically scoped by role-based permissions.</p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel transition hover:-translate-y-0.5 hover:border-brand-300"
          >
            <h4 className="text-lg font-semibold text-slate-900">{card.title}</h4>
            <p className="mt-1 text-sm text-slate-600">{card.description}</p>
            <p className="mt-3 text-sm font-semibold text-brand-700">Open module</p>
          </Link>
        ))}

        {user?.role === 'ADMIN' && (
          <Link
            to="/admin/users"
            className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-5 shadow-panel transition hover:-translate-y-0.5"
          >
            <h4 className="text-lg font-semibold text-slate-900">User Management</h4>
            <p className="mt-1 text-sm text-slate-600">Manage roles, hierarchy, and employee records.</p>
            <p className="mt-3 text-sm font-semibold text-brand-700">Open admin tools</p>
          </Link>
        )}
      </section>
    </div>
  );
};

export default DashboardHome;
