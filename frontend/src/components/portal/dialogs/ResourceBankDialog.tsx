import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search,
    Video,
    FileText,
    MousePointer2,
    Palette,
    Image as ImageIcon,
    HardDrive,
    MessageSquare,
    Plus,
    ExternalLink,
    GraduationCap,
    Sparkles,
    Youtube
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RecommendedResource {
    id: string;
    title: string;
    description: string;
    url: string;
    type: 'video' | 'link' | 'tool' | 'asset' | 'storage' | 'ai';
    category: string;
    source: string;
    isPopular?: boolean;
}

const RECOMMENDED_RESOURCES: RecommendedResource[] = [
    // 1. VIDEOS (Primary)
    {
        id: "v1",
        title: "React Setup with Vite",
        description: "The modern way to build React apps. Fast, minimal, and practice-ready.",
        url: "https://www.youtube.com/results?search_query=react+vite+setup+traversy",
        type: 'video',
        category: "Videos",
        source: "Traversy Media",
        isPopular: true
    },
    {
        id: "v2",
        title: "Building Components (The 'Doing' Way)",
        description: "Quick guide to reusable UI components without heavy theory.",
        url: "https://www.youtube.com/results?search_query=react+components+net+ninja",
        type: 'video',
        category: "Videos",
        source: "Net Ninja"
    },
    {
        id: "v3",
        title: "React Hooks explained in 100 Seconds",
        description: "Ultra-fast breakdown of useState and useEffect for real apps.",
        url: "https://www.youtube.com/watch?v=TNhaISOUy6Q",
        type: 'video',
        category: "Videos",
        source: "Fireship",
        isPopular: true
    },

    // 2. DOCUMENTATION (Support)
    {
        id: "d1",
        title: "Official React Docs",
        description: "Use for reference: specifically the Hooks API and Components section.",
        url: "https://react.dev",
        type: 'link',
        category: "Documentation",
        source: "Official"
    },
    {
        id: "d2",
        title: "Vite Guide",
        description: "Read for: Configuration and asset handling basics.",
        url: "https://vitejs.dev",
        type: 'link',
        category: "Documentation",
        source: "Official"
    },

    // 3. PLAYGROUNDS
    {
        id: "p1",
        title: "CodeSandbox",
        description: "Instant cloud development environment for quick component testing.",
        url: "https://codesandbox.io",
        type: 'tool',
        category: "Playgrounds",
        source: "Online Tool"
    },
    {
        id: "p2",
        title: "StackBlitz",
        description: "Run fullstack Node.js environments directly in your browser.",
        url: "https://stackblitz.io",
        type: 'tool',
        category: "Playgrounds",
        source: "Online Tool"
    },

    // 4. DESIGN & UI
    {
        id: "ui1",
        title: "Tailwind CSS Docs",
        description: "Essential for rapid styling without writing custom CSS.",
        url: "https://tailwindcss.com",
        type: 'link',
        category: "Design",
        source: "Official"
    },
    {
        id: "ui2",
        title: "shadcn/ui Components",
        description: "Beautifully designed components you can copy/paste.",
        url: "https://ui.shadcn.com",
        type: 'link',
        category: "Design",
        source: "Official",
        isPopular: true
    },

    // 5. ICONS & ASSETS
    {
        id: "a1",
        title: "Lucide Icons",
        description: "Clean, consistent icons for your React applications.",
        url: "https://lucide.dev",
        type: 'asset',
        category: "Assets",
        source: "Library"
    },
    {
        id: "a2",
        title: "Unsplash Photos",
        description: "High-quality, free images for project thumbnails and content.",
        url: "https://unsplash.com",
        type: 'asset',
        category: "Assets",
        source: "Free Stock"
    },

    // 6. STORAGE
    {
        id: "s1",
        title: "Cloudinary (Media Management)",
        description: "Upload and optimize images, videos, and PDFs easily.",
        url: "https://cloudinary.com",
        type: 'storage',
        category: "Storage",
        source: "Media Cloud"
    },
    {
        id: "s2",
        title: "Google Drive Links",
        description: "Use for shared documents, sheets, and large reference files.",
        url: "https://drive.google.com",
        type: 'storage',
        category: "Storage",
        source: "Google"
    },

    // 7. AI PROMPTS
    {
        id: "ai1",
        title: "Explain React Error Simply",
        description: "Prompt: 'Explain this React error to a beginner and show how to fix it: [error]'",
        url: "#",
        type: 'ai',
        category: "AI Hints",
        source: "Learning Tool"
    },
    {
        id: "ai2",
        title: "Suggest UI Improvements",
        description: "Prompt: 'Analyze this component and suggest 3 ways to make it more professional: [code]'",
        url: "#",
        type: 'ai',
        category: "AI Hints",
        source: "Learning Tool"
    }
];

