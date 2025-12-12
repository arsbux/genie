import { Palette, Type, Target, Eye, MessageSquare, Check, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface IdentityReviewProps {
    result: any;
    onConfirm: () => void;
    onRefine: (feedback: string) => Promise<void>; // To be implemented logic
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
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 md:px-0">
            <div className="text-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Review Brand Identity</h2>
                <p className="text-slate-500 text-lg">We've extracted this from your inputs. Is it accurate?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                {/* Brand Colors */}
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 space-y-4">
                    <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
                        <Palette className="w-5 h-5 text-indigo-500" />
                        <h3>Brand Colors</h3>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {Object.entries(result.brand_identity.colors).map(([name, hex]: [string, any]) => (
                            <div key={name} className="flex-1 space-y-2 group">
                                <div
                                    className="aspect-square rounded-2xl shadow-inner ring-1 ring-black/5 transition-transform group-hover:scale-105"
                                    style={{ backgroundColor: hex }}
                                />
                                <div className="text-center">
                                    <p className="text-xs font-medium text-slate-500 capitalize">{name}</p>
                                    <p className="text-xs font-mono text-slate-400">{hex}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Typography */}
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 space-y-4">
                    <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
                        <Type className="w-5 h-5 text-pink-500" />
                        <h3>Typography</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Heading Font</p>
                            <p className="text-2xl font-bold text-slate-900">{result.brand_identity.fonts.heading}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Body Font</p>
                            <p className="text-lg text-slate-700">{result.brand_identity.fonts.body}</p>
                        </div>
                    </div>
                </div>

                {/* Brand Strategy */}
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 space-y-4 md:col-span-2">
                    <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        <h3>Strategic Profile</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Tone & Voice</p>
                            <p className="text-slate-800 font-medium">{result.brand_identity.tone}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Audience</p>
                            <p className="text-slate-800 font-medium">{result.brand_identity.audience}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Industry</p>
                            <p className="text-slate-800 font-medium">{result.brand_identity.industry}</p>
                        </div>
                    </div>
                </div>

                {/* Design Direction */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-3xl shadow-lg text-white md:col-span-2">
                    <div className="flex items-center gap-2 font-semibold mb-4 text-indigo-100">
                        <Eye className="w-5 h-5" />
                        <h3>AI Design Direction</h3>
                    </div>
                    <div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-3">
                            {result.design_recommendation.style}
                        </div>
                        <p className="text-xl text-white/90 leading-relaxed font-light mb-4">
                            {result.design_recommendation.description}
                        </p>
                        {result.design_recommendation.typography && (
                            <div className="bg-white/10 p-4 rounded-xl">
                                <p className="text-xs font-medium text-indigo-200 uppercase tracking-wider mb-1">Typography Guide</p>
                                <p className="text-sm text-white/80">{result.design_recommendation.typography}</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Action Dock */}
            <div className="sticky bottom-6 mt-8 px-4 md:px-0">
                <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 w-full flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-3">
                        <MessageSquare className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Type here to refine..."
                            className="bg-transparent border-none outline-none text-white placeholder:text-slate-500 w-full text-sm md:text-base"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                        />
                        <button
                            onClick={handleRefine}
                            disabled={refining}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <RotateCcw className={`w-4 h-4 text-slate-400 ${refining ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <button
                        onClick={onConfirm}
                        className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                        <Check className="w-5 h-5" />
                        Looks Good
                    </button>
                </div>
            </div>

        </div>
    );
};

export default IdentityReview;
