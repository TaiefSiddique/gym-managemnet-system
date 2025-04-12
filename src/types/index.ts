export interface IUser {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'trainer' | 'trainee';
}

export interface IUserDocument extends IUser, Document {
    matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface ISchedule {
    date: Date;
    startTime: string;
    endTime: string;
    trainer: mongoose.Schema.Types.ObjectId;
    trainees: mongoose.Schema.Types.ObjectId[];
    maxTrainees: number;
}

import mongoose from 'mongoose';