import React, { useEffect, useState } from 'react';
import { fetchPublicProperty } from '../services/api';
import {
  Building2,
  MapPin,
  Compass,
  ExternalLink,
  Share2,
  ArrowLeft,
  IndianRupee,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface PropertyShowcaseViewProps {
  registrationCode: string;
  onBackToForm: () => void;
}

export const PropertyShowcaseView: React.FC<PropertyShowcaseViewProps> = ({
  registrationCode,
  onBackToForm,
}) => {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPublicProperty(registrationCode);
        setProperty(data);
      } catch (err: any) {
        setError(err.message || 'Unable to load property details.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [registrationCode]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!property) return;
    const isRent = String(property.listing_type).toLowerCase() === 'rent';
    const priceText = property.expected_price
      ? `₹${Number(property.expected_price).toLocaleString('en-IN')}${isRent ? ' / month' : ''}`
      : 'Price on Request';

    const text = `🏡 *PropKart Verified Property* (${property.registration_code})
• *Type:* ${property.property_type || 'Residential'} (${property.listing_type || 'Sale'})
• *Price:* ${priceText}
• *Location:* ${property.address || property.area || ''}, ${property.city || ''}
${property.direction ? `• *Landmark:* ${property.direction}\n` : ''}${property.location_url ? `• *Google Maps:* ${property.location_url}\n` : ''}
🔗 *View Full Property Showcase:* ${window.location.href}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-xs font-semibold text-slate-500">Loading verified property showcase...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Property Showcase Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'The requested property could not be found.'}</p>
        <button
          onClick={onBackToForm}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-all active:scale-[0.98] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Register a Property</span>
        </button>
      </div>
    );
  }

  const isRent = String(property.listing_type).toLowerCase() === 'rent';
  const photos = property.photos || [];
  const hasPhotos = photos.length > 0;
  const activePhoto = hasPhotos ? photos[activePhotoIndex]?.url : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBackToForm}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-black/[0.08] text-xs font-semibold text-slate-700 shadow-2xs transition-all active:scale-[0.97] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Register Another Property</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-all active:scale-[0.97] cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share on WhatsApp</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 border border-black/[0.08] text-xs font-semibold text-slate-700 shadow-2xs transition-all active:scale-[0.97] cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Showcase Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-3xl p-5 sm:p-8 shadow-apple-sm space-y-6">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-black/[0.06]">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-black/[0.06]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {property.registration_code}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                isRent
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isRent ? 'For Rent' : 'For Sale'}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              {property.property_type || 'Residential'}
            </span>
          </div>

          {/* Formatted Expected Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-semibold text-slate-400">Expected:</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {property.expected_price
                ? `₹${Number(property.expected_price).toLocaleString('en-IN')}`
                : 'Price on Request'}
            </span>
            {isRent && <span className="text-xs font-medium text-slate-500">/ month</span>}
          </div>
        </div>

        {/* Photo Gallery Carousel */}
        {hasPhotos ? (
          <div className="space-y-3">
            {/* Active Full Photo */}
            <div className="relative aspect-video sm:aspect-21/9 rounded-2xl overflow-hidden bg-slate-900 border border-black/[0.08] group">
              <img
                src={activePhoto}
                alt={`Property Photo ${activePhotoIndex + 1}`}
                className="w-full h-full object-contain sm:object-cover"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-mono font-medium">
                Photo {activePhotoIndex + 1} of {photos.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {photos.map((p: any, idx: number) => (
                  <button
                    key={p.id || idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activePhotoIndex === idx
                        ? 'border-emerald-600 scale-105 shadow-xs'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
            No photos uploaded for this property.
          </div>
        )}

        {/* Specifications & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Address & City */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-black/[0.06] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Property Address</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed">
              {property.address || 'Address on record'}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              {property.area ? `${property.area}, ` : ''}{property.city || 'Surat, Gujarat'}
            </p>
          </div>

          {/* Direction & Landmarks */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-black/[0.06] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Direction & Landmarks</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed">
              {property.direction || 'Prominent locality landmark available upon contact.'}
            </p>
          </div>
        </div>

        {/* Google Maps Button */}
        {property.location_url && (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-950">Verified Location Available</div>
                <div className="text-[11px] text-emerald-800">
                  Exact Google Maps pin registered by the owner
                </div>
              </div>
            </div>

            <a
              href={property.location_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all active:scale-[0.98] shadow-xs cursor-pointer"
            >
              <span>Open on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
