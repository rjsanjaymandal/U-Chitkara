const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Function to add a test user with a random email
const addRandomUser = async () => {
  try {
    // Generate a random email
    const randomNum = Math.floor(Math.random() * 1000);
    const email = `test${randomNum}@example.com`;
    
    console.log(`Adding random user with email: ${email}`);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User with this email already exists');
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('Test@123', 10);
    
    // Create a profile for the user
    const profileDetails = new Profile({
      gender: 'Male',
      dateOfBirth: new Date('1990-01-01'),
      about: 'Random test user for development',
      contactNumber: '1234567890',
    });
    
    // Save the profile
    const profile = await profileDetails.save();
    console.log('Profile created successfully');
    
    // Create a new user
    const newUser = new User({
      firstName: 'Random',
      lastName: 'User',
      email,
      password: hashedPassword,
      accountType: 'Student',
      active: true,
      approved: true,
      additionalDetails: profile._id,
      courses: [],
      courseProgress: [],
      image: `https://api.dicebear.com/5.x/initials/svg?seed=Random User`,
    });
    
    // Save the user
    await newUser.save();
    console.log('Random user created successfully');
    console.log('User ID:', newUser._id);
    console.log('Email:', newUser.email);
  } catch (error) {
    console.error('Error adding random user:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Call the function
addRandomUser();
