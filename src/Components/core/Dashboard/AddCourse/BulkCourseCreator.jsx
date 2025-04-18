import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  fetchCourseCategories,
  addCourseDetails,
  createSection,
  createSubSection,
} from "../../../../services/operations/courseDetailsAPI";
import { COURSE_STATUS } from "../../../../utils/constants";
import { toast } from "react-hot-toast";

// Course templates for different categories
const courseTemplates = {
  // Web Development courses
  webDev: [
    {
      courseName: "Modern JavaScript: From Fundamentals to Advanced",
      courseDescription:
        "Master JavaScript from the ground up. Learn ES6+, async/await, closures, and build real-world applications with modern JavaScript practices.",
      whatYouWillLearn:
        "• Understand JavaScript fundamentals and advanced concepts\n• Work with ES6+ features including arrow functions, destructuring, and modules\n• Master asynchronous programming with Promises and async/await\n• Build real-world applications with modern JavaScript practices\n• Understand closures, prototypes, and the 'this' keyword\n• Implement functional programming concepts in JavaScript",
      price: 1299,
      tag: ["JavaScript", "Web Development", "Frontend", "Programming"],
      instructions: [
        "Basic understanding of HTML and CSS",
        "No prior JavaScript knowledge required",
        "Computer with internet connection",
        "Code editor (VS Code recommended)",
      ],
      sections: [
        {
          sectionName: "Introduction to JavaScript",
          subSections: [
            {
              title: "Welcome to the Course",
              description:
                "Overview of what you'll learn in this JavaScript course",
              videoUrl: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
            },
            {
              title: "Setting Up Your Development Environment",
              description:
                "Installing and configuring the tools you'll need for JavaScript development",
              videoUrl: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
            },
          ],
        },
        {
          sectionName: "JavaScript Fundamentals",
          subSections: [
            {
              title: "Variables, Data Types, and Operators",
              description: "Understanding the building blocks of JavaScript",
              videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
            },
            {
              title: "Control Flow: Conditionals and Loops",
              description:
                "Making decisions and repeating actions in your code",
              videoUrl: "https://www.youtube.com/watch?v=Mus_vwhTCq0",
            },
          ],
        },
        {
          sectionName: "Advanced JavaScript Concepts",
          subSections: [
            {
              title: "Working with Functions and Closures",
              description:
                "Understanding function scope, closures, and advanced function patterns",
              videoUrl: "https://www.youtube.com/watch?v=vDJpGenyHaA",
            },
            {
              title: "Asynchronous JavaScript",
              description:
                "Mastering Promises, async/await, and handling asynchronous operations",
              videoUrl: "https://www.youtube.com/watch?v=PoRJizFvM7s",
            },
          ],
        },
      ],
    },
    {
      courseName: "React.js: Building Modern User Interfaces",
      courseDescription:
        "Learn to build dynamic, responsive web applications with React.js. Master hooks, context API, Redux, and create production-ready applications.",
      whatYouWillLearn:
        "• Build complete React applications from scratch\n• Master React Hooks for state management\n• Implement Context API and Redux for complex state\n• Create reusable components and custom hooks\n• Optimize React applications for performance\n• Deploy React applications to production",
      price: 1499,
      tag: ["React", "JavaScript", "Frontend", "Web Development"],
      instructions: [
        "Basic JavaScript knowledge required",
        "Understanding of HTML and CSS",
        "Familiarity with ES6+ features is helpful",
        "Node.js installed on your computer",
      ],
      sections: [
        {
          sectionName: "React Fundamentals",
          subSections: [
            {
              title: "Introduction to React",
              description:
                "Understanding React's core concepts and setting up your first React app",
              videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
            },
            {
              title: "Components and Props",
              description: "Creating and composing React components",
              videoUrl: "https://www.youtube.com/watch?v=4UZrsTqkcW4",
            },
          ],
        },
        {
          sectionName: "State Management in React",
          subSections: [
            {
              title: "Working with Hooks",
              description:
                "Using useState, useEffect, and other built-in hooks",
              videoUrl: "https://www.youtube.com/watch?v=mxK8b99iJTg",
            },
            {
              title: "Context API and Redux",
              description: "Managing global state in React applications",
              videoUrl: "https://www.youtube.com/watch?v=zrs7u6bdbUw",
            },
          ],
        },
        {
          sectionName: "Building Production-Ready Applications",
          subSections: [
            {
              title: "Routing with React Router",
              description: "Creating multi-page applications with React Router",
              videoUrl: "https://www.youtube.com/watch?v=Law7wfdg_ls",
            },
            {
              title: "Deploying React Applications",
              description:
                "Building and deploying your React app to production",
              videoUrl: "https://www.youtube.com/watch?v=h3RNElMbdUY",
            },
          ],
        },
      ],
    },
  ],

  // Data Science courses
  dataScience: [
    {
      courseName: "Python for Data Science and Machine Learning",
      courseDescription:
        "Comprehensive course on using Python for data analysis, visualization, and machine learning. Learn NumPy, Pandas, Matplotlib, Scikit-Learn, and TensorFlow.",
      whatYouWillLearn:
        "• Master Python libraries for data science: NumPy, Pandas, Matplotlib\n• Implement machine learning algorithms with Scikit-Learn\n• Build neural networks with TensorFlow and Keras\n• Perform data cleaning, preprocessing, and feature engineering\n• Create compelling data visualizations\n• Develop end-to-end machine learning projects",
      price: 1699,
      tag: ["Python", "Data Science", "Machine Learning", "AI"],
      instructions: [
        "Basic Python knowledge recommended",
        "No prior data science experience required",
        "Computer with at least 8GB RAM",
        "Jupyter Notebook or Google Colab account",
      ],
      sections: [
        {
          sectionName: "Python for Data Science",
          subSections: [
            {
              title: "Introduction to Python for Data Science",
              description: "Getting started with Python for data analysis",
              videoUrl: "https://www.youtube.com/watch?v=LHBE6Q9XlzI",
            },
            {
              title: "NumPy and Pandas Fundamentals",
              description:
                "Working with numerical data and dataframes in Python",
              videoUrl: "https://www.youtube.com/watch?v=QUT1VHiLmmI",
            },
          ],
        },
        {
          sectionName: "Data Visualization",
          subSections: [
            {
              title: "Visualization with Matplotlib and Seaborn",
              description: "Creating effective data visualizations in Python",
              videoUrl: "https://www.youtube.com/watch?v=0P7QnIQDBJY",
            },
            {
              title: "Interactive Visualizations with Plotly",
              description: "Building interactive charts and dashboards",
              videoUrl: "https://www.youtube.com/watch?v=GGL6U0k8WYA",
            },
          ],
        },
        {
          sectionName: "Machine Learning with Python",
          subSections: [
            {
              title: "Introduction to Machine Learning",
              description:
                "Understanding machine learning concepts and workflow",
              videoUrl: "https://www.youtube.com/watch?v=7eh4d6sabA0",
            },
            {
              title: "Building Models with Scikit-Learn",
              description:
                "Implementing and evaluating machine learning models",
              videoUrl: "https://www.youtube.com/watch?v=pqNCD_5r0IU",
            },
          ],
        },
      ],
    },
    {
      courseName: "SQL Mastery: Database Design and Optimization",
      courseDescription:
        "Learn SQL from basics to advanced concepts. Design efficient databases, write complex queries, and optimize database performance for real-world applications.",
      whatYouWillLearn:
        "• Design normalized database schemas\n• Write complex SQL queries with joins, subqueries, and window functions\n• Optimize database performance with indexing and query tuning\n• Implement transactions and understand ACID properties\n• Work with stored procedures, triggers, and views\n• Connect databases to applications",
      price: 1299,
      tag: ["SQL", "Database", "Data Engineering", "Backend"],
      instructions: [
        "No prior SQL or database knowledge required",
        "Basic understanding of data structures helpful",
        "Computer with MySQL or PostgreSQL installed",
        "Willingness to practice with exercises",
      ],
      sections: [
        {
          sectionName: "SQL Fundamentals",
          subSections: [
            {
              title: "Introduction to Databases and SQL",
              description: "Understanding database concepts and SQL basics",
              videoUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
            },
            {
              title: "Basic SQL Queries",
              description:
                "Writing SELECT, INSERT, UPDATE, and DELETE statements",
              videoUrl: "https://www.youtube.com/watch?v=9ylj9NR0Lcg",
            },
          ],
        },
        {
          sectionName: "Advanced SQL",
          subSections: [
            {
              title: "Joins and Relationships",
              description: "Working with multiple tables and relationships",
              videoUrl: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw",
            },
            {
              title: "Subqueries and Window Functions",
              description:
                "Advanced query techniques for complex data analysis",
              videoUrl: "https://www.youtube.com/watch?v=Ww71knvhQ-s",
            },
          ],
        },
        {
          sectionName: "Database Optimization",
          subSections: [
            {
              title: "Indexing and Performance Tuning",
              description:
                "Optimizing database performance with proper indexing",
              videoUrl: "https://www.youtube.com/watch?v=WkJwUkXBHPY",
            },
            {
              title: "Database Design Best Practices",
              description: "Designing efficient and scalable database schemas",
              videoUrl: "https://www.youtube.com/watch?v=ztHopE5Wnpc",
            },
          ],
        },
      ],
    },
  ],

  // Mobile Development courses
  mobileDev: [
    {
      courseName: "React Native: Build Mobile Apps for iOS and Android",
      courseDescription:
        "Learn to build native mobile applications for both iOS and Android using React Native. Master navigation, state management, and native device features.",
      whatYouWillLearn:
        "• Build cross-platform mobile apps with a single codebase\n• Implement navigation with React Navigation\n• Manage state with Redux and Context API\n• Access native device features like camera and location\n• Style applications with styled-components\n• Deploy apps to the App Store and Google Play",
      price: 1599,
      tag: ["React Native", "Mobile Development", "iOS", "Android"],
      instructions: [
        "React.js knowledge recommended",
        "JavaScript/ES6+ understanding required",
        "Mac for iOS development (optional)",
        "Android Studio or Xcode installed",
      ],
      sections: [
        {
          sectionName: "Getting Started with React Native",
          subSections: [
            {
              title: "Introduction to React Native",
              description:
                "Understanding React Native and setting up your development environment",
              videoUrl: "https://www.youtube.com/watch?v=0-S5a0eXPoc",
            },
            {
              title: "Your First React Native App",
              description:
                "Building a simple mobile application with React Native",
              videoUrl: "https://www.youtube.com/watch?v=qSRrxpdMpVc",
            },
          ],
        },
        {
          sectionName: "Core Components and APIs",
          subSections: [
            {
              title: "Core Components and Styling",
              description:
                "Working with React Native's built-in components and styling",
              videoUrl: "https://www.youtube.com/watch?v=ur6I5m2nTvk",
            },
            {
              title: "Navigation in React Native",
              description:
                "Implementing navigation between screens in your app",
              videoUrl: "https://www.youtube.com/watch?v=nQVCkqvU1uE",
            },
          ],
        },
        {
          sectionName: "Advanced React Native",
          subSections: [
            {
              title: "Working with Native Modules",
              description:
                "Accessing device features like camera, location, and storage",
              videoUrl: "https://www.youtube.com/watch?v=eV5eoIff8-Y",
            },
            {
              title: "Deploying to App Stores",
              description:
                "Preparing and publishing your app to the App Store and Google Play",
              videoUrl: "https://www.youtube.com/watch?v=oBWBDZ5gVp0",
            },
          ],
        },
      ],
    },
    {
      courseName: "Flutter Development: Beautiful Native Apps",
      courseDescription:
        "Master Flutter and Dart to build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
      whatYouWillLearn:
        "• Build engaging user interfaces with Flutter widgets\n• Manage state with Provider, Bloc, and Riverpod\n• Implement navigation and routing\n• Connect to REST APIs and Firebase\n• Use native device features\n• Deploy to multiple platforms",
      price: 1499,
      tag: ["Flutter", "Dart", "Mobile Development", "Cross-platform"],
      instructions: [
        "No prior Flutter or Dart knowledge needed",
        "Basic programming concepts understanding",
        "Computer with Flutter SDK installed",
        "Android Studio or VS Code",
      ],
      sections: [
        {
          sectionName: "Flutter Fundamentals",
          subSections: [
            {
              title: "Introduction to Flutter and Dart",
              description:
                "Getting started with Flutter development and the Dart language",
              videoUrl: "https://www.youtube.com/watch?v=1ukSR1GRtMU",
            },
            {
              title: "Building Your First Flutter App",
              description: "Creating a simple Flutter application from scratch",
              videoUrl: "https://www.youtube.com/watch?v=x0uinJvhNxI",
            },
          ],
        },
        {
          sectionName: "Flutter UI Development",
          subSections: [
            {
              title: "Working with Widgets",
              description:
                "Understanding Flutter's widget system and building UIs",
              videoUrl: "https://www.youtube.com/watch?v=b_sQ9bMltGU",
            },
            {
              title: "Layouts and Responsive Design",
              description:
                "Creating responsive layouts that work across different screen sizes",
              videoUrl: "https://www.youtube.com/watch?v=u1KD6Kz0PIQ",
            },
          ],
        },
        {
          sectionName: "Advanced Flutter",
          subSections: [
            {
              title: "State Management in Flutter",
              description:
                "Managing application state with Provider, Bloc, and Riverpod",
              videoUrl: "https://www.youtube.com/watch?v=3tm-R7ymwhc",
            },
            {
              title: "Working with APIs and Firebase",
              description: "Connecting your Flutter app to backend services",
              videoUrl: "https://www.youtube.com/watch?v=fi2WkznwWbc",
            },
          ],
        },
      ],
    },
  ],

  // Default courses for any other category
  default: [
    {
      courseName: "Coding Fundamentals: Programming Logic and Problem Solving",
      courseDescription:
        "Learn the core concepts of programming that apply across all languages. Master logical thinking, problem-solving, and algorithm design.",
      whatYouWillLearn:
        "• Understand fundamental programming concepts\n• Develop logical thinking and problem-solving skills\n• Design algorithms to solve complex problems\n• Learn data structures and their applications\n• Write pseudocode and flowcharts\n• Apply computational thinking to real-world problems",
      price: 999,
      tag: ["Programming", "Algorithms", "Problem Solving", "Coding"],
      instructions: [
        "No prior programming experience required",
        "Basic computer skills",
        "Willingness to think logically",
        "Computer with internet connection",
      ],
      sections: [
        {
          sectionName: "Introduction to Programming",
          subSections: [
            {
              title: "What is Programming?",
              description:
                "Understanding the basics of programming and computational thinking",
              videoUrl: "https://www.youtube.com/watch?v=zOjov-2OZ0E",
            },
            {
              title: "Problem Solving Approach",
              description:
                "Learning how to break down problems into solvable steps",
              videoUrl: "https://www.youtube.com/watch?v=UFc-RPbq8kg",
            },
          ],
        },
        {
          sectionName: "Programming Constructs",
          subSections: [
            {
              title: "Variables and Data Types",
              description:
                "Understanding how to store and manipulate data in programs",
              videoUrl: "https://www.youtube.com/watch?v=Umm1ZQ5ltZw",
            },
            {
              title: "Control Structures",
              description:
                "Working with conditionals and loops to control program flow",
              videoUrl: "https://www.youtube.com/watch?v=mFAaqmj399I",
            },
          ],
        },
        {
          sectionName: "Data Structures and Algorithms",
          subSections: [
            {
              title: "Introduction to Data Structures",
              description: "Understanding arrays, lists, stacks, and queues",
              videoUrl: "https://www.youtube.com/watch?v=bum_19loj9A",
            },
            {
              title: "Basic Algorithms",
              description:
                "Learning sorting, searching, and other fundamental algorithms",
              videoUrl: "https://www.youtube.com/watch?v=kPRA0W1kECg",
            },
          ],
        },
      ],
    },
    {
      courseName: "Git and GitHub: Version Control for Developers",
      courseDescription:
        "Master Git and GitHub for version control, collaboration, and project management. Learn branching, merging, pull requests, and CI/CD integration.",
      whatYouWillLearn:
        "• Understand version control concepts and benefits\n• Master Git commands for daily development\n• Work with branches, merges, and resolving conflicts\n• Collaborate using GitHub pull requests and code reviews\n• Implement GitHub Actions for CI/CD\n• Manage projects with GitHub's project management tools",
      price: 899,
      tag: ["Git", "GitHub", "Version Control", "DevOps"],
      instructions: [
        "Basic command line knowledge helpful",
        "No prior Git experience required",
        "Computer with Git installed",
        "GitHub account",
      ],
      sections: [
        {
          sectionName: "Git Fundamentals",
          subSections: [
            {
              title: "Introduction to Version Control",
              description:
                "Understanding why version control is essential for developers",
              videoUrl: "https://www.youtube.com/watch?v=SWYqp7iY_Tc",
            },
            {
              title: "Basic Git Commands",
              description: "Learning the essential Git commands for daily use",
              videoUrl: "https://www.youtube.com/watch?v=HVsySz-h9r4",
            },
          ],
        },
        {
          sectionName: "Branching and Merging",
          subSections: [
            {
              title: "Working with Branches",
              description: "Creating, switching, and managing branches in Git",
              videoUrl: "https://www.youtube.com/watch?v=e2IbNHi4uCI",
            },
            {
              title: "Merging and Resolving Conflicts",
              description: "Combining changes and handling merge conflicts",
              videoUrl: "https://www.youtube.com/watch?v=JtIX3HJKwfo",
            },
          ],
        },
        {
          sectionName: "GitHub Collaboration",
          subSections: [
            {
              title: "Pull Requests and Code Reviews",
              description:
                "Collaborating with team members using GitHub's tools",
              videoUrl: "https://www.youtube.com/watch?v=rgbCcBNZcdQ",
            },
            {
              title: "GitHub Actions and CI/CD",
              description: "Automating workflows with GitHub Actions",
              videoUrl: "https://www.youtube.com/watch?v=R8_veQiYBjI",
            },
          ],
        },
      ],
    },
  ],
};