interface ResourceBankDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect?: (resource: RecommendedResource) => void;
}

export function ResourceBankDialog({ open, onOpenChange, onSelect }: ResourceBankDialogProps) {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const filtered = RECOMMENDED_RESOURCES.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.description.toLowerCase().includes(search.toLowerCase());
        const matchesTab = activeTab === "all" || r.category.toLowerCase() === activeTab.toLowerCase();
        return matchesSearch && matchesTab;
    });

    const categories = ["all", ...new Set(RECOMMENDED_RESOURCES.map(r => r.category))];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden border-accent/20 bg-background/95 backdrop-blur-xl">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <DialogTitle className="text-2xl font-bold font-heading flex items-center gap-2">
                                <GraduationCap className="w-6 h-6 text-accent" />
                                Practice-First Resource Bank
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Ready-to-use learning materials grouped by practical needs.
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search components, tutorials, or tools..."
                            className="pl-9 h-11 bg-accent/5 border-accent/10 rounded-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </DialogHeader>

                <div className="flex-1 flex flex-col p-6 pt-2 overflow-hidden">
                    <Tabs defaultValue="all" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
                        <TabsList className="bg-muted/30 p-1 mb-4 h-auto flex flex-wrap justify-start gap-1 overflow-x-auto no-scrollbar">
                            {categories.map(cat => (
                                <TabsTrigger
                                    key={cat}
                                    value={cat.toLowerCase()}
                                    className="rounded-lg data-[state=active]:bg-background px-4 py-2 text-xs font-bold uppercase tracking-tight"
                                >
                                    {cat === "all" ? "All Tracks" : cat}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <ScrollArea className="flex-1 pr-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                                <AnimatePresence mode="popLayout">
                                    {filtered.map((resource) => (
                                        <motion.div
                                            key={resource.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="group relative p-4 rounded-2xl bg-muted/20 border border-accent/5 hover:border-accent/20 hover:bg-accent/5 transition-all cursor-default">
                                                {resource.isPopular && (
                                                    <Badge className="absolute -top-2 -right-1 bg-gold text-black border-none text-[8px] font-bold h-4">
                                                        <Sparkles className="w-2 h-2 mr-1" /> RECOMMENDATION
                                                    </Badge>
                                                )}

                                                <div className="flex items-start gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${resource.type === 'video' ? 'bg-red-500/10 text-red-500' :
                                                            resource.type === 'link' ? 'bg-blue-500/10 text-blue-500' :
                                                                resource.type === 'tool' ? 'bg-emerald-500/10 text-emerald-500' :
                                                                    resource.type === 'asset' ? 'bg-purple-500/10 text-purple-500' :
                                                                        resource.type === 'ai' ? 'bg-amber-500/10 text-amber-500' :
                                                                            'bg-accent/10 text-accent'
                                                        }`}>
                                                        {resource.type === 'video' && <Video className="w-5 h-5" />}
                                                        {resource.type === 'link' && <FileText className="w-5 h-5" />}
                                                        {resource.type === 'tool' && <MousePointer2 className="w-5 h-5" />}
                                                        {resource.type === 'asset' && <Palette className="w-5 h-5" />}
                                                        {resource.type === 'storage' && <HardDrive className="w-5 h-5" />}
                                                        {resource.type === 'ai' && <MessageSquare className="w-5 h-5" />}
                                                    </div>

                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-bold text-sm leading-none group-hover:text-accent transition-colors">
                                                                {resource.title}
                                                            </h4>
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{resource.source}</span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                                            {resource.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 text-[10px] font-bold flex-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => window.open(resource.url, '_blank')}
                                                    >
                                                        <ExternalLink className="w-3 h-3 mr-1" /> Explore
                                                    </Button>
                                                    <Button
                                                        variant="gold"
                                                        size="sm"
                                                        className="h-7 text-[10px] font-bold gap-1"
                                                        onClick={() => onSelect?.(resource)}
                                                    >
                                                        <Plus className="w-3 h-3" /> Add to Lesson
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {filtered.length === 0 && (
                                <div className="py-20 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-accent/5 flex items-center justify-center mx-auto">
                                        <Search className="w-8 h-8 text-accent/20" />
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">No practice resources found for your search.</p>
                                </div>
                            )}
                        </ScrollArea>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
