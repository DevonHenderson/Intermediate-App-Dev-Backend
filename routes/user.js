import express from 'express';
import {
    createUser,
    getAllUsers,
    getUserByID,
    updateUserScore,
    updateUserBestTime
} from '../controllers/user.js';

const router = express.Router();

router.post('/', createUser); // /api/user
router.get('/', getAllUsers); // /api/user
router.get('/:id', getUserByID); // /api/user/1
router.put('/score/:id', updateUserScore); // /api/user/score/1
router.put('/besttime/:id', updateUserBestTime); // /api/user/besttime/1

export default router