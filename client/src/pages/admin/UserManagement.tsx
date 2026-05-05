import React from 'react';
import UserTable from '../../components/UserTable';

const UserManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="text-2xl font-semibold text-slate-900">Admin User Management</h2>
        <p className="mt-1 text-sm text-slate-600">Manage employee records, hierarchy, roles, and compensation settings.</p>
      </div>

      <div>
        <UserTable />
      </div>
    </div>
  );
};

export default UserManagementPage;
