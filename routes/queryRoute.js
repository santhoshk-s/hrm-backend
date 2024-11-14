import express from 'express';
import { newQuery, getAllQuery, getOneQuery , getPendingQuery, queryResponse } from '../controllers/queryController.js';
import verifyToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/new',verifyToken, newQuery);
router.get('/all',verifyToken,authorizeRole(['manager','admin']), getAllQuery);
router.get('/one/:id', getOneQuery);
router.get('/pending',verifyToken,authorizeRole(['manager','admin']), getPendingQuery);
router.put('/response/:id',verifyToken,authorizeRole(['manager','admin']), queryResponse);

export default router;
