import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
      <div className="max-w-4xl mx-auto px-4 space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-slate-600 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>PropKart Technology Ecosystem • Real-time Property Desk • <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px]">v1.0.0</span></span>
        </div>
        <p className="text-[11px] text-slate-400">
          Powered by PropKart Dynamic Forms Architecture. Your property submission is encrypted with AES-256 and securely stored in the authorized property pool.
        </p>
        <p className="text-[10px] text-slate-400">
          © {new Date().getFullYear()} PropKart NB Property Tech. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
