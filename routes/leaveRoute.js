import express from 'express';
import { approveLeave, leaveApply, rejectLeave, getPendingLeaves, getForHrLeaves , getAllLeaves,deleteLeave,getOneLeaves} from '../controllers/leaveController.js';
import verifyToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/apply',verifyToken,leaveApply)
router.put('/approve/:id',verifyToken,authorizeRole(['hr','manager']),approveLeave)
router.put('/reject/:id',verifyToken,authorizeRole(['hr','manager']),rejectLeave)
router.get('/pending',verifyToken,authorizeRole(['manager']),getPendingLeaves)
router.get('/hr',verifyToken,authorizeRole(['hr']),getForHrLeaves)
router.get('/all',verifyToken,authorizeRole(['hr','manager']),getAllLeaves)
router.get('/one',verifyToken,getOneLeaves)
router.delete('/delete/:id',verifyToken,authorizeRole(['hr','manager']),deleteLeave)

export default router;
