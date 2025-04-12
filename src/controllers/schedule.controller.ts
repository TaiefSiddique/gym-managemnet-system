import { Request, Response, NextFunction } from 'express';
import Schedule from '../models/schedule.model';
import User from '../models/user.model';
import AppError from '../utils/error';
import mongoose from 'mongoose';

// @desc    Create a schedule
// @route   POST /api/schedules
// @access  Private/Admin
export const createSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { date, startTime, endTime, trainerId } = req.body;

        const scheduleDate = new Date(date);
        scheduleDate.setHours(0, 0, 0, 0);

        const trainer = await User.findById(trainerId);
        if (!trainer || trainer.role !== 'trainer') {
            return next(new AppError('Trainer not found or user is not a trainer', 404));
        }

        const existingSchedulesCount = await Schedule.countDocuments({
            date: {
                $gte: scheduleDate,
                $lt: new Date(scheduleDate.getTime() + 24 * 60 * 60 * 1000),
            },
        });

        if (existingSchedulesCount >= 5) {
            return next(
                new AppError('Maximum limit of 5 schedules per day has been reached', 400)
            );
        }

        const schedule = await Schedule.create({
            date: scheduleDate,
            startTime,
            endTime,
            trainer: trainerId,
            trainees: [],
        });

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Schedule created successfully',
            data: schedule,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all schedules
// @route   GET /api/schedules
// @access  Private
export const getSchedules = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let schedules;

        if (req.user.role === 'trainer') {
            schedules = await Schedule.find({ trainer: req.user._id })
                .populate('trainer', 'name email')
                .populate('trainees', 'name email');
        } else {
            schedules = await Schedule.find({})
                .populate('trainer', 'name email')
                .populate('trainees', 'name email');
        }

        res.json({
            success: true,
            statusCode: 200,
            message: 'Schedules retrieved successfully',
            data: schedules,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get schedules by date
// @route   GET /api/schedules/date/:date
// @access  Private
export const getSchedulesByDate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dateParam = req.params.date;
        const date = new Date(dateParam);
        date.setHours(0, 0, 0, 0);

        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);

        let schedules;

        if (req.user.role === 'trainer') {
            schedules = await Schedule.find({
                trainer: req.user._id,
                date: {
                    $gte: date,
                    $lt: nextDay,
                },
            })
                .populate('trainer', 'name email')
                .populate('trainees', 'name email');
        } else {
            schedules = await Schedule.find({
                date: {
                    $gte: date,
                    $lt: nextDay,
                },
            })
                .populate('trainer', 'name email')
                .populate('trainees', 'name email');
        }

        res.json({
            success: true,
            statusCode: 200,
            message: 'Schedules retrieved successfully',
            data: schedules,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Book a schedule
// @route   POST /api/schedules/:id/book
// @access  Private/Trainee
export const bookSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scheduleId = req.params.id;

        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) {
            return next(new AppError('Schedule not found', 404));
        }

        if (schedule.trainees.includes(req.user._id)) {
            return next(new AppError('You have already booked this class', 400));
        }

        if (schedule.trainees.length >= schedule.maxTrainees) {
            return next(
                new AppError('Class schedule is full. Maximum 10 trainees allowed per schedule.', 400)
            );
        }

        const date = new Date(schedule.date);
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);

        const overlappingSchedules = await Schedule.find({
            date: {
                $gte: date,
                $lt: nextDay,
            },
            startTime: schedule.startTime,
            trainees: req.user._id,
        });

        if (overlappingSchedules.length > 0) {
            return next(
                new AppError('You already have a booking at this time slot', 400)
            );
        }

        schedule.trainees.push(req.user._id);
        await schedule.save();

        res.json({
            success: true,
            statusCode: 201,
            message: 'Class booked successfully',
            data: schedule,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel a booking
// @route   DELETE /api/schedules/:id/book
// @access  Private/Trainee
export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scheduleId = req.params.id;

        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) {
            return next(new AppError('Schedule not found', 404));
        }

        if (!schedule.trainees.includes(req.user._id)) {
            return next(new AppError('You have not booked this class', 400));
        }

        schedule.trainees = schedule.trainees.filter(
            (traineeId) => traineeId.toString() !== req.user._id.toString()
        );
        await schedule.save();

        res.json({
            success: true,
            statusCode: 200,
            message: 'Booking cancelled successfully',
            data: schedule,
        });
    } catch (error) {
        next(error);
    }
};