import React from 'react';
import { Building2, Shield, PhoneCall } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm shadow-brand-600/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                PropKart <span className="text-brand-600">Connect</span>
              </span>
              <span className="hidden xs:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
                Instant Registration
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Dynamic Property Submission Portal
            </p>
          </div>
        </div>

        {/* Action / Help Contact */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Listing Desk</span>
          </div>

          <a
            href="tel:+919898012345"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-brand-600" />
            <span className="hidden sm:inline">Assistance:</span>
            <span className="hidden xs:inline">+91 98980 12345</span>
          </a>
        </div>
      </div>
    </header>
  );
};
