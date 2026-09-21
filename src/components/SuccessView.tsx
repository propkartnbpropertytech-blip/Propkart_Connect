import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Copy, Check, MessageSquare, PhoneCall, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';
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
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10B981', '#34D399', '#F59E0B'],
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

  // Clean and format dynamic assistance phone for WhatsApp (wa.me expects country code + digits, e.g. 919879458308)
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
    `Hello PropKart Team, I have registered my property with Registration ID: ${result.registration_code}. Please assist me with verification and next steps.`
  );
  const whatsappUrl = `https://wa.me/${cleanWaNumber}?text=${whatsappMessage}`;

  const ownerName = formData.owner_name || formData.full_name || 'Property Owner';
  const propType = formData.property_type || 'Property';
  const city = formData.city || 'Gujarat';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden text-center p-6 sm:p-10 space-y-6">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border-8 border-emerald-100/60 shadow-sm mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
            Property Registration Complete!
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Thank you, <span className="font-semibold text-slate-800">{ownerName}</span>. Your {propType} in {city} has been received into our system. Our dedicated property telecaller will review your details and contact you shortly.
          </p>
        </div>

        {/* Registration Code Card */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 max-w-md mx-auto space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Registration Reference ID
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl sm:text-2xl font-mono font-bold tracking-widest text-brand-700 bg-white px-4 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              {result.registration_code}
            </span>
            <button
              onClick={copyRegistrationCode}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-brand-600 hover:border-brand-300 active:scale-95 transition-all shadow-2xs"
              title="Copy Reference ID"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          {copied && <p className="text-xs text-emerald-600 font-medium">Copied to clipboard!</p>}
        </div>

        {/* Next Steps / CTAs */}
        <div className="pt-2 space-y-3 max-w-md mx-auto">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-lg active:scale-98 transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Connect on WhatsApp for Instant Support</span>
            <ArrowRight className="w-4 h-4 ml-auto opacity-75" />
          </a>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href={`tel:${assistancePhone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
              <span>Call PropKart Desk</span>
            </a>

            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Register Another Property</span>
            </button>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>PropKart Verified Listing • 100% Privacy & Zero Spam Guarantee</span>
        </div>
      </div>
    </div>
  );
};
