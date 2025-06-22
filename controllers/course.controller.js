import db from "../libs/db.js";
import courseCreationEmail from "../libs/email.coure_creation.js";

export default async function courseController(req, res, next) {
  const { title, description, imageUrl,categoryId} = req.body;

  try {



    const instructorName = req.user.name;
    const email = req.user.email;
    const instructorId = req.user.id;

    const newCourse = await db.course.create({
      data: {
        title,
        description,
        imageUrl,
       category:{
        connect: {
          id: categoryId, 
        }

       },
        instructor: {
          connect: {
            id: instructorId, // connect is used to link the instructorId to the User model.
          },
        },
      },
    });
    await courseCreationEmail(email, title);

    return res.status(201).json({
      success: true,
      message: 'Course registration successful',
      data: newCourse
    });
  } catch (error) {
    // console.error('Error creating user:', error);
    // return res.status(500).json({ error: 'Internal server error' });
    next(error)
  }
}

export async function getCourseByID(req, res, next) {
  const { id } = req.params;

  try {
    const course = await db.course.findUnique({
      where: { id },
      include: {
        instructor: true,
        lessons: true,
        enrollments: true,
        category: true,
      },
    });

    if (!course) {
      const error = new Error('Course not found');
      error.status = 404;
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: `course fetched successfully`,
      course
    })
  } catch (error) {
    next(error);
  }
}

//fetch all courses available
export async function getAllCourse(req, res, next) {

  try {
    const course = await db.course.findMany({

      include: {
        instructor: true,
        lessons: true,
        enrollments: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });

    if (!course) {
      const error = new Error('No course found');
      error.status = 404;
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: `course fetched successfully`,
       course
    })
  } catch (error) {
    next(error);
  }

}

export async function deleteCourse(req, res, next) {
  const { courseId } = req.params; // ✅ Course ID from URL
  const instructorId = req.user.id; // ✅ Logged-in Instructor's ID

  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }

    if (course.instructorId !== instructorId) {
      const error = new Error("You are not authorized to delete this course");
      error.status = 403;
      throw error;
    }

    await db.course.delete({
      where: { id: courseId },
    });

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCourse(req, res, next) {
  const { courseId } = req.params;
  const { title, description } = req.body;
  const instructorId = req.user.id;

  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }

    if (course.instructorId !== instructorId) {
      const error = new Error("You are not authorized to update this course");
      error.status = 403;
      throw error;
    }

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: {
        title,
        description,

      },
    });

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
}


export async function myCourseEnrollments(req, res, next) {
  const { courseId } = req.params;
  const instructorId = req.user.id;

  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
      orderBy: {
        createdAt: 'desc', 
      },
    });

    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }

    if (course.instructorId !== instructorId) {
      const error = new Error("You are not authorized to view this course enrollments");
      error.status = 403;
      throw error;
    }

    const courseCount = await db.enrollment.count({
      where: { courseId },

    });

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
      totalErollments: courseCount
    });
  } catch (error) {
    next(error);
  }
}


//fetches all courses
export async function getCourseByUserId(req, res, next) {
  const { instructorId } = req.params;


  try {
    const courses = await db.course.findMany({
      where: { instructorId },
      include: {
        instructor: true,
        lessons: true,
        enrollments: true,
        category: true,
      },
    });

    if (courses.length === 0) {
      const error = new Error("You haven't published any course yet");
      error.status = 400;
      throw error;
      return []
      }
    

    return res.status(200).json({
      success: true,
      message: 'Courses fetched successfully',
      courses,

    });
  } catch (error) {
    next(error);
  }
}

//fetch random courses based on user interests(categoryId)
export async function getRecommendedCourses(req, res, next) {
  const userId = req.user.id;

  try {
    // 1. Get the user's selected interest categories
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { interests: true },
    });

    if (!user || !user.interests || user.interests.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No interests selected yet.",
        data: [],
      });
    }

    // 2. Fetch random full course documents matching user interests
    const recommendedCourses = await db.course.aggregateRaw({
      pipeline: [
        {
          $match: {
            categoryId: { $in: user.interests },
          },
        },
        {
          $sample: { size: 8 }, // fetch 8 random full course docs
        }
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Recommended courses based on your interests",
      data: recommendedCourses,
    });
  } catch (error) {
    next(error);
  }
}





