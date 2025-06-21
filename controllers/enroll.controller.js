import db from "../libs/db.js";
import notifyInstructorOfEnrollment from "../libs/email.instructorenroll.js";
import studentEnrollment from "../libs/email.studentenroll.js";

export async function enrollInCourse(req, res, next) {
    const { courseId } = req.params; 
    const studentId = req.user.id; 
    const studentEmail = req.user.email; 
    const studentName = req.user.name;
    const {instructorName, instructorId,instructorEmail}=req.body
   
  
    try {
      // Check if course exists
      const course = await db.course.findUnique({
        where: { id: courseId },
      });
  
      if (!course) {
        const error = new Error("Course not found");
        error.status = 404;
        throw error;
      }
  
      // Check if student is already enrolled
      const existingEnrollment = await db.enrollment.findFirst({
        
        
        where: {
          studentId,
          courseId: courseId,
        },
      });
  
      if (existingEnrollment) {
        const error = new Error("You are already enrolled in this course");
        error.status = 400;
        throw error;
      }
  
      // Enroll student in the course
      const enrollment = await db.enrollment.create({
        data: {
           studentId,
          courseId: courseId,
          instructorName,
          instructorId,
        },
      });
      //send notification to the instructor and student
      await studentEnrollment(studentEmail, course.title);
      await notifyInstructorOfEnrollment(instructorEmail, course.title, studentName);
  
      return res.status(201).json({
        success: true,
        message: "Successfully enrolled in course",
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  }
  
  export async function getEnrolledStudents(req, res, next) {
    const { courseId } = req.params;
  
    try {
      const enrollments = await db.enrollment.findMany({
        where: { courseId },
        include: {
          student:true
        },
        include: {
          course: true
          },
      });
      const totalStudents = await db.enrollment.count({
        where: { courseId },
      });

      return res.status(200).json({
        success: true,
        message: "Students enrolled in this course",
         enrollments,
        totalStudents: totalStudents,
      })
    } catch (error) {
      next(error);
    }
  }
  

  // Fetch all enrollments for a specific student
  export default async function getEnrollmentByStudentId(req, res, next) {
    const studentId = req.user.id; 
  
    try {
      
      const enrollments = await db.enrollment.findMany({
        where: { studentId },
        orderBy: { createdAt: "desc" }, 
        include: {
          course: true, 
          
        },
      });

      //fetch total number of lessons in the course a user enrolled in
      const totalLessons = await db.lesson.count({
        where: { courseId: enrollments.courseId },
      });


  
      return res.status(200).json({
        success: true,
        message: "Enrollments fetched successfully",
        data: enrollments,
        totalLessons: totalLessons,
      });
    } catch (error) {
      next(error);
    }
  }


  //fetch all enrollments for a specific instructor
  export async function getEnrollmentByInstructorId(req, res, next) {
    const instructorId = req.user.id; 
  
    try {
      
      const enrollments = await db.enrollment.findMany({
        where: { instructorId },
        orderBy: { createdAt: "desc" }, 
        include: {
          course: {
            include: {
              category: true, // Include category details
            },
          },
          student: true
          
        },
      });
      if(!enrollments || enrollments.length === 0) {
          const error = new Error("No enrollments found for this instructor");
        error.status = 400;
        throw error;
       
      }

      //fetch total number of lessons in the course a user enrolled in
      const totalLessons = await db.lesson.count({
        where: { courseId: enrollments.courseId },
      });
      
      return res.status(200).json({
        success: true,
        message: "Enrollments fetched successfully",
        data: enrollments,
        totalLessons: totalLessons,
      });
    }catch (error) {
      next(error);
    }
  }
