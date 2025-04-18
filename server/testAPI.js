const axios = require("axios");

// Function to test the API
const testAPI = async () => {
  try {
    console.log("Testing API...");

    // Make a POST request to the API
    const response = await axios.post(
      "http://localhost:4001/api/v1/course/addStudentToCourse",
      {
        courseId: "67fd6066fd274d0abda9d2ea",
        studentEmail: "test2@example.com",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorisation:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9mZmljaWFsc2lyaXVzYmxhY2s3QGdtYWlsLmNvbSIsImlkIjoiNjdmZDRiMGVjMWNhYjNlN2E4YzE3MTQyIiwiYWNjb3VudFR5cGUiOiJJbnN0cnVjdG9yIiwiaWF0IjoxNzQ0NjUzMDgwLCJleHAiOjE3NDQ3Mzk0ODB9.pmOFr54nCLoR81qCi0GxbBox6R0wWAExDdy0ORIfKd4",
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
