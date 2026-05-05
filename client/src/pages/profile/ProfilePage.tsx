import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import { useSearchParams } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id') || '';
  const [targetId, setTargetId] = useState(user?.id || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) {
      setStatus('Missing target user ID.');
      return;
    }

    setSaving(true);
    setStatus('');
    try {
      await userService.updateProfile(targetId, { phone, address, photo });
      setStatus('Profile updated successfully.');
    } catch (err: any) {
      setStatus(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // If a query id is provided, default to it (view mode). Otherwise default to current user.
    if (queryId) setTargetId(queryId);
  }, [queryId, user]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel lg:col-span-1">
        <h3 className="text-lg font-semibold text-slate-900">Account Snapshot</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-slate-500">User ID</dt>
            <dd className="font-medium text-slate-900">{user?.id || '-'}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Name</dt>
            <dd className="font-medium text-slate-900">{user?.name || '-'}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-900">{user?.email || '-'}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Role</dt>
            <dd className="font-medium text-brand-700">{user?.role || '-'}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel lg:col-span-2">
        <h3 className="text-lg font-semibold text-slate-900">Update Profile</h3>
        <p className="mt-1 text-sm text-slate-600">Update your personal details used in the HR system.</p>

        <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
          {user?.role === 'ADMIN' && (
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-700">Target User ID</span>
              <input
                className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-brand-200 focus:ring"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="Enter user ID"
              />
            </label>
          )}

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Phone</span>
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-brand-200 focus:ring"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812xxxx"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Address</span>
            <textarea
              className="min-h-24 rounded-xl border border-slate-300 px-3 py-2 outline-none ring-brand-200 focus:ring"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Photo URL</span>
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-brand-200 focus:ring"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="https://..."
            />
          </label>

          <div className="flex items-center gap-3">
            {/* Only allow saving when editing own profile or when Admin */}
            {((user?.role === 'ADMIN') || (targetId === user?.id)) && (
              <button
                type="submit"
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-70"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            )}
            {status && <p className="text-sm text-slate-700">{status}</p>}
          </div>
        </form>
      </section>
    </div>
  );
};

export default ProfilePage;
