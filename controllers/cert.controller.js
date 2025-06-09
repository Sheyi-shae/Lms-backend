
import db from "../libs/db.js";
import { v4 as uuidv4 } from 'uuid'; 

//generate certicate a user in a completed course
export  async function generateCertificate(req, res, next){
const{courseId}=req.body;
const userId=req.user.id;


try {
   //Check if user completed the course
    const enrollment = await db.enrollment.findFirst({
      where: {
        studentId: userId,
        courseId,
      },
    });

    if (!enrollment) {
     const error = new Error('You did not enroll in this course');
      error.status = 404;
      throw error;
    }

    if (enrollment.progress < 100) {
      const error = new Error('You have not completed this course');
      error.status = 400;
      throw error;
    }

  // Check if certificate already exists
    const existing = await db.certification.findFirst({
      where: { userId, courseId },
    });

    if (existing) {
    const error = new Error('certificate already issued');
      error.status = 409;
      throw error;
    }

    const certificateId = uuidv4(); 

    
    const certificateUrl = `https://example.com/certificates/${certificateId}`;

    const certification = await db.certification.create({
      data: {
        userId,
        courseId,
        certificateId,
        certificateUrl,
      },
    });
    
res.status(201).json({  success: true, message: 'Certificate issued successfully', certification });
  
}catch (error) {
    next(error);
  }
}



//get all certificates of a user

export async function getUserCertificates(req, res) {
  const userId = req.user.id;

  try {
    const certificates = await db.certification.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
            instructor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      count: certificates.length,
      certificates,
    });

  } catch (error) {
   next(error);
  }
}
