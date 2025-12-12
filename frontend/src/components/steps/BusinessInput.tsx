import { useState } from 'react';
import { ArrowRight, Loader2, Link as LinkIcon, FileText } from 'lucide-react';

interface BusinessInputProps {
    onAnalyze: (url: string, description: string) => Promise<void>;
    analyzing: boolean;
}

const BusinessInput = ({ onAnalyze, analyzing }: BusinessInputProps) => {
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        if (url) {
            onAnalyze(url, description);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 md:px-0">
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Tell us about your business</h2>
                <p className="text-slate-500 text-lg">We'll analyze your brand to create the perfect strategy.</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">

                {/* URL Input */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        Website URL
                    </label>
                    <input
                        type="url"
                        placeholder="https://www.yourbusiness.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Additional Context (Optional)
                    </label>
                    <textarea
                        placeholder="Tell us about your target audience, specific goals, or brand voice..."
                        className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* File Upload Placeholder */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 bg-slate-50/50">
                    <p className="text-sm">Drag & drop files here (Coming Soon)</p>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={analyzing || !url}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white h-14 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {analyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                Analyze Business
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default BusinessInput;
