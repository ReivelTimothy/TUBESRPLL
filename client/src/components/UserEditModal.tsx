import React, { useState } from 'react';
import type { UserAttributes } from '../types/types';

interface Props {
  user: UserAttributes;
  managers: UserAttributes[];
  onClose: () => void;
  onSave: (id: string, data: Partial<UserAttributes>) => Promise<void>;
}

const UserEditModal: React.FC<Props> = ({ user, managers, onClose, onSave }) => {
  const [name, setName] = useState(user.name || '');
  const [role, setRole] = useState(user.role);
  const [managerId, setManagerId] = useState<string | null>(user.managerId || null);
  const [baseSalary, setBaseSalary] = useState<number>(user.baseSalary || 0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(user.id, { name, role, managerId, baseSalary });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Edit User</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-300 p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email (read only)</label>
            <input value={user.email} readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full rounded-xl border border-slate-300 p-2">
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
              <option value="STAFF">STAFF</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Manager</label>
            <select value={managerId ?? ''} onChange={(e) => setManagerId(e.target.value || null)} className="w-full rounded-xl border border-slate-300 p-2">
              <option value="">— No Manager —</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Base Salary</label>
            <input type="number" value={baseSalary} onChange={(e) => setBaseSalary(Number(e.target.value))} className="w-full rounded-xl border border-slate-300 p-2" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-xl bg-slate-100 px-4 py-2">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-brand-600 px-4 py-2 text-white">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
