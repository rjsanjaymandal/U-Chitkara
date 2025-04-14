const mongoose = require("mongoose");
const Course = require("./models/Course");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Function to list all courses
const listCourses = async () => {
  try {
    console.log("Listing all courses...");

    // Find all courses without using populate
    const courses = await Course.find({});

    if (courses.length === 0) {
      console.log("No courses found in the database");
      return;
    }

    console.log(`Found ${courses.length} courses:`);
    courses.forEach((course, index) => {
      console.log(`\n${index + 1}. Course ID: ${course._id}`);
      console.log(`   Name: ${course.courseName}`);
      console.log(
        `   Description: ${
          course.courseDescription
            ? course.courseDescription.substring(0, 50) + "..."
            : "No description"
        }`
      );
      console.log(`   Instructor ID: ${course.instructor || "No instructor"}`);
      console.log(`   Students Enrolled: ${course.studentsEnrolled.length}`);
    });
  } catch (error) {
    console.error("Error listing courses:", error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Call the function
listCourses();
