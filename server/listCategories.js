const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Function to list all categories
const listCategories = async () => {
  try {
    console.log('Listing all categories...');
    
    // Find all categories
    const categories = await Category.find({});
    
    if (categories.length === 0) {
      console.log('No categories found in the database');
      return;
    }
    
    console.log(`Found ${categories.length} categories:`);
    categories.forEach((category, index) => {
      console.log(`\n${index + 1}. Category ID: ${category._id}`);
      console.log(`   Name: ${category.name}`);
      console.log(`   Description: ${category.description ? category.description.substring(0, 50) + '...' : 'No description'}`);
      console.log(`   Courses: ${category.courses.length}`);
    });
  } catch (error) {
    console.error('Error listing categories:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Call the function
listCategories();
