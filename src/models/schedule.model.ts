import mongoose from 'mongoose';
import { ISchedule } from '../types';

const scheduleSchema = new mongoose.Schema<ISchedule & mongoose.Document>(
    {
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        startTime: {
            type: String,
            required: [true, 'Start time is required'],
        },
        endTime: {
            type: String,
            required: [true, 'End time is required'],
        },
        trainer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Trainer is required'],
        },
        trainees: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        maxTrainees: {
            type: Number,
            default: 10,
        },
    },
    {
        timestamps: true,
    }
);

const Schedule = mongoose.model<ISchedule & mongoose.Document>('Schedule', scheduleSchema);

export default Schedule;
