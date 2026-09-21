import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Copy, Check, MessageSquare, PhoneCall, RefreshCw } from 'lucide-react';
import { SubmissionResult } from '../types/form';

interface SuccessViewProps {
  result: SubmissionResult;
  onReset: () => void;
  formData: Record<string, any>;
  assistancePhone?: string;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  result,
  onReset,
  formData,
  assistancePhone = '+91 9879458308',
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#059669', '#10B981', '#34D399', '#1d1d1f'],
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const copyRegistrationCode = () => {
    navigator.clipboard.writeText(result.registration_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const rawDigits = (assistancePhone || '').replace(/\D/g, '');
  let cleanWaNumber = rawDigits;
  if (cleanWaNumber.startsWith('0')) {
    cleanWaNumber = cleanWaNumber.substring(1);
  }
  if (cleanWaNumber.length === 10) {
    cleanWaNumber = `91${cleanWaNumber}`;
  } else if (!cleanWaNumber.startsWith('91') && cleanWaNumber.length > 0) {
    cleanWaNumber = `91${cleanWaNumber}`;
  }
  if (!cleanWaNumber) {
    cleanWaNumber = '919879458308';
  }

  const whatsappMessage = encodeURIComponent(
    `Hello PropKart, I have registered my property with Reference ID: ${result.registration_code}. Please assist with verification.`
  );
  const whatsappUrl = `https://wa.me/${cleanWaNumber}?text=${whatsappMessage}`;

  const ownerName = formData.owner_name || formData.full_name || '';

  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl border border-black/[0.06] shadow-apple-lg text-center p-6 sm:p-10 space-y-6">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-2xs mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Registration Received
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            {ownerName ? `Thank you, ${ownerName}. ` : ''}Your property details are safely recorded. Our team will reach out shortly.
          </p>
        </div>

        {/* Registration Reference Card */}
        <div className="bg-slate-50/80 border border-black/[0.06] rounded-2xl p-4 sm:p-5 max-w-sm mx-auto space-y-2">
          <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Reference ID
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg sm:text-xl font-mono font-bold tracking-wider text-slate-900 bg-white px-3.5 py-1.5 rounded-xl border border-black/[0.08] shadow-2xs">
              {result.registration_code}
            </span>
            <button
              onClick={copyRegistrationCode}
              className="p-2 rounded-xl bg-white border border-black/[0.08] text-slate-700 hover:text-black hover:border-black/[0.2] active:scale-95 transition-all shadow-2xs cursor-pointer"
              title="Copy Reference ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copied && <p className="text-[11px] text-emerald-600 font-medium">Copied to clipboard</p>}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-3 max-w-sm mx-auto">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-apple active:scale-[0.98] transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Connect on WhatsApp</span>
          </a>

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`tel:${assistancePhone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-slate-800 text-xs font-semibold border border-black/[0.06] active:scale-[0.97] transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
              <span>Call Desk</span>
            </a>

            <button
              onClick={onReset}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-slate-800 text-xs font-semibold border border-black/[0.06] active:scale-[0.97] transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Register Another</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