// Function to get course templates based on category name
const getCourseTemplatesForCategory = (categoryName) => {
  const lowerCaseName = categoryName.toLowerCase();

  if (
    lowerCaseName.includes("web") ||
    lowerCaseName.includes("frontend") ||
    lowerCaseName.includes("backend")
  ) {
    return courseTemplates.webDev;
  } else if (
    lowerCaseName.includes("data") ||
    lowerCaseName.includes("analytics")
  ) {
    return courseTemplates.dataScience;
  } else if (
    lowerCaseName.includes("mobile") ||
    lowerCaseName.includes("app")
  ) {
    return courseTemplates.mobileDev;
  } else {
    // Default to general coding courses for any other category
    return courseTemplates.default;
  }
};

const BulkCourseCreator = () => {
  const { token } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [createdCourses, setCreatedCourses] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const getCategories = async () => {
      try {
        const result = await fetchCourseCategories();
        if (result?.length > 0) {
          setCategories(result);
          setSelectedCategory(result[0]._id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      }
    };

    getCategories();
  }, []);

  // Function to create a course
  const createCourse = async (courseData, categoryId) => {
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("courseName", courseData.courseName);
      formData.append("courseDescription", courseData.courseDescription);
      formData.append("whatYouWillLearn", courseData.whatYouWillLearn);
      formData.append("price", courseData.price);
      formData.append("tag", JSON.stringify(courseData.tag));
      formData.append("category", categoryId);
      formData.append("instructions", JSON.stringify(courseData.instructions));
      formData.append("status", COURSE_STATUS.PUBLISHED);

      // For demo purposes, we'll use a placeholder image
      // In a real implementation, you would upload actual images
      const response = await fetch(
        "https://via.placeholder.com/800x600/2C333F/FFFFFF?text=Course+Thumbnail"
      );
      const blob = await response.blob();
      const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
      formData.append("thumbnailImage", file);

      // Create the course
      const result = await addCourseDetails(formData, token);

      if (result) {
        // Add sections and subsections
        for (const section of courseData.sections) {
          const sectionResult = await createSection(
            {
              sectionName: section.sectionName,
              courseId: result._id,
            },
            token
          );

          if (sectionResult) {
            const sectionId =
              sectionResult.courseContent[
                sectionResult.courseContent.length - 1
              ]._id;

            // Add subsections to this section
            for (const subsection of section.subSections) {
              const subsectionFormData = new FormData();
              subsectionFormData.append("sectionId", sectionId);
              subsectionFormData.append("title", subsection.title);
              subsectionFormData.append("description", subsection.description);
              subsectionFormData.append("courseId", result._id);

              // For demo purposes, we'll use a video URL instead of uploading a file
              // In a real implementation, you would handle video uploads
              // Create a File object from a small placeholder video
              const response = await fetch(
                "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
              );
              const blob = await response.blob();
              const file = new File([blob], "lecture-video.mp4", {
                type: "video/mp4",
              });
              subsectionFormData.append("videoFile", file);

              // Store the actual YouTube URL in the description for reference
              const updatedDescription = `${subsection.description}\n\nVideo Reference: ${subsection.videoUrl}`;
              subsectionFormData.append("description", updatedDescription);

              await createSubSection(subsectionFormData, token);
            }
          }
        }

        return result;
      }

      return null;
    } catch (error) {
      console.error(`Error creating course ${courseData.courseName}:`, error);
      return null;
    }
  };

  // Function to handle bulk course creation
  const handleCreateCourses = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    setLoading(true);
    setProgress(0);
    setCreatedCourses([]);

    try {
      // Get the selected category
      const category = categories.find((cat) => cat._id === selectedCategory);

      // Get course templates for this category
      const coursesToCreate = getCourseTemplatesForCategory(category.name);

      // Create each course
      const createdCoursesList = [];

      for (let i = 0; i < coursesToCreate.length; i++) {
        const courseData = coursesToCreate[i];

        // Update progress
        setProgress(Math.round((i / coursesToCreate.length) * 100));

        // Create the course
        const result = await createCourse(courseData, selectedCategory);

        if (result) {
          createdCoursesList.push({
            id: result._id,
            name: result.courseName,
            status: "success",
          });
        } else {
          createdCoursesList.push({
            name: courseData.courseName,
            status: "failed",
          });
        }

        // Update the list of created courses
        setCreatedCourses([...createdCoursesList]);
      }

      setProgress(100);
      toast.success(
        `Created ${
          createdCoursesList.filter((c) => c.status === "success").length
        } courses`
      );
    } catch (error) {
      console.error("Error creating courses:", error);
      toast.error("Failed to create courses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <h1 className="text-2xl font-semibold text-richblack-5">
        Bulk Course Creator
      </h1>
      <p className="text-richblack-200">
        This tool allows you to quickly add coding-related courses to a selected
        category.
      </p>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-richblack-5" htmlFor="category">
            Select Category<sup className="text-pink-200">*</sup>
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-style w-full"
            disabled={loading}
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCreateCourses}
          disabled={loading || !selectedCategory}
          className={`flex items-center gap-2 rounded-md py-2 px-5 font-semibold ${
            loading || !selectedCategory
              ? "cursor-not-allowed bg-richblack-500 text-richblack-300"
              : "bg-yellow-50 text-richblack-900"
          }`}
        >
          {loading ? "Creating Courses..." : "Create Courses"}
        </button>

        {loading && (
          <div className="w-full bg-richblack-700 h-2 rounded-full mt-4">
            <div
              className="bg-yellow-50 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {createdCourses.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-richblack-5 mb-4">
              Created Courses
            </h2>
            <div className="space-y-2">
              {createdCourses.map((course, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md flex justify-between items-center ${
                    course.status === "success"
                      ? "bg-richblack-700"
                      : "bg-pink-900 bg-opacity-20"
                  }`}
                >
                  <span className="text-richblack-5">{course.name}</span>
                  <span
                    className={`text-sm ${
                      course.status === "success"
                        ? "text-green-500"
                        : "text-pink-200"
                    }`}
                  >
                    {course.status === "success" ? "Created" : "Failed"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkCourseCreator;
