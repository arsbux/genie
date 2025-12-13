import { useState } from 'react';
import { Sparkles, Loader2, RotateCcw, Check, Lightbulb, Zap, Target, MessageCircle, FileText, ArrowRight } from 'lucide-react';

interface CampaignPlannerProps {
    brandResult: any;
    onGenerate: (topic: string) => Promise<any>;
    onRefine: (feedback: string) => Promise<void>;
    generating: boolean;
    content: any;
    onConfirm: () => void;
}

const TOPIC_SUGGESTIONS = [
    { icon: Lightbulb, label: 'Educational tips', desc: 'Share valuable knowledge', value: 'Educational tips for our audience' },
    { icon: Zap, label: 'Product launch', desc: 'Announce something new', value: 'New product or service launch' },
    { icon: Target, label: 'Brand story', desc: 'Share your journey', value: 'Share our brand story and values' },
    { icon: MessageCircle, label: 'Customer success', desc: 'Showcase testimonials', value: 'Customer success stories and testimonials' },
];

const CampaignPlanner = ({ onGenerate, onRefine, generating, content, onConfirm }: CampaignPlannerProps) => {
    const [topic, setTopic] = useState('');
    const [feedback, setFeedback] = useState('');
    const [refining, setRefining] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);

    const handleRefine = async () => {
        if (!feedback) return;
        setRefining(true);
        await onRefine(feedback);
        setRefining(false);
        setFeedback('');
    };

    const handleSelectTopic = (index: number, value: string) => {
        setSelectedSuggestion(index);
        setTopic(value);
    };

    return (
        <div className="w-full max-w-6xl mx-auto min-h-[calc(100vh-120px)] flex flex-col px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="text-center py-6 lg:py-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
                    {content ? 'Your Content Strategy' : 'Plan Your Campaign'}
                </h2>
                <p className="text-slate-500 text-sm lg:text-base">
                    {content ? 'Review and refine your carousel plan' : 'Choose a topic or describe your campaign goal'}
                </p>
            </div>

            {/* Input Phase */}
            {!content && (
                <div className="flex-1 flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">

                    {/* Left: Topic Suggestions */}
                    <div className="lg:flex-1">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick Topics</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {TOPIC_SUGGESTIONS.map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSelectTopic(i, suggestion.value)}
                                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${selectedSuggestion === i
                                            ? 'bg-indigo-600 border-indigo-600 text-white'
                                            : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedSuggestion === i ? 'bg-indigo-500' : 'bg-slate-100'
                                        }`}>
                                        <suggestion.icon className={`w-5 h-5 ${selectedSuggestion === i ? 'text-indigo-200' : 'text-indigo-500'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm mb-0.5">{suggestion.label}</p>
                                        <p className={`text-xs ${selectedSuggestion === i ? 'text-indigo-200' : 'text-slate-400'}`}>
                                            {suggestion.desc}
                                        </p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${selectedSuggestion === i
                                            ? 'border-white bg-white'
                                            : 'border-slate-300'
                                        }`}>
                                        {selectedSuggestion === i && <Check className="w-3 h-3 text-indigo-600" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Custom Input & Action */}
                    <div className="lg:w-96 space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Or Custom Topic</h3>
                            <div className="relative">
                                <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                                <textarea
                                    placeholder="Describe your carousel topic or campaign goal..."
                                    className="w-full h-32 bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-800 outline-none focus:border-indigo-500 transition-all text-sm resize-none"
                                    value={selectedSuggestion !== null ? '' : topic}
                                    onChange={(e) => {
                                        setSelectedSuggestion(null);
                                        setTopic(e.target.value);
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => onGenerate(topic)}
                            disabled={generating || !topic}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white h-14 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating Plan...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Generate Content Plan
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Results Phase */}
            {content && (
                <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-10">

                    {/* Left: Slides Grid */}
                    <div className="lg:flex-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                                <Sparkles className="w-3 h-3" />
                                AI Generated
                            </div>
                            <span className="text-sm text-slate-400">{content.slides.length} slides</span>
                        </div>

                        <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-6">
                            {content.carousel_title}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {content.slides.map((slide: any) => (
                                <div
                                    key={slide.slide_number}
                                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-7 h-7 bg-indigo-600 text-white text-xs font-bold rounded-lg flex items-center justify-center">
                                            {slide.slide_number}
                                        </span>
                                        <span className="text-xs text-indigo-600 font-medium capitalize bg-indigo-50 px-2 py-0.5 rounded-full">
                                            {slide.type}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-800 leading-snug mb-2">{slide.title}</p>
                                    <p className="text-xs text-slate-500 line-clamp-2">{slide.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="lg:w-80 space-y-4">
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <h4 className="font-semibold text-slate-900 mb-3">Refine Your Plan</h4>
                            <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 p-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="'Make the hook stronger'"
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

                            <button
                                onClick={onConfirm}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2"
                            >
                                Create Carousel
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-xs text-slate-400 text-center">
                            You can refine individual slides in the next step
                        </p>
                    </div>
                </div>
            )}

            {/* Bottom Spacing */}
            <div className="h-6 lg:h-10" />
        </div>
    );
};

export default CampaignPlanner;
