import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getTrainers,
} from '../controllers/user.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, admin, getUsers);
router.get('/trainers', protect, admin, getTrainers);

export default router;