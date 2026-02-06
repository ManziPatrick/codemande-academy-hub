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

const router = express.Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.post('/:id/like', likeBlog);
router.post('/:id/comment', addComment);

export default router;
