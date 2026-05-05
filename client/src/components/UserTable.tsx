import React, { useEffect, useState } from 'react';
import type { UserAttributes } from '../types/types';
import userService from '../services/userService';
import UserEditModal from './UserEditModal';

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<UserAttributes[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<UserAttributes | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async (id: string, data: Partial<UserAttributes>) => {
    await userService.updateUser(id, data as any);
    await fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone if they have no subordinates.')) return;
    try {
      await userService.deleteUser(id);
      setUsers((s) => s.filter(u => u.id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">Users</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Manager</th>
              <th className="px-4 py-2 text-right">Base Salary</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.role}</td>
                <td className="px-4 py-2">{(u as any).Manager?.name || u.managerId || '-'}</td>
                <td className="px-4 py-2 text-right">{u.baseSalary ?? 0}</td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => setEditing(u)} className="mr-2 rounded-lg bg-amber-400 px-3 py-1 text-black">Edit</button>
                  <button onClick={() => handleDelete(u.id)} className="rounded-lg bg-rose-600 px-3 py-1 text-white">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <UserEditModal
          user={editing}
          managers={users.filter(x => x.id !== editing.id)}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default UserTable;
