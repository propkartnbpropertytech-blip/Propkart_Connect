import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Check, AlertCircle, Loader2 } from 'lucide-react';

interface LocationValue {
  url?: string;
  lat?: number;
  lng?: number;
  address?: string;
}

interface LocationPickerProps {
  value: LocationValue | string | undefined;
  onChange: (val: LocationValue) => void;
  error?: string;
  required?: boolean;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  error,
  required = false,
}) => {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Normalize value
  const locVal: LocationValue =
    typeof value === 'string'
      ? { url: value }
      : value || {};

  const handleUrlChange = (urlStr: string) => {
    onChange({
      ...locVal,
      url: urlStr,
    });
  };

  const captureCurrentGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

        onChange({
          ...locVal,
          lat,
          lng,
          url: googleMapsUrl,
        });

        setGpsLoading(false);
        setGpsSuccess(true);
        setTimeout(() => setGpsSuccess(false), 3500);
      },
      (err) => {
        setGpsLoading(false);
        setGpsError(err.message || 'Unable to retrieve location. Please check location permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Strictly validate official Google Maps URLs only
  const isUrlValid = Boolean(
    locVal.url &&
    /^https:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(locVal.url.trim())
  );
  const isInvalidUrlEntered = Boolean(locVal.url && !isUrlValid);

  return (
    <div className="space-y-3">
      {/* GPS Capture Action Card */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:border-brand-500/40">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand-50 text-brand-700 shrink-0 mt-0.5">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-800 tracking-tight">Auto-detect GPS Location</div>
            <div className="text-xs text-slate-500">Stand at the property and capture exact GPS coordinates</div>
          </div>
        </div>

        <button
          type="button"
          onClick={captureCurrentGps}
          disabled={gpsLoading}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50 shrink-0"
        >
          {gpsLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
              <span>Detecting...</span>
            </>
          ) : gpsSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">GPS Locked!</span>
            </>
          ) : (
            <>
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>Use My Location</span>
            </>
          )}
        </button>
      </div>

      {gpsError && (
        <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200/80 px-3 py-2 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Google Maps URL Input */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Google Maps Link / URL {required && <span className="text-rose-500">*</span>}
        </label>
        <div className="relative">
          <input
            type="url"
            value={locVal.url || ''}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://maps.app.goo.gl/... or paste link from Google Maps"
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              error || isInvalidUrlEntered
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 focus:border-brand-600 focus:ring-brand-600/20'
            }`}
          />
          {locVal.url && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {isUrlValid ? (
                <a
                  href={locVal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                  title="Verified Google Maps link"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Valid Map</span>
                </a>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-md">
                  Invalid Map Link
                </span>
              )}
            </div>
          )}
        </div>

        {/* Display detected coordinates if present */}
        {locVal.lat && locVal.lng && (
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Coordinates: {locVal.lat}, {locVal.lng}</span>
          </div>
        )}

        {isInvalidUrlEntered && !error && (
          <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Only official Google Maps links (e.g. https://maps.app.goo.gl/... or https://maps.google.com/...) are accepted.</span>
          </p>
        )}

        {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
      </div>
    </div>
  );
};
