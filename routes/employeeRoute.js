import express from 'express';
import multer from 'multer';
import { getProfile, getProfileFile, updateProfile } from '../controllers/employeeController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/profile', verifyToken, getProfile);
router.get('/profile/:fileId', getProfileFile);
router.put('/update_profile', verifyToken, upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'bankImage', maxCount: 1 },
    { name: 'aadharImage', maxCount: 1 },
    { name: 'panImage', maxCount: 1 }
]), updateProfile);

export default router;
