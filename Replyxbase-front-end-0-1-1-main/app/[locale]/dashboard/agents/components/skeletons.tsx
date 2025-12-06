import React from 'react';

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border-2 border-slate-200 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-lg" />
            <div className="w-16 h-6 bg-slate-50 rounded-full" />
          </div>
          <div className="w-24 h-8 bg-slate-200 rounded-lg mb-2" />
          <div className="w-32 h-4 bg-slate-100 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <tr className="animate-pulse">
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100" />
          <div className="space-y-2">
            <div className="w-32 h-4 bg-slate-100 rounded" />
            <div className="w-20 h-3 bg-slate-50 rounded" />
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="space-y-2">
          <div className="w-24 h-4 bg-slate-100 rounded" />
          <div className="w-20 h-3 bg-slate-50 rounded" />
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="w-16 h-6 bg-slate-100 rounded-full" />
      </td>
      <td className="py-4 px-6">
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-slate-100 rounded-lg" />
          <div className="w-8 h-8 bg-slate-100 rounded-lg" />
        </div>
      </td>
    </tr>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-5 rounded-2xl border-2 border-slate-200 bg-white animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl" />
            <div className="w-16 h-6 bg-slate-50 rounded-full" />
          </div>
          <div className="w-32 h-5 bg-slate-200 rounded-lg mb-2" />
          <div className="w-full h-4 bg-slate-50 rounded-lg mb-4" />
          <div className="w-full h-10 bg-slate-100 rounded-lg" />
        </div>
      ))}
    </div>
  );
};
