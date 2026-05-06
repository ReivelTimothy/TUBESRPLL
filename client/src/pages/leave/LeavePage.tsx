import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import leaveService from '../../services/leaveService';
import { LeaveStatus, LeaveType } from '../../types/types';
import CompanyCalendar from './CompanyCalendar';

const LeavePage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [processTarget, setProcessTarget] = useState<any | null>(null);
  const [processStatus, setProcessStatus] = useState<LeaveStatus.APPROVED | LeaveStatus.REJECTED>(LeaveStatus.APPROVED);
  const [processType, setProcessType] = useState<LeaveType>(LeaveType.PAID);
  const [processRemarks, setProcessRemarks] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await leaveService.getLeaveRequests();
      setRequests(res || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await leaveService.requestLeave({ startDate, endDate, reason });
      setStartDate('');
      setEndDate('');
      setReason('');
      setFeedback('Leave request submitted.');
      await load();
    } catch (err: any) {
      setFeedback(err.message || 'Failed to submit leave request.');
    }
  };

  const openProcessModal = (request: any, status: LeaveStatus.APPROVED | LeaveStatus.REJECTED) => {
    setProcessTarget(request);
    setProcessStatus(status);
    setProcessType(request.type || LeaveType.PAID);
    setProcessRemarks('');
  };

  const process = async () => {
    if (!processTarget) return;
    try {
      await leaveService.processLeave(processTarget.id, {
        status: processStatus,
        type: processStatus === LeaveStatus.APPROVED ? processType : undefined,
        remarks: processRemarks,
      });
      setProcessTarget(null);
      await load();
      setFeedback('Leave request processed.');
    } catch (err: any) {
      setFeedback(err.message || 'Failed to process leave request.');
    }
  };

  const canProcessRequest = (request: any) => {
    if (!user || request.status !== LeaveStatus.PENDING) return false;
    if (user.role === 'ADMIN') return true;
    if (user.role === 'MANAGER') {
      return request.User?.managerId === user.id;
    }
    return false;
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="text-2xl font-semibold text-slate-900">Leave Requests</h2>
        <p className="mt-1 text-sm text-slate-600">Submit leave requests and track approvals in one place.</p>
      </div>

      {feedback && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">{feedback}</div>
      )}

      <CompanyCalendar />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <h3 className="font-semibold text-slate-900">Request Leave</h3>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Start Date</label>
              <input className="w-full rounded-xl border border-slate-300 p-2" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">End Date</label>
              <input className="w-full rounded-xl border border-slate-300 p-2" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Reason</label>
              <textarea className="w-full rounded-xl border border-slate-300 p-2" value={reason} onChange={(e) => setReason(e.target.value)} required />
            </div>
            <div>
              <button className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Submit Request</button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <h3 className="mb-2 font-semibold text-slate-900">Requests</h3>
          {loading ? <div>Loading...</div> : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200"><th className="py-2">User</th><th>Date</th><th>Type</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {requests.map((r: any) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="py-2">{r.User?.name || r.userId}</td>
                    <td className="py-2">{new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}</td>
                    <td className="py-2">{r.type || 'PENDING'}</td>
                    <td className="py-2">{r.status}</td>
                    <td className="py-2">
                      {canProcessRequest(r) && (
                        <div className="space-x-2">
                          <button className="rounded-lg bg-emerald-600 px-2 py-1 text-white" onClick={() => openProcessModal(r, LeaveStatus.APPROVED)}>Approve</button>
                          <button className="rounded-lg bg-rose-600 px-2 py-1 text-white" onClick={() => openProcessModal(r, LeaveStatus.REJECTED)}>Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {processTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Process Leave</h3>
                <p className="text-sm text-slate-500">Set the leave type and add a short note if needed.</p>
              </div>
              <button className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100" onClick={() => setProcessTarget(null)}>Close</button>
            </div>

            <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              <div><span className="font-medium text-slate-800">Employee:</span> {processTarget.User?.name || processTarget.userId}</div>
              <div><span className="font-medium text-slate-800">Date:</span> {new Date(processTarget.startDate).toLocaleDateString()} - {new Date(processTarget.endDate).toLocaleDateString()}</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select className="mt-1 w-full rounded-xl border border-slate-300 p-2" value={processStatus} onChange={(e) => setProcessStatus(e.target.value as LeaveStatus.APPROVED | LeaveStatus.REJECTED)}>
                  <option value={LeaveStatus.APPROVED}>APPROVED</option>
                  <option value={LeaveStatus.REJECTED}>REJECTED</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Leave Type</label>
                <select className="mt-1 w-full rounded-xl border border-slate-300 p-2" value={processType} onChange={(e) => setProcessType(e.target.value as LeaveType)} disabled={processStatus === LeaveStatus.REJECTED}>
                  <option value={LeaveType.PAID}>PAID</option>
                  <option value={LeaveType.UNPAID}>UNPAID</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Remarks</label>
                <textarea className="mt-1 w-full rounded-xl border border-slate-300 p-2" rows={3} value={processRemarks} onChange={(e) => setProcessRemarks(e.target.value)} placeholder="Optional approval note" />
              </div>

              <div className="flex justify-end gap-3">
                <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setProcessTarget(null)}>Cancel</button>
                <button className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" onClick={process}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePage;
