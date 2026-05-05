import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import penaltyService from '../../services/penaltyService';
import { PenaltyType } from '../../types/types';

const PenaltyPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [amount, setAmount] = useState<number | ''>('');
  const [reason, setReason] = useState('');
  const [target, setTarget] = useState('');
  const [type, setType] = useState<PenaltyType>(PenaltyType.OTHER);
  const [feedback, setFeedback] = useState('');

  const load = async () => {
    try { const res = await penaltyService.getPenalties(); setItems(res || []); } catch (err) { console.error(err); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await penaltyService.createPenalty({ userId: target, amount: Number(amount), reason, type });
      setAmount('');
      setReason('');
      setTarget('');
      setType(PenaltyType.OTHER);
      setFeedback('Penalty created successfully.');
      await load();
    } catch (err: any) {
      setFeedback(err.message || 'Failed to create penalty.');
    }
  };

  const remove = async (id: string) => {
    try {
      await penaltyService.deletePenalty(id);
      setFeedback('Penalty deleted successfully.');
      await load();
    } catch (err: any) {
      setFeedback(err.message || 'Failed to delete penalty.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="text-2xl font-semibold text-slate-900">Penalties</h2>
        <p className="mt-1 text-sm text-slate-600">Managers and admins can create penalties based on policy violations.</p>
      </div>

      {feedback && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">{feedback}</div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <h3 className="font-semibold text-slate-900">Create Penalty</h3>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Target User ID</label>
              <input className="w-full rounded-xl border border-slate-300 p-2" value={target} onChange={(e) => setTarget(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Amount</label>
              <input className="w-full rounded-xl border border-slate-300 p-2" type="number" value={amount as any} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')} required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Type</label>
              <select className="w-full rounded-xl border border-slate-300 p-2" value={type} onChange={(e) => setType(e.target.value as PenaltyType)}>
                <option value={PenaltyType.LATE}>LATE</option>
                <option value={PenaltyType.DAMAGE}>DAMAGE</option>
                <option value={PenaltyType.UNPAID_LEAVE}>UNPAID_LEAVE</option>
                <option value={PenaltyType.OTHER}>OTHER</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Reason</label>
              <textarea className="w-full rounded-xl border border-slate-300 p-2" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            <div>
              <button className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Create</button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <h3 className="mb-2 font-semibold text-slate-900">Existing Penalties</h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200"><th className="py-2">User</th><th>Amount</th><th>Type</th><th>Reason</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((r: any) => (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="py-2">{r.User?.name || r.userId}</td>
                  <td className="py-2">{r.amount}</td>
                  <td className="py-2">{r.type}</td>
                  <td className="py-2">{r.reason}</td>
                  <td className="py-2">
                    {user?.role === 'ADMIN' && (
                      <button className="rounded-lg bg-rose-600 px-2 py-1 text-white" onClick={() => remove(r.id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PenaltyPage;
