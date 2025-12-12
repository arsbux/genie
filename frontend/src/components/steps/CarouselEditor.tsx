import { useState } from 'react';
import { Sparkles, Loader2, Download, MessageSquare, RotateCcw } from 'lucide-react';

interface CarouselEditorProps {
    content: any;
    images: Record<number, string>;
    onGenerateImages: () => Promise<void>;
    onRefineImage: (slideNumber: number, feedback: string) => Promise<void>;
    generatingImages: boolean;
    brandResult: any; // For context if needed for regeneration
}

const CarouselEditor = ({ content, images, onGenerateImages, onRefineImage, generatingImages }: CarouselEditorProps) => {
    // State to track refinement inputs per slide
    const [refineInputs, setRefineInputs] = useState<Record<number, string>>({});
    const [refiningSlide, setRefiningSlide] = useState<number | null>(null);

    const handleRefine = async (slideNumber: number) => {
        const feedback = refineInputs[slideNumber];
        if (!feedback) return;

        setRefiningSlide(slideNumber);
        await onRefineImage(slideNumber, feedback);
        setRefiningSlide(null);
        setRefineInputs(prev => ({ ...prev, [slideNumber]: '' }));
    };

    // Auto-generate images on mount if not present could be a good UX, but let's keep it manual for now or trigger automatically in parent.

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 md:px-0">
            <div className="text-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Creative Studio</h2>
                <p className="text-slate-500 text-lg">Review and export your assets. Everything is customizable.</p>
            </div>

            {/* Horizontal Scroll Carousel Preview */}
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 snap-x px-4 md:px-0" style={{ scrollbarWidth: 'none' }}>
                {content.slides.map((slide: any) => (
                    <div key={slide.slide_number} className="flex-shrink-0 w-[85vw] md:w-[400px] bg-white p-5 md:p-6 rounded-3xl shadow-lg border border-slate-100 snap-center relative group">

                        {/* Image Container */}
                        <div className="mb-4 rounded-2xl overflow-hidden border border-slate-100 aspect-square bg-slate-100 relative">
                            {images[slide.slide_number] ? (
                                <>
                                    <img
                                        src={images[slide.slide_number]}
                                        alt={`Slide ${slide.slide_number}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Hover Overlay for Desktop */}
                                    <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-2">
                                        <a
                                            href={images[slide.slide_number]}
                                            download={`slide-${slide.slide_number}.png`}
                                            className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Save
                                        </a>
                                        <button
                                            onClick={() => onRefineImage(slide.slide_number, "Regenerate with same prompt")}
                                            className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-white/30 transition-colors flex items-center gap-2"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Regen
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                    {(refiningSlide === slide.slide_number) ? (
                                        <>
                                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                                            <span className="text-sm font-medium text-indigo-500">Refining...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-8 h-8 opacity-50" />
                                            <span className="text-sm font-medium">Waiting to generate...</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Action Bar */}
                        {images[slide.slide_number] && (
                            <div className="flex md:hidden items-center gap-2 mb-4">
                                <a
                                    href={images[slide.slide_number]}
                                    download={`slide-${slide.slide_number}.png`}
                                    className="flex-1 bg-slate-100 text-slate-900 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Save
                                </a>
                                <button
                                    onClick={() => onRefineImage(slide.slide_number, "Regenerate with same prompt")}
                                    className="flex-1 bg-slate-100 text-slate-900 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Regen
                                </button>
                            </div>
                        )}

                        {/* Slide Content */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">Slide {slide.slide_number}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 mb-2 text-lg leading-tight">{slide.title}</h4>
                            <p className="text-sm text-slate-500 line-clamp-3">{slide.body}</p>
                        </div>

                        {/* Slide-Specific Chat */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                                <MessageSquare className="w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Fix this slide (e.g. 'Remove the text')"
                                    className="bg-transparent border-none outline-none text-slate-700 text-xs w-full placeholder:text-slate-400"
                                    value={refineInputs[slide.slide_number] || ''}
                                    onChange={(e) => setRefineInputs(prev => ({ ...prev, [slide.slide_number]: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleRefine(slide.slide_number)}
                                />
                                {refineInputs[slide.slide_number] && (
                                    <button onClick={() => handleRefine(slide.slide_number)}>
                                        <RotateCcw className="w-3 h-3 text-indigo-500" />
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-center gap-4 px-4 md:px-0">
                <button
                    onClick={onGenerateImages}
                    disabled={generatingImages}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                    {generatingImages ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating Visuals...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 fill-current" />
                            {Object.keys(images).length > 0 ? 'Regenerate All Images' : 'Generate Images'}
                        </>
                    )}
                </button>

                {Object.keys(images).length > 0 && (
                    <button
                        onClick={() => {
                            Object.entries(images).forEach(([num, data]) => {
                                const link = document.createElement('a');
                                link.href = data; // use directly as it's full data URI now
                                link.download = `carousel-slide-${num}.png`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            });
                        }}
                        className="bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-3 w-full md:w-auto"
                    >
                        <Download className="w-5 h-5" />
                        Download All
                    </button>
                )}
            </div>

        </div>
    );
};

export default CarouselEditor;
