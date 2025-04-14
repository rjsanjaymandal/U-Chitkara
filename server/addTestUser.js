const mongoose = require("mongoose");
const User = require("./models/User");
const Profile = require("./models/Profile");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Function to add a test user
const addTestUser = async () => {
  try {
    console.log("Adding test user...");

    const email = "test@example.com";

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User with this email already exists");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("Test@123", 10);

    // Create a new user
    const newUser = new User({
      firstName: "Test",
      lastName: "User",
      email,
      password: hashedPassword,
      accountType: "Student",
      active: true,
      approved: true,
      additionalDetails: null,
      courses: [],
      courseProgress: [],
      image: `https://api.dicebear.com/5.x/initials/svg?seed=Test User`,
    });

    // Save the user
    await newUser.save();
    console.log("Test user created successfully");
    console.log("User ID:", newUser._id);
    console.log("Email:", newUser.email);
  } catch (error) {
    console.error("Error adding test user:", error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Call the function
addTestUser();
