import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserTree from '../../components/UserTree';
import userService from '../../services/userService';
import type { UserAttributes } from '../../types/types';

const DirectoryPage: React.FC = () => {
  const { user } = useAuth();
  const [tree, setTree] = useState<UserAttributes[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const t = await userService.getUserTree();
        setTree(t || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="text-2xl font-semibold text-slate-900">Company Directory</h2>
        <p className="mt-1 text-sm text-slate-600">Browse the organizational structure. Editing is restricted to Admins.</p>
      </div>

      <div>
        {loading ? <div>Loading directory...</div> : <UserTree tree={tree} currentUserRole={user?.role} currentUserId={user?.id} />}
      </div>
    </div>
  );
};

export default DirectoryPage;
