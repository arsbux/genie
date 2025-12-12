
import { useState } from 'react';
import { Sparkles, MessageSquare, RotateCcw, Check, FileText } from 'lucide-react';

interface CampaignPlannerProps {
    brandResult: any;
    onGenerate: (topic: string) => Promise<any>;
    onRefine: (feedback: string) => Promise<void>;
    generating: boolean;
    content: any;
    onConfirm: () => void;
}

const CampaignPlanner = ({ onGenerate, onRefine, generating, content, onConfirm }: CampaignPlannerProps) => {
    const [topic, setTopic] = useState('');
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
        <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 md:px-0">
            <div className="text-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Plan Your Campaign</h2>
                <p className="text-slate-500 text-lg">Define the goal, and we'll architect the perfect carousel structure.</p>
            </div>

            {/* Input Phase */}
            {!content && (
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6 max-w-2xl mx-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            Campaign Topic / Goal
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 'Launch of our new Fall Collection' or 'Educational tips for First-time homebuyers'"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onGenerate(topic)}
                        />
                    </div>
                    <button
                        onClick={() => onGenerate(topic)}
                        disabled={generating}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white h-14 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {generating ? 'Generating Plan...' : 'Generate Content Plan'}
                    </button>
                </div>
            )}

            {/* Results Phase */}
            {content && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-2xl">
                        <FileText className="w-8 h-8 text-indigo-600" />
                        <h3>Proposed Strategy: <span className="text-indigo-600">{content.carousel_title}</span></h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {content.slides.map((slide: any) => (
                            <div key={slide.slide_number} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">Slide {slide.slide_number}</span>
                                    <span className="text-xs text-indigo-500 font-medium capitalize">{slide.type}</span>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2 text-sm leading-tight">{slide.title}</h4>
                                <p className="text-xs text-slate-500 mb-4 line-clamp-4">{slide.body}</p>
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Visual Concept</p>
                                    <p className="text-xs text-slate-600 italic leading-snug">{slide.visual_description}</p>
                                </div>

                                {/* Slide Edit Overlay (Simplified) */}
                                <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl p-4">
                                    <button className="text-slate-900 font-semibold text-sm bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200">
                                        Click to Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Dock */}
                    <div className="sticky bottom-6 mt-8 px-4 md:px-0">
                        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex-1 w-full flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-3">
                                <MessageSquare className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Refine plan (e.g. 'Make the hook more aggressive')"
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
                                Create Carousel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignPlanner;
