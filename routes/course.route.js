import { Router } from 'express';
import courseController, { deleteCourse, getAllCourse, getCourseByUserId, getCourseByID, myCourseEnrollments, updateCourse, getRecommendedCourses } from '../controllers/course.controller.js';
import { authenticateUser, authorizeRole, verifiedUser } from '../middlewares/auth.middleware.js';
import { completeLesson, createLesson, deleteLessonById, getCourseLessonsById, getLessonById, updateLesson } from '../controllers/lesson.controller.js';


const courseRouter = Router();


courseRouter.post('/', authenticateUser, authorizeRole('instructor', 'admin'),
    verifiedUser, courseController);
courseRouter.get('/all-courses', authenticateUser, getAllCourse);
//get all courses for non authenticated users


courseRouter.get('/:id', authenticateUser, getCourseByID)//also fetch course details attached to the logged in instructor
courseRouter.put('/update/:courseId', authenticateUser,verifiedUser, authorizeRole('instructor', 'admin'),
    verifiedUser, updateCourse); //  update course
courseRouter.get('/mycourseenrollments/:courseId', authenticateUser, authorizeRole('instructor', 'admin'),
    verifiedUser, myCourseEnrollments); //  fetch my course enrollments
courseRouter.delete('/:courseId', authenticateUser,verifiedUser, authorizeRole('instructor'), deleteCourse);
courseRouter.get('/mycourse/:instructorId', authenticateUser,verifiedUser, authorizeRole('instructor', 'admin'),
    verifiedUser, getCourseByUserId);
   
courseRouter.get('/interests', authenticateUser,
     verifiedUser,getRecommendedCourses); //  fetch courses based on user interests

    //for public users
    courseRouter.get('/all-courses/public', getAllCourse); //  fetch all courses for public users
courseRouter.get('/public/:id',  getCourseByID)
courseRouter.get('/lesson/public/:lessonId', getLessonById)

//lesson for courses
courseRouter.post('/lesson/:courseId', authenticateUser,
    authorizeRole('instructor', 'admin'), createLesson)
courseRouter.get('/lesson/:lessonId', authenticateUser,
    authorizeRole('instructor', 'admin'), getLessonById)
courseRouter.put('/lesson/update/:lessonId', authenticateUser, authorizeRole('instructor', 'admin'),
    verifiedUser, updateLesson); //  update lesson
courseRouter.delete('/lesson/:lessonId', authenticateUser,
    authorizeRole('instructor', 'admin'), deleteLessonById)
    //get lesson by courseId for students
courseRouter.get('/lesson/course/:courseId', authenticateUser,verifiedUser, getCourseLessonsById) //  get lesson by courseId
//complete lesson
courseRouter.post('/lesson/course/complete', authenticateUser,completeLesson); //  complete lesson



export default courseRouter;