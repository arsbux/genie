import { useState } from 'react';
import BusinessInput from './components/steps/BusinessInput';
import IdentityReview from './components/steps/IdentityReview';
import CampaignPlanner from './components/steps/CampaignPlanner';
import CarouselEditor from './components/steps/CarouselEditor';

// Steps Enum
enum WizardStep {
    INPUT = 1,
    IDENTITY = 2,
    PLANNING = 3,
    CREATIVE = 4
}

function App() {
    const [step, setStep] = useState<WizardStep>(WizardStep.INPUT);

    // Central State
    const [analyzing, setAnalyzing] = useState(false);
    const [generatingStrat, setGeneratingStrat] = useState(false);
    const [generatingImages, setGeneratingImages] = useState(false);

    const [brandResult, setBrandResult] = useState<any>(null);
    const [contentPlan, setContentPlan] = useState<any>(null);
    const [images, setImages] = useState<Record<number, string>>({});

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // Actions
    const handleAnalyze = async (url: string, description: string) => {
        setAnalyzing(true);
        try {
            // Mocking description usage for now as backend update is next
            console.log('Context:', description);

            const response = await fetch(`${API_BASE_URL}/api/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });
            const data = await response.json();
            if (data.success) {
                setBrandResult(data.analysis);
                setStep(WizardStep.IDENTITY);
            }
        } catch (e) {
            console.error(e);
            alert('Analysis failed');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleRefineIdentity = async (feedback: string) => {
        if (!brandResult) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/refine-identity`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_identity: brandResult,
                    feedback
                }),
            });
            const data = await response.json();
            if (data.success) {
                setBrandResult(data.refined_identity);
                alert('Identity Refined!');
            }
        } catch (e) {
            console.error(e);
            alert('Refinement failed');
        }
    };

    const handleRefinePlan = async (feedback: string) => {
        if (!contentPlan) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/refine-plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_plan: contentPlan,
                    feedback
                }),
            });
            const data = await response.json();
            if (data.success) {
                setContentPlan(data.refined_plan);
                alert('Plan Refined!');
            }
        } catch (e) {
            console.error(e);
            alert('Refinement failed');
        }
    };

    const handleRefineImage = async (slideNumber: number, feedback: string) => {
        const slide = contentPlan.slides.find((s: any) => s.slide_number === slideNumber);
        if (!slide || !brandResult) return;

        try {
            let customPrompt = slide.image_generation_prompt;

            // Only call refinement API if it's NOT a simple regeneration request
            if (feedback !== "Regenerate with same prompt") {
                const response = await fetch(`${API_BASE_URL}/api/refine-image-prompt`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        slide,
                        feedback,
                        brand_identity: brandResult.brand_identity
                    }),
                });
                const data = await response.json();
                if (data.success) {
                    customPrompt = data.new_prompt;

                    // Update the prompt in state
                    const updatedSlides = contentPlan.slides.map((s: any) => {
                        if (s.slide_number === slideNumber) {
                            return { ...s, image_generation_prompt: customPrompt };
                        }
                        return s;
                    });
                    setContentPlan({ ...contentPlan, slides: updatedSlides });
                } else {
                    throw new Error('Refinement step failed');
                }
            }

            // Regenerate Image
            setGeneratingImages(true);
            const imgRes = await fetch(`${API_BASE_URL}/api/generate-image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: customPrompt, aspect_ratio: '1:1' }),
            });
            const imgData = await imgRes.json();
            if (imgData.success) {
                setImages(prev => ({ ...prev, [slideNumber]: imgData.image }));
            }
        } catch (e) {
            console.error(e);
            alert('Image generation/refinement failed');
        } finally {
            setGeneratingImages(false);
        }
    };

    const handleGeneratePlan = async (topic: string) => {
        setGeneratingStrat(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/generate-content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    brand_identity: brandResult.brand_identity,
                    topic: topic
                }),
            });
            const data = await response.json();
            if (data.success) {
                setContentPlan(data.content);
            } // Don't auto-advance, let user see plan first
        } catch (e) {
            console.error(e);
            alert('Planning failed');
        } finally {
            setGeneratingStrat(false);
        }
    };

    const handleGenerateImages = async () => {
        setGeneratingImages(true);
        try {
            // Logic from BrandAnalyzer.tsx adapted here
            const imagePromises = contentPlan.slides.map(async (slide: any) => {
                let prompt = slide.image_generation_prompt || '';
                // Fallback prompt logic if missing
                if (!prompt) {
                    prompt = `Instagram carousel slide. Background visual: ${slide.visual_description}. Overlay text: "${slide.title}". Style: ${brandResult.design_recommendation.style}. 8k resolution, highly detailed, photorealistic, masterpiece. No extra text.`;
                }

                const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt, aspect_ratio: '1:1' }),
                });
                const data = await response.json();
                if (data.success) {
                    return { slide_number: slide.slide_number, image: data.image };
                }
                return null;
            });

            const results = await Promise.all(imagePromises);
            const newImages: Record<number, string> = {};
            results.forEach(res => {
                if (res) newImages[res.slide_number] = res.image;
            });
            setImages(prev => ({ ...prev, ...newImages }));

        } catch (e) {
            console.error(e);
            alert('Image generation failed');
        } finally {
            setGeneratingImages(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-slate-50 p-4 md:p-8">

            {/* Header */}
            <header className="max-w-7xl mx-auto pt-6 pb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight order-2 md:order-1">Genie AI</h1>
                <div className="flex items-center gap-3 order-1 md:order-2">
                    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${step >= 4 ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                </div>
            </header>

            <main className="max-w-7xl mx-auto min-h-[600px] flex flex-col justify-center">
                {step === WizardStep.INPUT && (
                    <BusinessInput
                        onAnalyze={handleAnalyze}
                        analyzing={analyzing}
                    />
                )}

                {step === WizardStep.IDENTITY && brandResult && (
                    <IdentityReview
                        result={brandResult}
                        onConfirm={() => setStep(WizardStep.PLANNING)}
                        onRefine={handleRefineIdentity}
                    />
                )}

                {step === WizardStep.PLANNING && brandResult && (
                    <CampaignPlanner
                        brandResult={brandResult}
                        onGenerate={handleGeneratePlan}
                        onRefine={handleRefinePlan}
                        generating={generatingStrat}
                        content={contentPlan}
                        onConfirm={() => {
                            // Trigger image generation on transition to save time? Or let user do it?
                            // Let's let user do it in next step for control
                            setStep(WizardStep.CREATIVE);
                        }}
                    />
                )}

                {step === WizardStep.CREATIVE && contentPlan && (
                    <CarouselEditor
                        content={contentPlan}
                        images={images}
                        onGenerateImages={handleGenerateImages}
                        onRefineImage={handleRefineImage}
                        generatingImages={generatingImages}
                        brandResult={brandResult}
                    />
                )}
            </main>

        </div>
    )
}

export default App
