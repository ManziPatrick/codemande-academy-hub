import { Request, Response } from 'express';
import Blog from '../models/Blog';
import slugify from 'slugify';

export const getBlogs = async (req: Request, res: Response) => {
    try {
        const { category, search } = req.query;
        let query: any = {};

        if (category) query.category = category;
        if (search) {
            query.$text = { $search: search as string };
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find(query)
            .populate('category')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Blog.countDocuments(query);

        res.json({
            blogs,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug }).populate('category');
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createBlog = async (req: Request, res: Response) => {
    try {
        const { title, content, category, tags, image, authorName } = req.body;
        const slug = slugify(title, { lower: true, strict: true });

        const blog = new Blog({
            title,
            slug,
            content,
            category,
            tags,
            image,
            author: (req as any).user?._id || req.body.authorId, // Support both auth and direct ID for testing
            authorName
        });

        await blog.save();
        res.status(201).json(blog);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateBlog = async (req: Request, res: Response) => {
    try {
        const { title } = req.body;
        if (title) {
            req.body.slug = slugify(title, { lower: true, strict: true });
        }

        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteBlog = async (req: Request, res: Response) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json({ message: 'Blog deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const likeBlog = async (req: Request, res: Response) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const userId = (req as any).user?._id || req.body.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required to like' });
        }

        const userIdStr = userId.toString();
        const likeIndex = blog.likes.findIndex(id => id.toString() === userIdStr);

        if (likeIndex === -1) {
            blog.likes.push(userId as any);
        } else {
            blog.likes.splice(likeIndex, 1);
        }

        await blog.save();
        res.json(blog);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const addComment = async (req: Request, res: Response) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const { content, userName } = req.body;
        const userId = (req as any).user?._id || req.body.userId;

        blog.comments.push({
            user: userId,
            userName,
            content,
            createdAt: new Date()
        } as any);

        await blog.save();
        res.json(blog);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
