import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-black/[0.06] bg-white/50 backdrop-blur-sm py-6 text-xs text-slate-500">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">PropKart Connect</span>
          <span className="text-slate-300">•</span>
          <span className="font-mono text-[11px] text-slate-400">v1.0.0</span>
        </div>
        <p className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} NB Property Tech. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
