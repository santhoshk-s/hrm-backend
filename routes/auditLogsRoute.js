import express from 'express';
import { getAllLogs } from '../controllers/auditLogsController.js';
import verifyToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/all',verifyToken,authorizeRole(['admin']), getAllLogs);

export default router;
