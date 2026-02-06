import { Request, Response } from 'express';
import TeamMember from '../models/TeamMember';

export const getTeamMembers = async (req: Request, res: Response) => {
    try {
        const members = await TeamMember.find().sort({ createdAt: 1 });
        res.json(members);
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
