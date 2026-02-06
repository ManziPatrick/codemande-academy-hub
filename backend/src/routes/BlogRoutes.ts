import express from 'express';
import {
    getBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    addComment
} from '../controllers/BlogController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.post('/:id/like', requireAuth, likeBlog);
router.post('/:id/comment', requireAuth, addComment);

export default router;
