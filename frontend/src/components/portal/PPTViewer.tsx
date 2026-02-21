import React, { useState, useEffect } from "react";
import { Loader2, Download, Maximize2, Minimize2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PPTViewerProps {
    url: string;
    title?: string;
    className?: string;
}

export function PPTViewer({ url, title, className }: PPTViewerProps) {
    const [loading, setLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Validate URL and set error if invalid/missing
    useEffect(() => {
        if (!url) {
            setError("No presentation URL provided");
            setLoading(false);
        } else {
            setError(null);
            setLoading(true);
        }
    }, [url]);

    // Microsoft Office Viewer URL
    // Optimized for both .ppt and .pptx
    const viewerUrl = url ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}&wdAr=1.7777777777777777` : '';

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <Card className={`group relative overflow-hidden bg-[#0a0a0a] flex flex-col shadow-2xl transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[100] rounded-none' : 'w-full aspect-video rounded-3xl border-white/5'} ${className}`}>

            {/* Minimal Floating Controls */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {url && (
                    <Button variant="ghost" size="icon" className="h-9 w-9 bg-black/50 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/70 rounded-xl" asChild>
                        <a href={url} target="_blank" rel="noopener noreferrer" download title="Download Presentation">
                            <Download className="w-4 h-4" />
                        </a>
                    </Button>
                )}
                <Button variant="ghost" size="icon" className="h-9 w-9 bg-black/50 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/70 rounded-xl" onClick={toggleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Maximize"}>
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
            </div>

            {/* Viewer Iframe */}
            <div className="relative flex-1 bg-white overflow-hidden">
                {loading && !error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-20">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-2 border-gold/10 border-t-gold animate-spin" />
                            <Loader2 className="w-6 h-6 text-gold animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <p className="mt-4 text-white/30 font-black text-[9px] uppercase tracking-[0.3em] animate-pulse">Loading Presentation</p>
                    </div>
                )}

                {error ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-30 p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-destructive/50 mb-4" />
                        <h3 className="text-white font-bold mb-2">Presentation Unavailable</h3>
                        <p className="text-white/40 text-xs max-w-xs">{error}</p>
                    </div>
                ) : url ? (
                    <iframe
                        src={viewerUrl}
                        className="w-full h-full border-none z-10 relative"
                        onLoad={() => setLoading(false)}
                        title={title || "PPT Viewer"}
                        allowFullScreen
                    />
                ) : null}
            </div>
        </Card>
    );
}
