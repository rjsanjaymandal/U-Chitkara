const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Profile = require("../models/Profile");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");

// Function to create a new course
exports.createCourse = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      status,
      instructions,
    } = req.body;

    // Get thumbnail image from request files
    const thumbnail = req.files.thumbnailImage;

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }
    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    console.log(thumbnailImage);
    // Create a new course with the given details
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions: instructions,
    });

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    // Add the new course to the Categories
    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnroled: true,
      }
    )
      .populate("instructor")
      .exec();
    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};

//getCourseDetails

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const courseDetails = await Course.find({ _id: courseId })
      .populate({ path: "instructor", populate: { path: "additionalDetails" } })
      .populate("category")
      .populate({
        //only populate user name and image
        path: "ratingAndReviews",
        populate: {
          path: "user",
          select: "firstName lastName accountType image",
        },
      })
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course fetched successfully now",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};

// Function to get all courses of a particular instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Find all courses of the instructor
    const allCourses = await Course.find({ instructor: userId });

    // Return all courses of the instructor
    res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    // Handle any errors that occur during the fetching of the courses
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

//Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//get full course details
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userID: userId,
    });

    console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : ["none"],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    //Delete course id from Category
    await Category.findByIdAndUpdate(course.category._id, {
      $pull: { courses: courseId },
    });

    //Delete course id from Instructor
    await User.findByIdAndUpdate(course.instructor._id, {
      $pull: { courses: courseId },
    });

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

//search course by title,description and tags array
exports.searchCourse = async (req, res) => {
  try {
    const { searchQuery } = req.body;
    //   console.log("searchQuery : ", searchQuery)
    const courses = await Course.find({
      $or: [
        { courseName: { $regex: searchQuery, $options: "i" } },
        { courseDescription: { $regex: searchQuery, $options: "i" } },
        { tag: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .populate({
        path: "instructor",
      })
      .populate("category")
      .populate("ratingAndReviews")
      .exec();

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//mark lecture as completed
exports.markLectureAsComplete = async (req, res) => {
  try {
    const { courseId, subSectionId } = req.body;
    const userId = req.user.id;

    if (!courseId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if the course progress exists
    let courseProgress = await CourseProgress.findOne({
      userID: userId,
      courseID: courseId,
    });

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found",
      });
    }

    // Check if the subsection is already completed
    if (courseProgress.completedVideos.includes(subSectionId)) {
      return res.status(400).json({
        success: true,
        message: "Subsection already marked as completed",
      });
    }

    // Add the subsection to the completed videos array
    courseProgress.completedVideos.push(subSectionId);
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Lecture marked as complete",
    });
  } catch (error) {
    console.error("Error marking lecture as complete:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark lecture as complete",
      error: error.message,
    });
  }
};

// Get all students enrolled in a course
exports.getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.body;
    const instructorId = req.user.id;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if the instructor is the owner of the course
    if (course.instructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this information",
      });
    }

    // Get all enrolled students with their details
    const enrolledStudentsIds = course.studentsEnrolled;
    const enrolledStudents = await User.find(
      { _id: { $in: enrolledStudentsIds } },
      { password: 0 } // Exclude password from the results
    ).populate("additionalDetails");

    return res.status(200).json({
      success: true,
      data: enrolledStudents,
    });
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled students",
      error: error.message,
    });
  }
};

// Add a student to a course
exports.addStudentToCourse = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    console.log("Request user:", req.user);

    const { courseId, studentEmail } = req.body;
    let instructorId = "test";

    // Handle the case where req.user is undefined (for test route)
    if (req.user) {
      instructorId = req.user.id;
    }

    console.log("Course ID:", courseId);
    console.log("Student Email:", studentEmail);
    console.log("Instructor ID:", instructorId);

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if the instructor is the owner of the course (skip for test route)
    if (
      instructorId !== "test" &&
      course.instructor.toString() !== instructorId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to add students to this course",
      });
    }

    // Find the student by email
    const student = await User.findOne({ email: studentEmail });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found with the provided email",
      });
    }

    // Check if the student is already enrolled
    if (course.studentsEnrolled.includes(student._id)) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this course",
      });
    }

    // Add student to the course
    course.studentsEnrolled.push(student._id);
    await course.save();

    // Add course to student's enrolled courses
    student.courses.push(courseId);
    await student.save();

    // Create course progress for the student
    const newCourseProgress = new CourseProgress({
      userID: student._id,
      courseID: courseId,
    });
    await newCourseProgress.save();

    // Add course progress to student
    await User.findByIdAndUpdate(
      student._id,
      {
        $push: { courseProgress: newCourseProgress._id },
      },
      { new: true }
    );

    // Send enrollment email to student
    try {
      const emailTemplate = courseEnrollmentEmail(
        course.courseName,
        `${student.firstName} ${student.lastName}`,
        course.courseDescription,
        course.thumbnail
      );

      await mailSender(
        student.email,
        `You have been enrolled in ${course.courseName}`,
        emailTemplate
      );
      console.log("Enrollment email sent successfully");
    } catch (emailError) {
      console.error("Error sending enrollment email:", emailError);
      // Continue with the process even if email sending fails
    }

    return res.status(200).json({
      success: true,
      message: "Student successfully added to the course",
    });
  } catch (error) {
    console.error("Error adding student to course:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Failed to add student to course",
      error: error.message,
      stack: error.stack,
    });
  }
};

// Remove a student from a course
exports.removeStudentFromCourse = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;
    const instructorId = req.user.id;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if the instructor is the owner of the course
    if (course.instructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to remove students from this course",
      });
    }

    // Check if the student is enrolled in the course
    if (!course.studentsEnrolled.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student is not enrolled in this course",
      });
    }

    // Remove student from the course
    course.studentsEnrolled = course.studentsEnrolled.filter(
      (id) => id.toString() !== studentId
    );
    await course.save();

    // Remove course from student's enrolled courses
    await User.findByIdAndUpdate(
      studentId,
      {
        $pull: { courses: courseId },
      },
      { new: true }
    );

    // Remove course progress
    await CourseProgress.findOneAndDelete({
      userID: studentId,
      courseID: courseId,
    });

    // Remove course progress from student
    await User.findByIdAndUpdate(
      studentId,
      {
        $pull: { courseProgress: { courseID: courseId } },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Student successfully removed from the course",
    });
  } catch (error) {
    console.error("Error removing student from course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove student from course",
      error: error.message,
    });
  }
};
