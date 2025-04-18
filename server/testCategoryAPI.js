const axios = require("axios");

// Function to test the API
const testAPI = async () => {
  try {
    console.log("Testing API...");

    // Make a POST request to the API
    const response = await axios.post(
      "http://localhost:4001/api/v1/course/getCategoryPageDetails",
      {
        categoryId: "67fd4bfb9d406608104d81d1", // Web Development category
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Response:", response.data);
  } catch (error) {
    console.error("Error testing API:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
  }
};

// Call the function
testAPI();
