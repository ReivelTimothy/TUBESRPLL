import React from 'react';

interface StatusCardProps {
  title: string;
  value: string;
  status: 'success' | 'warning' | 'error';
}

export const StatusCard: React.FC<StatusCardProps> = ({ title, value, status }) => {
  const colors = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div className={`p-4 border rounded-xl ${colors[status]} mb-4`}>
      <h4 className="text-xs uppercase font-bold tracking-wider opacity-70">{title}</h4>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
};