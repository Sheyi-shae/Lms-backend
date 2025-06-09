import { Router } from 'express';
import { authenticateUser, verifiedUser } from '../middlewares/auth.middleware.js';
import { generateCertificate, getUserCertificates } from '../controllers/cert.controller.js';


const certificateRouter = Router();
certificateRouter.post('/', authenticateUser,
    verifiedUser,generateCertificate);

    //fetch all certificates for a user
certificateRouter.get('/all', authenticateUser,getUserCertificates);


export default certificateRouter