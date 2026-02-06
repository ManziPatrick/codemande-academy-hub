import { Request, Response } from 'express';
import BlogCategory from '../models/BlogCategory';
import slugify from 'slugify';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await BlogCategory.find().sort({ name: 1 });
        res.json(categories);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const slug = slugify(name, { lower: true, strict: true });

        const category = new BlogCategory({
            name,
            slug,
            description
        });

        await category.save();
        res.status(201).json(category);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (name) {
            req.body.slug = slugify(name, { lower: true, strict: true });
        }

        const category = await BlogCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const category = await BlogCategory.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
