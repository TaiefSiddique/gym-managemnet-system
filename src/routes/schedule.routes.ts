import express from 'express';
import {
    createSchedule,
    getSchedules,
    getSchedulesByDate,
    bookSchedule,
    cancelBooking,
} from '../controllers/schedule.controller';
import { protect, admin, trainer } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', protect, admin, createSchedule);
router.get('/', protect, getSchedules);
router.get('/date/:date', protect, getSchedulesByDate);
router.post('/:id/book', protect, bookSchedule);
router.delete('/:id/book', protect, cancelBooking);

export default router;
