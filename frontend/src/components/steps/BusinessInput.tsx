import { useState } from 'react';
import { ArrowRight, Loader2, Link2, FileText, ChevronLeft, Globe, Sparkles } from 'lucide-react';

interface BusinessInputProps {
    onAnalyze: (url: string, description: string) => Promise<void>;
    analyzing: boolean;
}

const BusinessInput = ({ onAnalyze, analyzing }: BusinessInputProps) => {
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [step, setStep] = useState(1);

    const handleSubmit = () => {
        if (url) {
            onAnalyze(url, description);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto min-h-[calc(100vh-120px)] flex flex-col lg:flex-row lg:items-center lg:gap-16 px-4">

            {/* Desktop Left Side - Hero Text */}
            <div className="hidden lg:flex lg:flex-1 flex-col">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6 w-fit">
                    <Sparkles className="w-4 h-4" />
                    Powered by AI
                </div>
                <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-4">
                    Create stunning<br />
                    <span className="text-indigo-600">carousel posts</span><br />
                    in minutes
                </h1>
                <p className="text-lg text-slate-500 mb-8 max-w-md">
                    Our AI analyzes your brand and generates scroll-stopping carousel content tailored to your audience.
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Brand Analysis
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        AI Content Strategy
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Image Generation
                    </div>
                </div>
            </div>

            {/* Right Side / Mobile - Form Card */}
            <div className="flex-1 lg:max-w-md flex flex-col">

                {/* Progress Indicator - Mobile Only */}
                <div className="flex items-center justify-center py-6 lg:hidden">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-1 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                        <div className={`w-8 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                    </div>
                </div>

                {/* Card Container */}
                <div className="flex-1 lg:flex-initial flex flex-col bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden lg:shadow-2xl">

                    {/* Back Button */}
                    {step > 1 && (
                        <button
                            onClick={() => setStep(1)}
                            className="p-4 self-start text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}

                    <div className="flex-1 flex flex-col p-6 pt-2 lg:p-8">

                        {/* Step 1: Website URL */}
                        {step === 1 && (
                            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* Desktop Header */}
                                <div className="hidden lg:flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Step 1</p>
                                        <p className="text-sm font-medium text-slate-700">Enter your website</p>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-slate-900 mb-2 leading-tight lg:hidden">
                                    What's your website URL?
                                </h2>
                                <h2 className="hidden lg:block text-xl font-bold text-slate-900 mb-2">
                                    Let's analyze your brand
                                </h2>
                                <p className="text-slate-500 text-sm mb-8">
                                    We'll extract colors, fonts, and brand voice automatically
                                </p>

                                <div className="space-y-4 flex-1">
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Link2 className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="url"
                                            placeholder="https://yourbusiness.com"
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-12 pr-4 py-4 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all text-base"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && url && setStep(2)}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!url}
                                    className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white h-14 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2"
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Step 2: Additional Context */}
                        {step === 2 && (
                            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* Desktop Header */}
                                <div className="hidden lg:flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-violet-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Step 2</p>
                                        <p className="text-sm font-medium text-slate-700">Add context (optional)</p>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-slate-900 mb-2 leading-tight lg:hidden">
                                    Tell us more about<br />your brand
                                </h2>
                                <h2 className="hidden lg:block text-xl font-bold text-slate-900 mb-2">
                                    Any additional context?
                                </h2>
                                <p className="text-slate-500 text-sm mb-6">
                                    Help us understand your brand better
                                </p>

                                <div className="flex-1">
                                    {/* Quick Options */}
                                    <div className="space-y-3 mb-6">
                                        {['Target audience & demographics', 'Brand voice & personality', 'Key products or services'].map((option, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setDescription(prev => prev ? `${prev}\n• ${option}` : `• ${option}`)}
                                                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-300 rounded-xl transition-all group"
                                            >
                                                <span className="text-slate-700 text-sm font-medium">{option}</span>
                                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-indigo-500 group-hover:bg-indigo-500 transition-colors flex items-center justify-center">
                                                    <span className="text-white text-xs opacity-0 group-hover:opacity-100">✓</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Text Area */}
                                    <div className="relative">
                                        <div className="absolute left-4 top-4 text-slate-400">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <textarea
                                            placeholder="Add your own details..."
                                            className="w-full h-28 bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm resize-none"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={analyzing}
                                    className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white h-14 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2"
                                >
                                    {analyzing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            Analyze Brand
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skip Link */}
                {step === 2 && !analyzing && (
                    <button
                        onClick={handleSubmit}
                        className="py-4 text-center text-slate-400 text-sm hover:text-slate-600 transition-colors"
                    >
                        Skip and continue →
                    </button>
                )}
            </div>
        </div>
    );
};

export default BusinessInput;
