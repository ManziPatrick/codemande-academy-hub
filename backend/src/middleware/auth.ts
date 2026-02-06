import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(); // Proceed without user
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        (req as any).user = decoded;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        next(); // Proceed without user even on error
    }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user) {
        return res.status(401).json({ message: 'Unauthorized: Authentication required' });
    }
    next();
};
