import { useState } from 'react';
import { ArrowRight, Loader2, Link2, FileText, ChevronLeft, Globe, Sparkles, Check } from 'lucide-react';

interface BusinessInputProps {
    onAnalyze: (url: string, description: string) => Promise<void>;
    analyzing: boolean;
}

const CONTEXT_OPTIONS = [
    { id: 'audience', label: 'Target audience & demographics', icon: '👥' },
    { id: 'voice', label: 'Brand voice & personality', icon: '💬' },
    { id: 'products', label: 'Key products or services', icon: '📦' },
    { id: 'goals', label: 'Marketing goals', icon: '🎯' },
];

const BusinessInput = ({ onAnalyze, analyzing }: BusinessInputProps) => {
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [step, setStep] = useState(1);
    const [selectedContexts, setSelectedContexts] = useState<string[]>([]);

    const handleSubmit = () => {
        if (url) {
            onAnalyze(url, description);
        }
    };

    const toggleContext = (id: string) => {
        setSelectedContexts(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
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
                        AI Strategy
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Image Gen
                    </div>
                </div>
            </div>

            {/* Right Side / Mobile - Form */}
            <div className="flex-1 lg:max-w-md flex flex-col py-6">

                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-6 lg:mb-8">
                    <div className="flex items-center gap-2">
                        <div className={`w-10 h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                        <div className={`w-10 h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                    </div>
                </div>

                {/* Desktop Only: Card Container */}
                <div className="lg:bg-white lg:rounded-3xl lg:shadow-2xl lg:border lg:border-slate-100 lg:p-8">

                    {/* Back Button */}
                    {step > 1 && (
                        <button
                            onClick={() => setStep(1)}
                            className="mb-4 text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 text-sm font-medium"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </button>
                    )}

                    {/* Step 1: Website URL */}
                    {step === 1 && (
                        <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                                    <Globe className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-600 uppercase tracking-wider font-bold">Step 1</p>
                                    <p className="text-lg font-bold text-slate-900">Your website</p>
                                </div>
                            </div>

                            <p className="text-slate-500 text-sm mb-6">
                                We'll extract your brand colors, fonts, and voice automatically
                            </p>

                            <div className="relative mb-6">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Link2 className="w-5 h-5" />
                                </div>
                                <input
                                    type="url"
                                    placeholder="https://yourbusiness.com"
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all text-base"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && url && setStep(2)}
                                />
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                disabled={!url}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white h-14 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-2"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Additional Context */}
                    {step === 2 && (
                        <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-violet-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-violet-600 uppercase tracking-wider font-bold">Step 2</p>
                                    <p className="text-lg font-bold text-slate-900">Add context</p>
                                </div>
                            </div>

                            <p className="text-slate-500 text-sm mb-6">
                                Select topics you'd like to include (optional)
                            </p>

                            {/* Context Options - Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {CONTEXT_OPTIONS.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => toggleContext(option.id)}
                                        className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left ${selectedContexts.includes(option.id)
                                                ? 'bg-indigo-50 border-indigo-500'
                                                : 'bg-white border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-2">
                                            <span className="text-xl">{option.icon}</span>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedContexts.includes(option.id)
                                                    ? 'border-indigo-500 bg-indigo-500'
                                                    : 'border-slate-300'
                                                }`}>
                                                {selectedContexts.includes(option.id) && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-slate-700 leading-tight">{option.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Custom Details */}
                            <textarea
                                placeholder="Add any other details about your brand..."
                                className="w-full h-24 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm resize-none mb-6"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            <button
                                onClick={handleSubmit}
                                disabled={analyzing}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white h-14 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-2"
                            >
                                {analyzing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing your brand...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Analyze Brand
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Skip Link */}
                {step === 2 && !analyzing && (
                    <button
                        onClick={handleSubmit}
                        className="mt-4 text-center text-slate-400 text-sm hover:text-slate-600 transition-colors"
                    >
                        Skip and continue →
                    </button>
                )}
            </div>
        </div>
    );
};

export default BusinessInput;
