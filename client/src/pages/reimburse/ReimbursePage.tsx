import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import reimburseService from '../../services/reimburseService';
import { ReimburseStatus } from '../../types/types';

const ReimbursePage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [amount, setAmount] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await reimburseService.getReimburses();
      setItems(res || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('amount', String(amount));
      formData.append('description', description);
      if (receiptFile) {
        formData.append('receipt', receiptFile);
      }

      await reimburseService.requestReimburse(formData);
      setAmount('');
      setDescription('');
      setReceiptFile(null);
      setFeedback('Reimburse request submitted.');
      await load();
    } catch (err: any) {
      setFeedback(err.message || 'Failed to submit reimburse request.');
    }
  };

  const process = async (id: string, status: ReimburseStatus.APPROVED | ReimburseStatus.REJECTED) => {
    try {
      await reimburseService.processReimburse(id, { status });
      setFeedback('Reimburse request processed.');
      await load();
    } catch (err: any) {
      setFeedback(err.message || 'Failed to process reimburse request.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="text-2xl font-semibold text-slate-900">Reimbursements</h2>
        <p className="mt-1 text-sm text-slate-600">Submit expenses and review reimbursement decisions.</p>
      </div>

      {feedback && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">{feedback}</div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <h3 className="font-semibold text-slate-900">Request Reimburse</h3>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Amount</label>
              <input className="w-full rounded-xl border border-slate-300 p-2" type="number" value={amount as any} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')} required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea className="w-full rounded-xl border border-slate-300 p-2" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Receipt Photo (JPG/JPEG/PNG, max 2MB)</label>
              <input
                className="w-full rounded-xl border border-slate-300 p-2"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <button className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Submit</button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <h3 className="mb-2 font-semibold text-slate-900">Requests</h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200"><th className="py-2">User</th><th>Amount</th><th>Description</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {items.map((r: any) => (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="py-2">{r.User?.name || r.userId}</td>
                  <td className="py-2">{r.amount}</td>
                  <td className="py-2">{r.description}</td>
                  <td className="py-2">{r.status}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap items-center gap-1">
                      {r.attachmentUrl && (
                        <button
                          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-slate-700 hover:bg-slate-50"
                          onClick={() => setPreviewUrl(r.attachmentUrl)}
                        >
                          See Photo
                        </button>
                      )}

                    {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && r.status === ReimburseStatus.PENDING && (
                      <div className="space-x-2">
                        <button className="rounded-lg bg-emerald-600 px-2 py-1 text-white" onClick={() => process(r.id, ReimburseStatus.APPROVED)}>Approve</button>
                        <button className="rounded-lg bg-rose-600 px-2 py-1 text-white" onClick={() => process(r.id, ReimburseStatus.REJECTED)}>Reject</button>
                      </div>
                    )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-900">Receipt Preview</h4>
              <button
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setPreviewUrl(null)}
              >
                Close
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
              <img src={previewUrl} alt="Reimbursement receipt" className="mx-auto h-auto max-w-full rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReimbursePage;
