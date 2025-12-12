import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Palette, Type, Target, Eye, FileText, Layers } from 'lucide-react';

interface AnalysisResult {
    brand_identity: {
        colors: {
            primary: string;
            secondary: string;
            accent: string;
            background: string;
        };
        fonts: {
            heading: string;
            body: string;
        };
        tone: string;
        audience: string;
        industry: string;
    };
    design_recommendation: {
        style: string;
        description: string;
    };
}

interface ContentResult {
    carousel_title: string;
    slides: {
        slide_number: number;
        type: string;
        title: string;
        body: string;
        visual_description: string;
    }[];
}

const BrandAnalyzer = () => {
    const [url, setUrl] = useState('');
    const [topic, setTopic] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [content, setContent] = useState<ContentResult | null>(null);
    const [error, setError] = useState('');

    const [images, setImages] = useState<Record<number, string>>({});
    const [generatingImages, setGeneratingImages] = useState(false);

    const handleAnalyze = async () => {
        if (!url) return;

        setAnalyzing(true);
        setError('');
        setContent(null);
        setImages({});

        try {
            const response = await fetch('http://localhost:3000/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Analysis failed');
            }

            setResult(data.analysis);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleGenerateContent = async () => {
        if (!result) return;

        setGenerating(true);
        setError('');
        setImages({});

        try {
            const response = await fetch('http://localhost:3000/api/generate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    brand_identity: result.brand_identity,
                    topic: topic
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Content generation failed');
            }

            setContent(data.content);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleGenerateImages = async () => {
        if (!content || !result) return;

        setGeneratingImages(true);
        setError('');

        try {
            const imagePromises = content.slides.map(async (slide: any) => {
                let prompt = '';

                if (slide.image_generation_prompt) {
                    prompt = slide.image_generation_prompt;
                } else {
                    // Fallback if the backend model didn't return the new field yet
                    prompt = `
                        Instagram carousel slide background. 
                        Visual concept: ${slide.visual_description}. 
                        Style: ${result.design_recommendation.style}.
                        Overlay Text: "${slide.title}".
                        Typography: Modern, bold, sans-serif.
                        High quality, photorealistic or premium vector art.
                        Do not include any other text, color codes, or UI elements.
                    `.trim();
                }

                console.log(`Generating image for slide ${slide.slide_number} with prompt:`, prompt);

                const response = await fetch('http://localhost:3000/api/generate-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt,
                        aspect_ratio: '1:1'
                    }),
                });

                const data = await response.json();
                if (data.success && data.image) {
                    return { slide_number: slide.slide_number, image: data.image };
                }
                return null;
            });

            const results = await Promise.all(imagePromises);

            const newImages: Record<number, string> = {};
            results.forEach(res => {
                if (res) {
                    newImages[res.slide_number] = res.image;
                }
            });

            setImages(prev => ({ ...prev, ...newImages }));

        } catch (err: any) {
            setError('Failed to generate images: ' + err.message);
        } finally {
            setGeneratingImages(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Input Section */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 p-2 rounded-2xl shadow-2xl flex items-center gap-2 ring-1 ring-slate-900/5">
                <div className="pl-4 text-slate-400">
                    <Sparkles className="w-5 h-5" />
                </div>
                <input
                    type="url"
                    placeholder="Enter website URL (e.g. https://www.apple.com)"
                    className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 h-14 text-lg"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <button
                    onClick={handleAnalyze}
                    disabled={analyzing || !url}
                    className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-8 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {analyzing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
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

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    {error}
                </div>
            )}

            {/* Results Section */}
            {result && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Brand Colors */}
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
                                <Palette className="w-5 h-5 text-indigo-500" />
                                <h3>Brand Colors</h3>
                            </div>
                            <div className="flex gap-4">
                                {Object.entries(result.brand_identity.colors).map(([name, hex]) => (
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
                                <p className="text-xl text-white/90 leading-relaxed font-light">
                                    {result.design_recommendation.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Generate Content Section */}
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-2xl">
                            <FileText className="w-8 h-8 text-indigo-600" />
                            <h3>Create Campaign Content</h3>
                        </div>

                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Campaign Topic (e.g. 'Launch of our new summer collection' or leave empty for AI suggestion)"
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                            <button
                                onClick={handleGenerateContent}
                                disabled={generating}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {generating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Generating Strategy...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Generate Slides
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Content Results */}
                    {content && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-slate-900 font-bold text-2xl">
                                <Layers className="w-8 h-8 text-indigo-600" />
                                <h3>Generated Carousel Plan: <span className="text-indigo-600">{content.carousel_title}</span></h3>
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-8 snap-x">
                                {content.slides.map((slide) => (
                                    <div key={slide.slide_number} className="flex-shrink-0 w-80 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow snap-start">
                                        {images[slide.slide_number] && (
                                            <div className="mb-4 rounded-lg overflow-hidden border border-slate-100 aspect-square bg-slate-100 relative group">
                                                <img
                                                    src={images[slide.slide_number]}
                                                    alt="Generated Visual"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <a
                                                        href={`data:image/png;base64,${images[slide.slide_number]}`}
                                                        download={`slide-${slide.slide_number}.png`}
                                                        className="bg-white text-slate-900 px-4 py-2 rounded-full font-medium text-sm hover:scale-105 transition-transform"
                                                    >
                                                        Download
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">Slide {slide.slide_number}</span>
                                            <span className="text-xs text-indigo-500 font-medium capitalize">{slide.type}</span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 mb-2 text-sm leading-tight">{slide.title}</h4>
                                        <p className="text-xs text-slate-500 mb-4 line-clamp-3">{slide.body}</p>
                                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                            <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Visual Concept</p>
                                            <p className="text-xs text-slate-600 italic leading-snug">{slide.visual_description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center gap-4 pt-4">
                                <button
                                    onClick={handleGenerateImages}
                                    disabled={generatingImages}
                                    className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {generatingImages ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating Visuals...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 fill-current" />
                                            Generate Images
                                        </>
                                    )}
                                </button>

                                {Object.keys(images).length > 0 && (
                                    <button
                                        onClick={() => {
                                            Object.entries(images).forEach(([num, data]) => {
                                                const link = document.createElement('a');
                                                link.href = `data:image/png;base64,${data}`;
                                                link.download = `carousel-slide-${num}.png`;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            });
                                        }}
                                        className="bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-3"
                                    >
                                        Download All
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BrandAnalyzer;
