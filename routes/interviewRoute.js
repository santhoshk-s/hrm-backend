import express from 'express';
import multer from 'multer';
import verifyToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { addInterview, updateInterview ,getInterviewFile,getOneInterviews,getAllInterviews,deleteInterview} from '../controllers/interviewController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/new',verifyToken,authorizeRole(['manager','hr','admin']),upload.single('file'), addInterview);
router.put('/update/:id',verifyToken,authorizeRole(['manager','hr','admin']),upload.single('file'), updateInterview);
router.get('/all',verifyToken,authorizeRole(['manager','hr','admin']), getAllInterviews);
router.get('/one/:id',verifyToken,authorizeRole(['manager','hr','admin']), getOneInterviews);
router.get('/file/:resumeId', getInterviewFile);
router.delete('/remove/:id',verifyToken,authorizeRole(['manager','hr','admin']), deleteInterview);


export default router;
