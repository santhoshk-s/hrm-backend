import express from 'express';
import multer from 'multer';
import { addArrival, approveEarlyDeparture, getAllAttendance, getAttendanceImage, getTodayOneUserAttendance, updateDeparture } from '../controllers/attendanceController.js';
import verifyToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/add_arrival',verifyToken,upload.single('file'), addArrival);
router.post('/update_departure',verifyToken, updateDeparture);
router.get('/image/:imageId', getAttendanceImage);
router.get('/today', getTodayOneUserAttendance);
router.get('/all',verifyToken,authorizeRole(['hr','admin']),  getAllAttendance);
router.post('/approve',verifyToken,authorizeRole(['hr','admin']), approveEarlyDeparture);

export default router;
