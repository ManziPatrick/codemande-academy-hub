import { Request, Response } from 'express';
import AICourse from '../models/AICourse';

export const getAICourses = async (req: Request, res: Response) => {
    try {
        const courses = await AICourse.find().populate('instructor', 'username').sort({ createdAt: 1 });
        res.json(courses);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAICourseBySlug = async (req: Request, res: Response) => {
    try {
        const course = await AICourse.findOne({ slug: req.params.slug }).populate('instructor', 'username');
        if (!course) {
            return res.status(404).json({ message: 'AI Course not found' });
        }
        res.json(course);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
