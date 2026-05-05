import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import penaltyService from '../../services/penaltyService';
import { PenaltyAttributes, PenaltyType, UserAttributes } from '../../types/types';

const PenaltyPage: React.FC = () => {
  const { user } = useAuth();
  const canCreatePenalty = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [items, setItems] = useState<PenaltyAttributes[]>([]);
  const [eligibleStaff, setEligibleStaff] = useState<UserAttributes[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [target, setTarget] = useState('');
  const [type, setType] = useState<PenaltyType>(PenaltyType.LATE);
  const [amount, setAmount] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [feedback, setFeedback] = useState('');

  const selectedStaff = eligibleStaff.find((s) => s.id === target);
  const maxSinglePenalty = Number(selectedStaff?.baseSalary || 0) * 0.3;
  const exceedsSingleCap = Number(amount || 0) > maxSinglePenalty && maxSinglePenalty > 0;

  const load = async () => {
    setLoading(true);
    try {
      const [penaltyRes, staffRes] = await Promise.all([
        penaltyService.getPenalties(),
        canCreatePenalty ? penaltyService.getEligibleStaff() : Promise.resolve([]),
      ]);
      setItems(penaltyRes || []);
      setEligibleStaff(staffRes || []);
    } catch (err: any) {
      setFeedback(err.message || 'Failed to load penalties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [canCreatePenalty]);

  useEffect(() => {
    if (eligibleStaff.length > 0 && !target) {
      setTarget(eligibleStaff[0].id);
    }
  }, [eligibleStaff, target]);

  const closeModal = () => {
    setOpenModal(false);
    setTarget(eligibleStaff[0]?.id || '');
    setType(PenaltyType.LATE);
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().slice(0, 10));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await penaltyService.createPenalty({
        userId: target,
        amount: Number(amount),
        type,
        description,
        date,
      });
      setFeedback('Penalty created successfully.');
      closeModal();
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
        <p className="mt-1 text-sm text-slate-600">Track policy violations and apply penalties with role-based control.</p>
      </div>

      {feedback && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">{feedback}</div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Penalty History</h3>
          {canCreatePenalty && (
            <button
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              onClick={() => setOpenModal(true)}
            >
              Add Penalty
            </button>
          )}
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Loading penalties...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-3 pr-3 font-semibold">Employee</th>
                  <th className="py-3 pr-3 font-semibold">Date</th>
                  <th className="py-3 pr-3 font-semibold">Type</th>
                  <th className="py-3 pr-3 font-semibold">Amount</th>
                  <th className="py-3 pr-3 font-semibold">Description</th>
                  <th className="py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500">No penalty records yet.</td>
                  </tr>
                ) : (
                  items.map((r: any) => (
                    <tr key={r.id} className="border-b border-slate-100 align-top">
                      <td className="py-3 pr-3">{r.User?.name || r.userId}</td>
                      <td className="py-3 pr-3">{new Date(r.date || r.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 pr-3">{r.type}</td>
                      <td className="py-3 pr-3">{Number(r.amount).toLocaleString()}</td>
                      <td className="py-3 pr-3">{r.description || r.reason || '-'}</td>
                      <td className="py-3">
                        {user?.role === 'ADMIN' && (
                          <button className="rounded-lg bg-rose-600 px-2 py-1 text-white" onClick={() => remove(r.id)}>Delete</button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {openModal && canCreatePenalty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Add Penalty</h3>
                <p className="text-sm text-slate-500">Assign a penalty to eligible staff members only.</p>
              </div>
              <button className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100" onClick={closeModal}>Close</button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Staff Member</label>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  required
                >
                  {eligibleStaff.length === 0 ? (
                    <option value="">No eligible staff available</option>
                  ) : (
                    eligibleStaff.map((staff) => (
                      <option key={staff.id} value={staff.id}>{staff.name}</option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">Penalty Type</label>
                  <select className="mt-1 w-full rounded-xl border border-slate-300 p-2" value={type} onChange={(e) => setType(e.target.value as PenaltyType)}>
                    <option value={PenaltyType.LATE}>Late Arrival</option>
                    <option value={PenaltyType.DAMAGE}>Damages</option>
                    <option value={PenaltyType.UNPAID_LEAVE}>Unpaid Leave</option>
                    <option value={PenaltyType.OTHER}>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Date</label>
                  <input className="mt-1 w-full rounded-xl border border-slate-300 p-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Amount</label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2"
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                  required
                />
                {maxSinglePenalty > 0 && (
                  <p className="mt-1 text-xs text-slate-500">
                    Max single penalty (30% base salary): {maxSinglePenalty.toLocaleString('id-ID')}
                  </p>
                )}
                {exceedsSingleCap && (
                  <p className="mt-1 text-xs font-medium text-amber-700">
                    Amount exceeds max single penalty. System will split into 3 installments automatically.
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the violation"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={closeModal}>Cancel</button>
                <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" disabled={eligibleStaff.length === 0}>Save Penalty</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PenaltyPage;
