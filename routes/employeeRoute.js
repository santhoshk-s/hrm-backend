import express from 'express';
import multer from 'multer';
import { getProfile, getProfileFile, updateProfile,removeUser, roleChange,getAllUser,getOneUser } from '../controllers/employeeController.js';
import verifyToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/profile', verifyToken, getProfile);
router.get('/all', verifyToken, getAllUser);
router.get('/one/:id', verifyToken, getOneUser);
router.get('/profile/:fileId', getProfileFile);
router.put('/update_profile', verifyToken, upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'bankImage', maxCount: 1 },
    { name: 'aadharImage', maxCount: 1 },
    { name: 'panImage', maxCount: 1 }
]), updateProfile);
router.delete('/remove/:id',verifyToken,authorizeRole(['admin']), removeUser);
router.put('/role_change/:id',verifyToken,authorizeRole(['admin']), roleChange);

export default router;
