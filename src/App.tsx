import React, { useState, useEffect } from 'react';
import { useActiveForm } from './hooks/useActiveForm';
import { DynamicFormRenderer } from './components/DynamicFormRenderer';
import { SuccessView } from './components/SuccessView';
import { PropertyShowcaseView } from './components/PropertyShowcaseView';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SkeletonLoader } from './components/common/SkeletonLoader';
import { SubmissionResult } from './types/form';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const { form, loading, error, retry } = useActiveForm();
  const [submissionSuccess, setSubmissionSuccess] = useState<SubmissionResult | null>(null);
  const [submittedData, setSubmittedData] = useState<Record<string, any>>({});

  // Check URL params for ?view=PK-REG-... or /property/PK-REG-...
  const getInitialViewCode = (): string | null => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') || params.get('property') || params.get('code');
    if (viewParam) return viewParam;

    const pathMatch = window.location.pathname.match(/\/property\/([A-Za-z0-9-_]+)/);
    if (pathMatch) return pathMatch[1];

    return null;
  };

  const [viewCode, setViewCode] = useState<string | null>(getInitialViewCode());

  useEffect(() => {
    const handlePopState = () => {
      setViewCode(getInitialViewCode());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSuccess = (result: SubmissionResult, data: Record<string, any>) => {
    setSubmissionSuccess(result);
    setSubmittedData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSubmissionSuccess(null);
    setSubmittedData({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar assistancePhone={form?.assistance_phone} />

      <main className="flex-1">
        {loading && <SkeletonLoader />}

        {error && !loading && (
          <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Unable to Load Registration Form</h2>
            <p className="text-xs text-slate-600">{error}</p>
            <button
              onClick={retry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 active:scale-95 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {viewCode ? (
          <PropertyShowcaseView
            registrationCode={viewCode}
            onBackToForm={() => {
              setViewCode(null);
              window.history.pushState({}, '', window.location.pathname);
            }}
          />
        ) : !loading && !error && form ? (
          <>
            {submissionSuccess ? (
              <SuccessView
                result={submissionSuccess}
                onReset={handleReset}
                formData={submittedData}
                assistancePhone={form?.assistance_phone}
              />
            ) : (
              <DynamicFormRenderer
                schema={form}
                onSuccess={handleSuccess}
              />
            )}
          </>
        ) : null}
      </main>

      <Footer />
    </div>
  );
};

export default App;
