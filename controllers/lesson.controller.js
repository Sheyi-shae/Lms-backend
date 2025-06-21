import db from "../libs/db.js";


export async function createLesson(req, res, next) {
  const { title, content, videoUrl } = req.body;
  const { courseId } = req.params;
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
      const error = new Error("You are not authorized to add lessons to this course");
      error.status = 403;
      throw error;
    }

    // Get the highest position for this course
    const lastLesson = await db.lesson.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
    });

    const position = lastLesson ? lastLesson.position + 1 : 1;

    const newLesson = await db.lesson.create({
      data: {
        title,
        content,
        videoUrl,
        position,
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      newLesson,
    });
  } catch (error) {
    next(error);
  }
}



//for students
export async function getCourseLessonsById(req, res, next) {
  const { courseId } = req.params;
  const studentId = req.user.id;

  

  try {
    //find enollment && check if student is enrolled
    const enrollment = await db.enrollment.findFirst({
      where: { studentId, courseId },
    });

   

    // Get all course lessons ordered by position
    const lessons = await db.lesson.findMany({
      where: { courseId },
      orderBy: { position: 'asc' },
    });

    // Extract completed lessons or fallback to empty array
    const completedLessons = enrollment?.completedLessons || [];

    // Lock/Unlock Logic
    const unlockedLessons = lessons.map((lesson) => {
      const isCompleted = completedLessons.includes(lesson.id);
      const isUnlocked = isCompleted || lesson.position === 1;

      return {
        ...lesson,
        isLocked: !isUnlocked,
      };
    });

    return res.status(200).json({
      success: true,
      data: unlockedLessons,
      enrollment
    });
  } catch (error) {
    next(error);
  }
}



export async function getLessonById(req, res, next) {
  const { lessonId } = req.params; // Get the courseId from URL params
  const instructorId = req.user.id;

  try {

    // Check if the  course exists
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: true,
      },
    });

    if (!lesson) {
      const error = new Error("lesson not found");
      error.status = 404;
      throw error;
    }
   




    return res.status(201).json({
      success: true,
      message: "Lesson fetched successfully",
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteLessonById(req, res, next) {
  const { lessonId } = req.params; // ✅ Course ID from URL
  const instructorId = req.user.id; // ✅ Logged-in Instructor's ID

  try {
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: true,
      },
    });

    if (!lesson) {
      const error = new Error("lesson not found");
      error.status = 404;
      throw error;
    }
    
    if (lesson.course.instructorId !== instructorId) {
      const error = new Error("You are not authorized to delete this lesson");
      error.status = 403;
      throw error;
    }

    // Delete the lesson 
    await db.lesson.delete({
      where: { id: lessonId },
    });

    return res.status(200).json({
      success: true,
      message: "lesson deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLesson(req, res, next) {
  const { lessonId } = req.params;
  const { title, content, videoUrl, position } = req.body;
  const instructorId = req.user.id;

  try {
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson) {
      const error = new Error("Lesson not found");
      error.status = 404;
      throw error;
    }

    if (lesson.course.instructorId !== instructorId) {
      const error = new Error("You are not authorized to update this lesson");
      error.status = 403;
      throw error;
    }

    let newPosition = lesson.position;

    if (position !== undefined && position !== lesson.position) {
      const parsedPosition = parseInt(position);

      if (isNaN(parsedPosition)) {
        const error = new Error("Position must be a valid number.");
        error.status = 400;
        throw error;
      }

      const existingLessonAtPosition = await db.lesson.findFirst({
        where: {
          courseId: lesson.courseId,
          position: parsedPosition,
          NOT: { id: lesson.id },
        },
      });

      if (existingLessonAtPosition) {
        const error = new Error("Another lesson already exists at this position.");
        error.status = 400;
        throw error;
      }

      newPosition = parsedPosition;
    }

    const updatedLesson = await db.lesson.update({
      where: { id: lessonId },
      data: {
        title,
        content,
        videoUrl,
        position: newPosition,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      data: updatedLesson,
    });
  } catch (error) {
    next(error);
  }
}




//update lesson progress
export async function completeLesson(req, res, next) {
  const { lessonId, courseId } = req.body;
  const studentId = req.user.id;


  try {
    // ✅ Check if the user is enrolled in the course
    const enrollment = await db.enrollment.findFirst({
      where: { studentId, courseId },
    });

    if (!enrollment) {
     
      const error = new Error("You are not enrolled in this course");
      error.status = 403;
      throw error;
    }
    

    // ✅ Get the current lesson
    const currentLesson = await db.lesson.findUnique({
      where: { id: lessonId },
    });

    // ✅ Get the previous lesson (if any)
    const previousLesson = await db.lesson.findFirst({
      where: {
        courseId,
        position: currentLesson.position - 1,
      },
    });

    // ✅ If the previous lesson is not completed, lock this lesson
    const isPreviousLessonCompleted = previousLesson
      ? enrollment.completedLessons.includes(previousLesson.id)
      : true;

    if (!isPreviousLessonCompleted) {
      
      const error = new Error("Complete the previous lesson first");
      error.status = 400;
      throw error;
    }

    // ✅ Check if lesson is already completed
    const isAlreadyCompleted = enrollment.completedLessons.includes(lessonId);

    if (isAlreadyCompleted) {
      const error = new Error("You have already completed this lesson");
      error.status = 400;
      throw error;
    }

    // ✅ Add this lesson to completedLessons array
    const updatedLessons = [...enrollment.completedLessons, lessonId];

    // ✅ Calculate progress
    const totalLessons = await db.lesson.count({
      where: { courseId },
    });

    const progress = Math.round((updatedLessons.length / totalLessons) * 100);

    // ✅ Update Enrollment table
    const updatedEnrollment = await db.enrollment.update({
      where: { id: enrollment.id },
      data: {
        completedLessons: updatedLessons,
        progress,
      },
    });

    return res.status(200).json({
      message: "Lesson marked as completed",
      updatedEnrollment,
    });
  } catch (error) {
    next(error);
  }
}