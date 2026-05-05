import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import attendanceService, { AttendanceRecord } from '../../services/attendanceService';
import userService from '../../services/userService';
import type { UserAttributes } from '../../types/types';

const formatDateTime = (value?: string) => value ? new Date(value).toLocaleString('id-ID') : '-';

const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<AttendanceRecord[]>([]);
  const [users, setUsers] = useState<UserAttributes[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const canSelectUser = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  useEffect(() => {
    (async () => {
      if (!canSelectUser) return;
      try {
        const staff = user?.role === 'ADMIN'
          ? await userService.getAllUsers()
          : await userService.getEligibleStaff();

        setUsers(staff || []);
        if (staff?.[0]?.id) setSelectedUserId(staff[0].id);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [canSelectUser, user?.role]);

  const loadAttendance = async (filters?: { startDate?: string; endDate?: string; userId?: string }) => {
    setLoading(true);
    setFeedback('');
    try {
      const res = await attendanceService.getAttendances(filters);
      setItems(res || []);
    } catch (err: any) {
      setFeedback(err.message || 'Failed to load attendance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const applyFilter = () => {
    loadAttendance({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      userId: canSelectUser ? selectedUserId || undefined : undefined,
    });
  };

  const resetFilter = () => {
    setStartDate('');
    setEndDate('');
    if (canSelectUser && users[0]?.id) setSelectedUserId(users[0].id);
    loadAttendance();
  };

  const visibleCountLabel = useMemo(() => {
    if (user?.role === 'ADMIN') return 'All attendance records';
    if (user?.role === 'MANAGER') return 'Your team attendance';
    return 'Your attendance';
  }, [user?.role]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="text-2xl font-semibold text-slate-900">Attendance</h2>
        <p className="mt-1 text-sm text-slate-600">{visibleCountLabel}</p>
      </div>

      {feedback && <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">{feedback}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" />
          {canSelectUser ? (
            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
              {users.length === 0 ? <option value="">No staff available</option> : users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">Your own attendance</div>
          )}
          <div className="flex gap-2">
            <button onClick={applyFilter} className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">Apply</button>
            <button onClick={resetFilter} className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200">Reset</button>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-3 pr-3 font-semibold">Employee</th>
                  <th className="py-3 pr-3 font-semibold">Check In</th>
                  <th className="py-3 pr-3 font-semibold">Check Out</th>
                  <th className="py-3 pr-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={4} className="py-6 text-center text-slate-500">No attendance records found.</td></tr>
                ) : items.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="py-3 pr-3">
                      <div className="font-medium text-slate-900">{row.user?.name || row.userId}</div>
                      <div className="text-xs text-slate-500">{row.user?.role || '-'}</div>
                    </td>
                    <td className="py-3 pr-3">{formatDateTime(row.checkIn)}</td>
                    <td className="py-3 pr-3">{formatDateTime(row.checkOut || undefined)}</td>
                    <td className="py-3 pr-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.status === 'LATE' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;