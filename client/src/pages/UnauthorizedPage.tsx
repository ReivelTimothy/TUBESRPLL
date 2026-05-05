import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-amber-50 p-6">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-panel">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Access denied</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Unauthorized</h1>
        <p className="mt-3 text-sm text-slate-600">You do not have permission to view this page with your current role.</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Return to dashboard
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;