import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-3 text-center">
        <div className="h-8 bg-slate-200 rounded-lg w-2/3 mx-auto" />
        <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
      </div>

      {/* Progress steps skeleton */}
      <div className="flex justify-between items-center px-4 py-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="w-12 h-2.5 bg-slate-200 rounded hidden sm:block" />
          </div>
        ))}
      </div>

      {/* Form card skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
        <div className="space-y-2">
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-100 rounded w-2/3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-12 bg-slate-100 rounded-xl border border-slate-200/60" />
            </div>
          ))}
        </div>

        <div className="pt-6 flex justify-between items-center border-t border-slate-100">
          <div className="w-24 h-11 bg-slate-100 rounded-xl" />
          <div className="w-32 h-11 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
