import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import AppError from '../utils/error';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

interface JwtPayload {
    id: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('Not authorized, no token', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        req.user = user;
        next();
    } catch (error) {
        next(new AppError('Not authorized, token failed', 401));
    }
};

export const admin = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        next(new AppError('Not authorized as an admin', 403));
    }
};

export const trainer = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user && (req.user.role === 'trainer' || req.user.role === 'admin')) {
        next();
    } else {
        next(new AppError('Not authorized as a trainer', 403));
    }
};