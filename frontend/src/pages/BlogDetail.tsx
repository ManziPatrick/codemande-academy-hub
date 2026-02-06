import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar, User, Tag, Heart, MessageSquare, ArrowLeft, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";

interface IComment {
    user: string;
    userName: string;
    content: string;
    createdAt: string;
}

interface IBlog {
    _id: string;
    title: string;
    slug: string;
    content: string;
    authorName: string;
    category: string;
    image: string;
    tags: string[];
    likes: string[];
    comments: IComment[];
    createdAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/graphql', '') || 'http://localhost:4000';

const BlogDetail = () => {
    const { slug } = useParams();
    const { user } = useAuth();
    const [blog, setBlog] = useState<IBlog | null>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        fetchBlog();
    }, [slug]);

    useEffect(() => {
        if (blog && user) {
            setLiked(blog.likes.includes(user.id || (user as any)._id));
        }
    }, [blog, user]);

    const fetchBlog = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/blogs/${slug}`);
            if (!response.ok) throw new Error("Blog not found");
            const data = await response.json();
            setBlog(data);
        } catch (error) {
            console.error("Error fetching blog:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!user) return alert("Please login to like this post");
        if (!blog) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/blogs/${blog._id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ userId: user.id || (user as any)._id })
            });
            const updatedBlog = await response.json();
            setBlog(updatedBlog);
        } catch (error) {
            console.error("Error liking blog:", error);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert("Please login to comment");
        if (!comment.trim() || !blog) return;

        setSubmittingComment(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/blogs/${blog._id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    content: comment,
                    userName: user.username || user.name || "Anonymous",
                    userId: user.id || (user as any)._id
                })
            });
            const updatedBlog = await response.json();
            setBlog(updatedBlog);
            setComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-accent" />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
                <Link to="/blog">
                    <Button variant="gold">Back to Blog</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>{blog.title} | CODEMANDE Blog</title>
                <meta name="description" content={blog.content.substring(0, 160)} />
            </Helmet>
            <Header />
            <main className="pt-28 pb-20">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <Link to="/blog" className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-8 hover:gap-3 transition-all">
                            <ArrowLeft className="w-4 h-4" /> Back to Articles
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full uppercase">
                                    {blog.category}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                    {Math.ceil(blog.content.length / 500)} min read
                                </span>
                            </div>

                            <h1 className="font-heading text-3xl lg:text-5xl font-bold leading-tight">
                                {blog.title}
                            </h1>

                            <div className="flex items-center gap-6 py-4 border-y border-border/50 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                                        <User className="w-4 h-4 text-accent" />
                                    </div>
                                    <span className="font-medium text-foreground">{blog.authorName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl">
                                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none pt-8 text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans">
                                {blog.content}
                            </div>

                            <div className="flex flex-wrap gap-2 pt-10">
                                {blog.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-muted rounded-full text-xs hover:bg-accent/10 hover:text-accent transition-colors cursor-pointer">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Interaction Section */}
                            <div className="flex items-center gap-6 py-10 border-t border-border/50">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${liked ? "bg-accent/10 border-accent text-accent" : "border-border hover:bg-muted"
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                                    <span className="font-bold">{blog.likes.length}</span>
                                </button>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MessageSquare className="w-5 h-5" />
                                    <span className="font-bold">{blog.comments.length}</span>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <section className="space-y-10 pt-10">
                                <h3 className="font-heading text-2xl font-bold">Comments ({blog.comments.length})</h3>

                                {user ? (
                                    <form onSubmit={handleComment} className="space-y-4 bg-card p-6 rounded-xl border border-border/50">
                                        <p className="text-sm font-medium">Leave a comment as <span className="text-accent">{user.username || user.name}</span></p>
                                        <Textarea
                                            placeholder="Share your thoughts..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="min-h-[120px] bg-background border-border focus:ring-accent"
                                        />
                                        <Button
                                            type="submit"
                                            variant="gold"
                                            disabled={submittingComment || !comment.trim()}
                                            className="w-full sm:w-auto"
                                        >
                                            {submittingComment ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Posting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" /> Post Comment
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                ) : (
                                    <div className="bg-muted p-6 rounded-xl text-center border border-dashed border-border">
                                        <p className="text-muted-foreground mb-4">You must be logged in to join the conversation.</p>
                                        <Link to="/auth">
                                            <Button variant="outline">Log In to Comment</Button>
                                        </Link>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {blog.comments.map((comment, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            key={idx}
                                            className="flex gap-4 p-6 bg-card rounded-xl border border-border/30"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-accent/20 flex-shrink-0 flex items-center justify-center">
                                                <User className="w-6 h-6 text-accent" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-foreground">{comment.userName}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                    {comment.content}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {blog.comments.length === 0 && (
                                        <p className="text-center text-muted-foreground py-10">No comments yet. Be the first to share your thoughts!</p>
                                    )}
                                </div>
                            </section>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BlogDetail;
