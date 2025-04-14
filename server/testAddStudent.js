const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');
const CourseProgress = require('./models/CourseProgress');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Function to add a student to a course
const addStudentToCourse = async (courseId, studentEmail) => {
  try {
    console.log('Adding student to course...');
    console.log('Course ID:', courseId);
    console.log('Student Email:', studentEmail);

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      console.error('Course not found');
      return;
    }
    console.log('Course found:', course.courseName);

    // Find the student by email
    const student = await User.findOne({ email: studentEmail });
    if (!student) {
      console.error('Student not found with the provided email');
      return;
    }
    console.log('Student found:', student.firstName, student.lastName);

    // Check if the student is already enrolled
    if (course.studentsEnrolled.includes(student._id)) {
      console.error('Student is already enrolled in this course');
      return;
    }

    // Add student to the course
    course.studentsEnrolled.push(student._id);
    await course.save();
    console.log('Student added to course');

    // Add course to student's enrolled courses
    student.courses.push(courseId);
    await student.save();
    console.log('Course added to student');

    // Create course progress for the student
    const newCourseProgress = new CourseProgress({
      userID: student._id,
      courseID: courseId,
    });
    await newCourseProgress.save();
    console.log('Course progress created');

    // Add course progress to student
    await User.findByIdAndUpdate(
      student._id,
      {
        $push: { courseProgress: newCourseProgress._id },
      },
      { new: true }
    );
    console.log('Course progress added to student');

    console.log('Student successfully added to the course');
  } catch (error) {
    console.error('Error adding student to course:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Call the function with the course ID and student email
// Replace these with actual values
const courseId = process.argv[2];
const studentEmail = process.argv[3];

if (!courseId || !studentEmail) {
  console.error('Usage: node testAddStudent.js <courseId> <studentEmail>');
  process.exit(1);
}

addStudentToCourse(courseId, studentEmail);
