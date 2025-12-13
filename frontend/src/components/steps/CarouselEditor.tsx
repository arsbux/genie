import { useState } from 'react';
import { Sparkles, Loader2, Download, ChevronLeft, ChevronRight, ArrowRight, Wand2, DownloadCloud } from 'lucide-react';

interface CarouselEditorProps {
    content: any;
    images: Record<number, string>;
    onGenerateImages: () => Promise<void>;
    onRefineImage: (slideNumber: number, feedback: string) => Promise<void>;
    generatingImages: boolean;
    brandResult: any;
}

const CarouselEditor = ({ content, images, onGenerateImages, onRefineImage, generatingImages }: CarouselEditorProps) => {
    const [activeSlide, setActiveSlide] = useState(1);
    const [editPrompt, setEditPrompt] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const currentSlide = content.slides.find((s: any) => s.slide_number === activeSlide);
    const totalSlides = content.slides.length;
    const hasImage = images[activeSlide];

    const handlePrevSlide = () => {
        if (activeSlide > 1) setActiveSlide(activeSlide - 1);
    };

    const handleNextSlide = () => {
        if (activeSlide < totalSlides) setActiveSlide(activeSlide + 1);
    };

    const handleAIEdit = async () => {
        if (!editPrompt.trim()) return;
        setIsEditing(true);
        await onRefineImage(activeSlide, editPrompt);
        setEditPrompt('');
        setIsEditing(false);
    };

    const handleDownloadCurrent = () => {
        if (!hasImage) return;
        const link = document.createElement('a');
        link.href = images[activeSlide];
        link.download = `slide-${activeSlide}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadAll = () => {
        Object.entries(images).forEach(([num, data]) => {
            const link = document.createElement('a');
            link.href = data;
            link.download = `carousel-slide-${num}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    return (
        <div className="w-full max-w-6xl mx-auto min-h-[calc(100vh-120px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">

            {/* Header */}
            <div className="text-center py-6 lg:py-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">Creative Studio</h2>
                <p className="text-slate-500 text-sm lg:text-base">Edit and perfect your carousel slides</p>
            </div>

            {/* Desktop: Two Column Layout / Mobile: Stack */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-10">

                {/* Left: Image Preview */}
                <div className="lg:flex-1 lg:max-w-xl">
                    {/* Mode Toggle - Mobile Only */}
                    <div className="flex justify-center mb-6 lg:hidden">
                        <div className="bg-slate-100 p-1 rounded-full flex gap-1">
                            <button className="px-5 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-white/50 transition-colors">
                                Manual
                            </button>
                            <button className="px-5 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white shadow-sm">
                                AI Editor
                            </button>
                        </div>
                    </div>

                    {/* Main Image Preview */}
                    <div className="relative bg-gradient-to-br from-indigo-100 to-violet-100 rounded-3xl p-3 lg:p-4 border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/10">
                        {/* Image Container */}
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-white">
                            {hasImage ? (
                                <img
                                    src={images[activeSlide]}
                                    alt={`Slide ${activeSlide}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : generatingImages || isEditing ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                                        <Wand2 className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <p className="mt-4 text-sm text-slate-600 font-medium">
                                        {isEditing ? 'Applying changes...' : 'Generating...'}
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
                                    <Sparkles className="w-12 h-12 text-slate-300 mb-3" />
                                    <p className="text-sm text-slate-400">Click generate to create</p>
                                </div>
                            )}

                            {/* Slide Navigation Overlay */}
                            {hasImage && (
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={handlePrevSlide}
                                            disabled={activeSlide === 1}
                                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/30 transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <div className="flex gap-1.5">
                                            {content.slides.map((s: any) => (
                                                <button
                                                    key={s.slide_number}
                                                    onClick={() => setActiveSlide(s.slide_number)}
                                                    className={`w-2 h-2 rounded-full transition-all ${s.slide_number === activeSlide
                                                            ? 'bg-white w-6'
                                                            : images[s.slide_number] ? 'bg-white/60' : 'bg-white/30'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleNextSlide}
                                            disabled={activeSlide === totalSlides}
                                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/30 transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Download Button - Top Right */}
                        {hasImage && (
                            <button
                                onClick={handleDownloadCurrent}
                                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-700 hover:scale-105 transition-transform"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Right: Controls & Info */}
                <div className="lg:flex-1 lg:max-w-md flex flex-col">

                    {/* Desktop Mode Toggle */}
                    <div className="hidden lg:flex justify-start mb-6">
                        <div className="bg-slate-100 p-1 rounded-full flex gap-1">
                            <button className="px-5 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-white/50 transition-colors">
                                Manual
                            </button>
                            <button className="px-5 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white shadow-sm">
                                AI Editor
                            </button>
                        </div>
                    </div>

                    {/* Slide Thumbnails - Desktop Only */}
                    <div className="hidden lg:grid grid-cols-4 gap-2 mb-6">
                        {content.slides.map((slide: any) => (
                            <button
                                key={slide.slide_number}
                                onClick={() => setActiveSlide(slide.slide_number)}
                                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${slide.slide_number === activeSlide
                                        ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                                        : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                {images[slide.slide_number] ? (
                                    <img src={images[slide.slide_number]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                        <span className="text-xs text-slate-400">{slide.slide_number}</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Slide Info Card */}
                    {currentSlide && (
                        <div className="bg-white rounded-2xl p-4 lg:p-5 border border-slate-100 shadow-sm mb-4 lg:mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full uppercase">
                                    Slide {activeSlide}
                                </span>
                                <span className="text-xs text-slate-400 capitalize">{currentSlide.type}</span>
                            </div>
                            <h4 className="font-semibold text-slate-900 text-sm lg:text-base leading-tight mb-2">{currentSlide.title}</h4>
                            <p className="text-xs lg:text-sm text-slate-500 line-clamp-2">{currentSlide.body}</p>
                        </div>
                    )}

                    {/* AI Edit Input */}
                    <div className="bg-indigo-50/80 rounded-2xl p-4 border border-indigo-100 mb-4 lg:mb-6">
                        <textarea
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="Edit with AI. Tell our AI what you want"
                            className="w-full bg-transparent border-none outline-none resize-none text-slate-700 placeholder:text-indigo-400/70 text-sm min-h-[60px] lg:min-h-[80px]"
                            rows={2}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAIEdit();
                                }
                            }}
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={handleAIEdit}
                                disabled={!editPrompt.trim() || isEditing || !hasImage}
                                className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                            >
                                {isEditing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-auto">
                        <button
                            onClick={onGenerateImages}
                            disabled={generatingImages}
                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {generatingImages ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    {Object.keys(images).length > 0 ? 'Regenerate All' : 'Generate Images'}
                                </>
                            )}
                        </button>

                        {Object.keys(images).length > 0 && (
                            <button
                                onClick={handleDownloadAll}
                                className="px-5 bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <DownloadCloud className="w-4 h-4" />
                                <span className="hidden lg:inline">Download</span> All
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Spacing */}
            <div className="h-6 lg:h-10" />
        </div>
    );
};

export default CarouselEditor;
