import React, { useState } from 'react';
import { useActiveForm } from './hooks/useActiveForm';
import { DynamicFormRenderer } from './components/DynamicFormRenderer';
import { SuccessView } from './components/SuccessView';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SkeletonLoader } from './components/common/SkeletonLoader';
import { SubmissionResult } from './types/form';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const { form, loading, error, retry } = useActiveForm();
  const [submissionSuccess, setSubmissionSuccess] = useState<SubmissionResult | null>(null);
  const [submittedData, setSubmittedData] = useState<Record<string, any>>({});

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

        {!loading && !error && form && (
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
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
