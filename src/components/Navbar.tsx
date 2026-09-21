import React from 'react';
import { Building2, PhoneCall } from 'lucide-react';

interface NavbarProps {
  assistancePhone?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ assistancePhone = '+91 9879458308' }) => {
  const telHref = `tel:${assistancePhone.replace(/[^0-9+]/g, '')}`;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/75 border-b border-black/[0.06] transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-sm sm:text-base text-slate-900 tracking-tight truncate">
              PropKart <span className="text-emerald-600">Connect</span>
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-black/[0.04] text-slate-600 border border-black/[0.04]">
              v1.0.0
            </span>
          </div>
        </div>

        {/* Assistance CTA Pill */}
        <div className="flex items-center shrink-0">
          <a
            href={telHref}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] active:scale-[0.97] transition-all text-xs font-semibold text-slate-800 border border-black/[0.06]"
            title={`Assistance: ${assistancePhone}`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline text-slate-500 font-normal">Assistance:</span>
            <span className="font-mono text-slate-900">{assistancePhone}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
