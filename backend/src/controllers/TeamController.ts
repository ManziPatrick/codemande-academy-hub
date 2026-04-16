import { Request, Response } from 'express';
import TeamMember from '../models/TeamMember';

export const getTeamMembers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [members, totalCount] = await Promise.all([
            TeamMember.find().sort({ createdAt: 1 }).skip(skip).limit(limit),
            TeamMember.countDocuments()
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            members,
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                pageSize: limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createTeamMember = async (req: Request, res: Response) => {
    try {
        const member = new TeamMember(req.body);
        await member.save();
        res.status(201).json(member);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTeamMember = async (req: Request, res: Response) => {
    try {
        const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!member) return res.status(404).json({ message: 'Team member not found' });
        res.json(member);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
    try {
        const member = await TeamMember.findByIdAndDelete(req.params.id);
        if (!member) return res.status(404).json({ message: 'Team member not found' });
        res.json({ message: 'Team member deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
