import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import generateToken from '../utils/generateToken';
import AppError from '../utils/error';
import { Types } from 'mongoose';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return next(new AppError('User already exists', 400));
        }

        if ((role === 'admin' || role === 'trainer') && (!req.user || req.user.role !== 'admin')) {
            return next(new AppError('Not authorized to create this role', 403));
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'trainee',
        });

        if (user) {
            res.status(201).json({
                success: true,
                statusCode: 201,
                message: 'User registered successfully',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken((user._id as Types.ObjectId).toString()),
                },
            });
        } else {
            return next(new AppError('Invalid user data', 400));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new AppError('Invalid email or password', 401));
        }


        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(new AppError('Invalid email or password', 401));
        }


        res.json({
            success: true,
            statusCode: 200,
            message: 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken((user._id as Types.ObjectId).toString()),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                success: true,
                statusCode: 200,
                message: 'User profile retrieved successfully',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } else {
            return next(new AppError('User not found', 404));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                statusCode: 200,
                message: 'User profile updated successfully',
                data: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    token: generateToken((updatedUser._id as Types.ObjectId).toString()),
                },
            });
        } else {
            return next(new AppError('User not found', 404));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({});
        res.json({
            success: true,
            statusCode: 200,
            message: 'Users retrieved successfully',
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get trainers
// @route   GET /api/users/trainers
// @access  Private/Admin
export const getTrainers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const trainers = await User.find({ role: 'trainer' });
        res.json({
            success: true,
            statusCode: 200,
            message: 'Trainers retrieved successfully',
            data: trainers,
        });
    } catch (error) {
        next(error);
    }
};