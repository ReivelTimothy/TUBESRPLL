import React, { useEffect, useState } from 'react';
import UserTable from '../../components/UserTable';
import UserTree from '../../components/UserTree';
import userService from '../../services/userService';

const UserManagementPage: React.FC = () => {
  const [tree, setTree] = useState<any[]>([]);
  const [loadingTree, setLoadingTree] = useState(false);

  const loadTree = async () => {
    setLoadingTree(true);
    try {
      const t = await userService.getUserTree();
      setTree(t);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTree(false);
    }
  };

  useEffect(() => { loadTree(); }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="text-2xl font-semibold text-slate-900">Admin User Management</h2>
        <p className="mt-1 text-sm text-slate-600">Manage employee records, hierarchy, roles, and compensation settings.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <UserTable />
        </div>
        <div>
          {loadingTree ? <div>Loading tree...</div> : <UserTree tree={tree} />}
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
