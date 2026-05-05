import React, { useEffect, useState } from 'react';
import payrollService from '../../services/payrollService';
import { useAuth } from '../../context/AuthContext';
import type { PayrollRecord } from '../../types/types';

const formatIDR = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(v || 0);

const PayrollPage: React.FC = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadPayrolls = async (filters?: { startDate?: string; endDate?: string }) => {
    setLoading(true);
    try {
      const p = await payrollService.getPayrolls(filters);
      setRows(p || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayrolls();
  }, []);

  const onApplyFilter = () => {
    loadPayrolls({ startDate: startDate || undefined, endDate: endDate || undefined });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="text-2xl font-semibold text-slate-900">Payroll</h2>
        <p className="mt-1 text-sm text-slate-600">{user?.role === 'ADMIN' ? 'All employee payrolls' : user?.role === 'MANAGER' ? 'Your team and your payrolls' : 'Your payroll slips'}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
          <button
            onClick={onApplyFilter}
            className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
          >
            Apply Filter
          </button>
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
              loadPayrolls();
            }}
            className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200"
          >
            Reset
          </button>
        </div>

        {loading ? <div>Loading...</div> : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="px-2 py-2">Employee</th>
                <th className="px-2 py-2">Basic</th>
                <th className="px-2 py-2">Penalties</th>
                <th className="px-2 py-2">Deduction</th>
                <th className="px-2 py-2">Arrears</th>
                <th className="px-2 py-2">Net</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id} className="border-t">
                  <td className="px-2 py-2">{r.User?.name || r.userId}</td>
                  <td className="px-2 py-2">{formatIDR(r.basicSalary)}</td>
                  <td className="px-2 py-2">{formatIDR(r.totalPenalties)}</td>
                  <td className="px-2 py-2">{formatIDR(r.actualDeduction)} <span className="text-xs text-slate-500">(cap {formatIDR(r.cappedDeduction)})</span></td>
                  <td className="px-2 py-2">{formatIDR(r.penaltyArrears)}</td>
                  <td className="px-2 py-2 font-semibold">{formatIDR(r.netSalary)}</td>
                  <td className="px-2 py-2"><span className="rounded px-2 py-1 text-xs bg-slate-100">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PayrollPage;
