import { Router } from 'express';
import { authenticateUser, authorizeRole, verifiedUser } from '../middlewares/auth.middleware.js';
import getEnrollmentByStudentId, { enrollInCourse, getEnrolledStudents, getEnrollmentByInstructorId,  } from '../controllers/enroll.controller.js';


const enrollmentRouter = Router();
enrollmentRouter.post('/course/:courseId', authenticateUser,
    authorizeRole("student"), enrollInCourse); 
    enrollmentRouter.get('/course/:courseId', authenticateUser,
        verifiedUser, getEnrolledStudents); 

        enrollmentRouter.get('/user', authenticateUser, getEnrollmentByStudentId);

// Fetch all enrollments for a specific instructor
enrollmentRouter.get('/instructor', authenticateUser, getEnrollmentByInstructorId);
    


export default enrollmentRouter;