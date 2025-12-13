import { Palette, Type, Users, Briefcase, Megaphone, Check, RotateCcw, ChevronLeft, Eye } from 'lucide-react';
import { useState } from 'react';

interface IdentityReviewProps {
    result: any;
    onConfirm: () => void;
    onRefine: (feedback: string) => Promise<void>;
}

const IdentityReview = ({ result, onConfirm, onRefine }: IdentityReviewProps) => {
    const [feedback, setFeedback] = useState('');
    const [refining, setRefining] = useState(false);

    const handleRefine = async () => {
        if (!feedback) return;
        setRefining(true);
        await onRefine(feedback);
        setRefining(false);
        setFeedback('');
    };

    return (
        <div className="w-full max-w-6xl mx-auto min-h-[calc(100vh-120px)] flex flex-col px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="text-center py-6 lg:py-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">Your Brand Identity</h2>
                <p className="text-slate-500 text-sm lg:text-base">Review what we discovered about your brand</p>
            </div>

            {/* Desktop: Grid Layout / Mobile: Stack */}
            <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-6">

                {/* Left Column - Colors & Typography */}
                <div className="space-y-6">
                    {/* Brand Colors */}
                    <div className="bg-white rounded-2xl lg:rounded-3xl p-5 lg:p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Palette className="w-5 h-5 text-indigo-500" />
                            <span className="text-sm font-semibold text-slate-700">Brand Colors</span>
                        </div>
                        <div className="flex gap-3">
                            {Object.entries(result.brand_identity.colors).map(([name, hex]: [string, any]) => (
                                <div key={name} className="flex-1">
                                    <div
                                        className="aspect-square rounded-xl lg:rounded-2xl shadow-inner ring-1 ring-black/5 mb-2"
                                        style={{ backgroundColor: hex }}
                                    />
                                    <p className="text-xs font-medium text-slate-500 text-center capitalize">{name}</p>
                                    <p className="text-xs text-slate-400 text-center font-mono hidden lg:block">{hex}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Typography */}
                    <div className="bg-white rounded-2xl lg:rounded-3xl p-5 lg:p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Type className="w-5 h-5 text-pink-500" />
                            <span className="text-sm font-semibold text-slate-700">Typography</span>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs text-slate-400 mb-1">Heading Font</p>
                                <p className="text-xl font-bold text-slate-900">{result.brand_identity.fonts.heading}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs text-slate-400 mb-1">Body Font</p>
                                <p className="text-base text-slate-700">{result.brand_identity.fonts.body}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Column - Brand Attributes */}
                <div className="space-y-4">
                    {/* Tone */}
                    <div className="flex items-start gap-4 bg-indigo-50 rounded-2xl p-5 lg:p-6">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Megaphone className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-indigo-600 font-semibold mb-1">Voice & Tone</p>
                            <p className="text-sm lg:text-base text-slate-700">{result.brand_identity.tone}</p>
                        </div>
                    </div>

                    {/* Audience */}
                    <div className="flex items-start gap-4 bg-violet-50 rounded-2xl p-5 lg:p-6">
                        <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Users className="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                            <p className="text-sm text-violet-600 font-semibold mb-1">Target Audience</p>
                            <p className="text-sm lg:text-base text-slate-700">{result.brand_identity.audience}</p>
                        </div>
                    </div>

                    {/* Industry */}
                    <div className="flex items-start gap-4 bg-cyan-50 rounded-2xl p-5 lg:p-6">
                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div>
                            <p className="text-sm text-cyan-600 font-semibold mb-1">Industry</p>
                            <p className="text-sm lg:text-base text-slate-700">{result.brand_identity.industry}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Design Direction & Actions */}
                <div className="flex flex-col gap-6">
                    {/* Design Direction */}
                    <div className="flex-1 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl lg:rounded-3xl p-5 lg:p-6 text-white">
                        <div className="flex items-center gap-2 mb-4">
                            <Eye className="w-5 h-5 text-indigo-200" />
                            <span className="text-sm font-semibold text-indigo-200">AI Design Direction</span>
                        </div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-sm font-medium mb-4">
                            {result.design_recommendation.style}
                        </div>
                        <p className="text-sm lg:text-base text-white/90 leading-relaxed mb-4">
                            {result.design_recommendation.description}
                        </p>
                        {result.design_recommendation.typography && (
                            <div className="bg-white/10 rounded-xl p-3 mt-4">
                                <p className="text-xs font-medium text-indigo-200 mb-1">Typography Tip</p>
                                <p className="text-xs text-white/80">{result.design_recommendation.typography}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions Card */}
                    <div className="bg-white rounded-2xl lg:rounded-3xl p-5 lg:p-6 border border-slate-100 shadow-sm">
                        {/* Refinement Input */}
                        <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 p-2 mb-4">
                            <input
                                type="text"
                                placeholder="Refine: 'Make the tone more playful'"
                                className="flex-1 bg-transparent border-none outline-none text-slate-700 text-sm px-2"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                            />
                            <button
                                onClick={handleRefine}
                                disabled={refining || !feedback}
                                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-40"
                            >
                                <RotateCcw className={`w-4 h-4 text-slate-600 ${refining ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={onConfirm}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Looks Good, Continue
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Spacing */}
            <div className="h-6 lg:h-10" />
        </div>
    );
};

export default IdentityReview;
