// Script to add coding-related courses to all categories
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Base URL for API calls
const BASE_URL = 'http://localhost:4000/api/v1';

// Course templates for different categories
const courseTemplates = {
  // Web Development courses
  webDev: [
    {
      courseName: "Modern JavaScript: From Fundamentals to Advanced",
      courseDescription: "Master JavaScript from the ground up. Learn ES6+, async/await, closures, and build real-world applications with modern JavaScript practices.",
      whatYouWillLearn: "• Understand JavaScript fundamentals and advanced concepts\n• Work with ES6+ features including arrow functions, destructuring, and modules\n• Master asynchronous programming with Promises and async/await\n• Build real-world applications with modern JavaScript practices\n• Understand closures, prototypes, and the 'this' keyword\n• Implement functional programming concepts in JavaScript",
      price: 1299,
      tag: ["JavaScript", "Web Development", "Frontend", "Programming"],
      instructions: [
        "Basic understanding of HTML and CSS",
        "No prior JavaScript knowledge required",
        "Computer with internet connection",
        "Code editor (VS Code recommended)"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/javascript.jpg"
    },
    {
      courseName: "React.js: Building Modern User Interfaces",
      courseDescription: "Learn to build dynamic, responsive web applications with React.js. Master hooks, context API, Redux, and create production-ready applications.",
      whatYouWillLearn: "• Build complete React applications from scratch\n• Master React Hooks for state management\n• Implement Context API and Redux for complex state\n• Create reusable components and custom hooks\n• Optimize React applications for performance\n• Deploy React applications to production",
      price: 1499,
      tag: ["React", "JavaScript", "Frontend", "Web Development"],
      instructions: [
        "Basic JavaScript knowledge required",
        "Understanding of HTML and CSS",
        "Familiarity with ES6+ features is helpful",
        "Node.js installed on your computer"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/react.jpg"
    }
  ],
  
  // Data Science courses
  dataScience: [
    {
      courseName: "Python for Data Science and Machine Learning",
      courseDescription: "Comprehensive course on using Python for data analysis, visualization, and machine learning. Learn NumPy, Pandas, Matplotlib, Scikit-Learn, and TensorFlow.",
      whatYouWillLearn: "• Master Python libraries for data science: NumPy, Pandas, Matplotlib\n• Implement machine learning algorithms with Scikit-Learn\n• Build neural networks with TensorFlow and Keras\n• Perform data cleaning, preprocessing, and feature engineering\n• Create compelling data visualizations\n• Develop end-to-end machine learning projects",
      price: 1699,
      tag: ["Python", "Data Science", "Machine Learning", "AI"],
      instructions: [
        "Basic Python knowledge recommended",
        "No prior data science experience required",
        "Computer with at least 8GB RAM",
        "Jupyter Notebook or Google Colab account"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/python-data-science.jpg"
    },
    {
      courseName: "SQL Mastery: Database Design and Optimization",
      courseDescription: "Learn SQL from basics to advanced concepts. Design efficient databases, write complex queries, and optimize database performance for real-world applications.",
      whatYouWillLearn: "• Design normalized database schemas\n• Write complex SQL queries with joins, subqueries, and window functions\n• Optimize database performance with indexing and query tuning\n• Implement transactions and understand ACID properties\n• Work with stored procedures, triggers, and views\n• Connect databases to applications",
      price: 1299,
      tag: ["SQL", "Database", "Data Engineering", "Backend"],
      instructions: [
        "No prior SQL or database knowledge required",
        "Basic understanding of data structures helpful",
        "Computer with MySQL or PostgreSQL installed",
        "Willingness to practice with exercises"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/sql.jpg"
    }
  ],
  
  // Mobile Development courses
  mobileDev: [
    {
      courseName: "React Native: Build Mobile Apps for iOS and Android",
      courseDescription: "Learn to build native mobile applications for both iOS and Android using React Native. Master navigation, state management, and native device features.",
      whatYouWillLearn: "• Build cross-platform mobile apps with a single codebase\n• Implement navigation with React Navigation\n• Manage state with Redux and Context API\n• Access native device features like camera and location\n• Style applications with styled-components\n• Deploy apps to the App Store and Google Play",
      price: 1599,
      tag: ["React Native", "Mobile Development", "iOS", "Android"],
      instructions: [
        "React.js knowledge recommended",
        "JavaScript/ES6+ understanding required",
        "Mac for iOS development (optional)",
        "Android Studio or Xcode installed"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/react-native.jpg"
    },
    {
      courseName: "Flutter Development: Beautiful Native Apps",
      courseDescription: "Master Flutter and Dart to build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
      whatYouWillLearn: "• Build engaging user interfaces with Flutter widgets\n• Manage state with Provider, Bloc, and Riverpod\n• Implement navigation and routing\n• Connect to REST APIs and Firebase\n• Use native device features\n• Deploy to multiple platforms",
      price: 1499,
      tag: ["Flutter", "Dart", "Mobile Development", "Cross-platform"],
      instructions: [
        "No prior Flutter or Dart knowledge needed",
        "Basic programming concepts understanding",
        "Computer with Flutter SDK installed",
        "Android Studio or VS Code"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/flutter.jpg"
    }
  ],
  
  // Game Development courses
  gameDev: [
    {
      courseName: "Unity Game Development: 2D and 3D Games",
      courseDescription: "Learn to create engaging 2D and 3D games with Unity. Master C# programming, game physics, animations, and publish games to multiple platforms.",
      whatYouWillLearn: "• Program game mechanics with C#\n• Implement game physics and collisions\n• Create animations and visual effects\n• Design game levels and user interfaces\n• Optimize game performance\n• Publish games to mobile, desktop, and web platforms",
      price: 1799,
      tag: ["Unity", "C#", "Game Development", "3D"],
      instructions: [
        "No prior Unity or C# knowledge required",
        "Basic understanding of programming concepts",
        "Computer that meets Unity's system requirements",
        "Unity Hub and Unity Editor installed"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/unity.jpg"
    },
    {
      courseName: "Unreal Engine: Create AAA-Quality Games",
      courseDescription: "Master Unreal Engine to create high-quality games. Learn Blueprints visual scripting, C++, materials, lighting, and advanced game systems.",
      whatYouWillLearn: "• Create game mechanics with Blueprints and C++\n• Design realistic materials and environments\n• Implement advanced lighting and post-processing\n• Create character animations and AI\n• Optimize games for performance\n• Deploy games to multiple platforms",
      price: 1899,
      tag: ["Unreal Engine", "C++", "Game Development", "3D"],
      instructions: [
        "No prior Unreal Engine experience needed",
        "Basic programming knowledge helpful",
        "Computer with dedicated GPU recommended",
        "Unreal Engine installed"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/unreal.jpg"
    }
  ],
  
  // Cybersecurity courses
  cybersecurity: [
    {
      courseName: "Ethical Hacking and Penetration Testing",
      courseDescription: "Learn ethical hacking methodologies and tools to identify and exploit vulnerabilities in systems. Master penetration testing and secure systems against attacks.",
      whatYouWillLearn: "• Understand the ethical hacking methodology\n• Perform reconnaissance and scanning\n• Exploit vulnerabilities in web applications\n• Conduct network penetration testing\n• Use popular tools like Metasploit, Burp Suite, and Wireshark\n• Write professional penetration testing reports",
      price: 1799,
      tag: ["Cybersecurity", "Ethical Hacking", "Penetration Testing", "Network Security"],
      instructions: [
        "Basic networking knowledge required",
        "Understanding of operating systems",
        "Computer with virtualization capabilities",
        "Kali Linux VM recommended"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/ethical-hacking.jpg"
    },
    {
      courseName: "Secure Coding Practices for Developers",
      courseDescription: "Learn to write secure code and protect applications from common vulnerabilities. Master OWASP Top 10, secure authentication, and secure API development.",
      whatYouWillLearn: "• Identify and prevent OWASP Top 10 vulnerabilities\n• Implement secure authentication and authorization\n• Protect against XSS, CSRF, and SQL injection\n• Secure API endpoints\n• Perform security code reviews\n• Integrate security into the development lifecycle",
      price: 1499,
      tag: ["Secure Coding", "Application Security", "Web Security", "OWASP"],
      instructions: [
        "Programming experience required",
        "Web development knowledge recommended",
        "Understanding of HTTP and APIs",
        "Computer with code editor"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/secure-coding.jpg"
    }
  ],
  
  // Cloud Computing courses
  cloudComputing: [
    {
      courseName: "AWS Certified Solutions Architect",
      courseDescription: "Comprehensive course to prepare for the AWS Certified Solutions Architect exam. Learn to design and deploy scalable, highly available systems on AWS.",
      whatYouWillLearn: "• Design scalable, fault-tolerant architectures\n• Implement security controls and data protection\n• Deploy networking and content delivery solutions\n• Design cost-optimized architectures\n• Implement automation with CloudFormation\n• Pass the AWS Certified Solutions Architect exam",
      price: 1899,
      tag: ["AWS", "Cloud Computing", "Solutions Architecture", "DevOps"],
      instructions: [
        "Basic IT knowledge required",
        "Understanding of networking concepts",
        "AWS Free Tier account",
        "Computer with internet connection"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/aws.jpg"
    },
    {
      courseName: "Docker and Kubernetes for Developers",
      courseDescription: "Master containerization with Docker and orchestration with Kubernetes. Learn to deploy, scale, and manage containerized applications in production.",
      whatYouWillLearn: "• Create and manage Docker containers\n• Build efficient Docker images\n• Deploy applications with Docker Compose\n• Set up Kubernetes clusters\n• Implement deployments, services, and ingress\n• Configure persistent storage and secrets",
      price: 1699,
      tag: ["Docker", "Kubernetes", "DevOps", "Containerization"],
      instructions: [
        "Basic command line knowledge",
        "Understanding of web applications",
        "Computer with Docker installed",
        "Minikube or kind for local Kubernetes"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/docker-kubernetes.jpg"
    }
  ],
  
  // Artificial Intelligence courses
  ai: [
    {
      courseName: "Deep Learning Specialization",
      courseDescription: "Comprehensive deep learning course covering neural networks, CNN, RNN, and transformers. Build and train models for computer vision, NLP, and more.",
      whatYouWillLearn: "• Build and train neural networks from scratch\n• Implement convolutional networks for computer vision\n• Create recurrent networks for sequence modeling\n• Master transformer architectures for NLP\n• Optimize models with regularization and tuning\n• Deploy models to production",
      price: 1999,
      tag: ["Deep Learning", "Neural Networks", "AI", "Machine Learning"],
      instructions: [
        "Python programming knowledge required",
        "Basic understanding of linear algebra and calculus",
        "Computer with GPU access recommended",
        "Google Colab or Jupyter Notebook"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/deep-learning.jpg"
    },
    {
      courseName: "Natural Language Processing with Python",
      courseDescription: "Learn to process and analyze text data, build language models, and create applications like chatbots, sentiment analysis, and text summarization.",
      whatYouWillLearn: "• Process and clean text data\n• Implement text classification and sentiment analysis\n• Build language models with transformers\n• Create chatbots and conversational AI\n• Perform named entity recognition\n• Implement text summarization and translation",
      price: 1799,
      tag: ["NLP", "Python", "AI", "Machine Learning"],
      instructions: [
        "Python programming experience",
        "Basic machine learning knowledge",
        "Computer with at least 8GB RAM",
        "Google Colab or local environment"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/nlp.jpg"
    }
  ],
  
  // Blockchain courses
  blockchain: [
    {
      courseName: "Blockchain Development with Ethereum",
      courseDescription: "Learn to build decentralized applications (DApps) on the Ethereum blockchain. Master Solidity, smart contracts, and web3 integration.",
      whatYouWillLearn: "• Write smart contracts with Solidity\n• Test and deploy contracts to Ethereum\n• Build frontend interfaces with web3.js or ethers.js\n• Implement token standards like ERC-20 and ERC-721\n• Create decentralized finance (DeFi) applications\n• Secure smart contracts against vulnerabilities",
      price: 1899,
      tag: ["Blockchain", "Ethereum", "Solidity", "Smart Contracts"],
      instructions: [
        "JavaScript knowledge required",
        "Basic understanding of blockchain concepts",
        "Computer with Node.js installed",
        "MetaMask wallet and test ETH"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/ethereum.jpg"
    },
    {
      courseName: "Web3 Development: Building the Decentralized Future",
      courseDescription: "Comprehensive course on Web3 development across multiple blockchains. Learn to build DApps, NFT marketplaces, and decentralized protocols.",
      whatYouWillLearn: "• Develop across multiple blockchain platforms\n• Create NFT collections and marketplaces\n• Build decentralized finance applications\n• Implement cross-chain functionality\n• Integrate with wallets and identity solutions\n• Deploy and monitor decentralized applications",
      price: 1999,
      tag: ["Web3", "Blockchain", "DApps", "NFT"],
      instructions: [
        "JavaScript and React knowledge required",
        "Basic blockchain understanding",
        "Computer with development environment",
        "Crypto wallets for testing"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/web3.jpg"
    }
  ],
  
  // DevOps courses
  devOps: [
    {
      courseName: "CI/CD Pipeline Implementation with Jenkins",
      courseDescription: "Master continuous integration and continuous deployment with Jenkins. Automate building, testing, and deploying applications in a DevOps environment.",
      whatYouWillLearn: "• Set up and configure Jenkins\n• Create automated build pipelines\n• Implement automated testing\n• Configure deployment automation\n• Integrate with Git and other tools\n• Implement Jenkins as code with Pipeline DSL",
      price: 1599,
      tag: ["DevOps", "CI/CD", "Jenkins", "Automation"],
      instructions: [
        "Basic understanding of software development",
        "Familiarity with Git",
        "Computer with Jenkins installed",
        "Basic command line knowledge"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/jenkins.jpg"
    },
    {
      courseName: "Infrastructure as Code with Terraform",
      courseDescription: "Learn to provision and manage infrastructure using Terraform. Implement infrastructure as code practices for AWS, Azure, and Google Cloud.",
      whatYouWillLearn: "• Write Terraform configurations\n• Manage state and environments\n• Implement modules for reusability\n• Provision resources across multiple cloud providers\n• Implement best practices for IaC\n• Automate infrastructure deployment",
      price: 1699,
      tag: ["Terraform", "Infrastructure as Code", "DevOps", "Cloud"],
      instructions: [
        "Basic cloud computing knowledge",
        "Understanding of infrastructure concepts",
        "Computer with Terraform installed",
        "Cloud provider accounts (AWS/Azure/GCP)"
      ],
      thumbnailPath: "src/assets/Images/course-thumbnails/terraform.jpg"
    }
  ]
};

// Function to get all categories
async function getCategories() {
  try {
    const response = await axios.get(`${BASE_URL}/course/showAllCategories`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    return [];
  }
}

// Function to create a course
async function createCourse(courseData, token, categoryId) {
  try {
    const formData = new FormData();
    
    // Append course data to formData
    formData.append('courseName', courseData.courseName);
    formData.append('courseDescription', courseData.courseDescription);
    formData.append('whatYouWillLearn', courseData.whatYouWillLearn);
    formData.append('price', courseData.price);
    formData.append('tag', JSON.stringify(courseData.tag));
    formData.append('category', categoryId);
    formData.append('instructions', JSON.stringify(courseData.instructions));
    formData.append('status', 'Published');
    
    // Read and append thumbnail image
    const thumbnailBuffer = fs.readFileSync(path.resolve(courseData.thumbnailPath));
    formData.append('thumbnailImage', thumbnailBuffer, path.basename(courseData.thumbnailPath));
    
    const response = await axios.post(`${BASE_URL}/course/createCourse`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error creating course ${courseData.courseName}:`, error.message);
    return null;
  }
}

// Function to add sections to a course
async function addSectionToCourse(courseId, sectionName, token) {
  try {
    const response = await axios.post(`${BASE_URL}/course/addSection`, {
      sectionName,
      courseId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data.updatedCourse;
  } catch (error) {
    console.error(`Error adding section to course:`, error.message);
    return null;
  }
}

// Function to add subsection to a section
async function addSubsectionToSection(sectionId, courseId, title, description, videoUrl, token) {
  try {
    const formData = new FormData();
    formData.append('sectionId', sectionId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('courseId', courseId);
    
    // If videoUrl is a local file path, read it and append
    if (fs.existsSync(videoUrl)) {
      const videoBuffer = fs.readFileSync(path.resolve(videoUrl));
      formData.append('videoFile', videoBuffer, path.basename(videoUrl));
    } else {
      // If it's a URL, we need to download it first or handle differently
      console.log(`Video URL provided: ${videoUrl}. Handling as external URL.`);
      // Implementation for handling external URLs would go here
    }
    
    const response = await axios.post(`${BASE_URL}/course/addSubSection`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error adding subsection:`, error.message);
    return null;
  }
}

// Main function to add courses to all categories
async function addCoursesToAllCategories() {
  try {
    // Get all categories
    const categories = await getCategories();
    console.log(`Found ${categories.length} categories`);
    
    // Get admin token (you would need to implement login functionality)
    const token = 'YOUR_ADMIN_TOKEN_HERE'; // Replace with actual token
    
    // For each category, add relevant courses
    for (const category of categories) {
      console.log(`Adding courses to category: ${category.name}`);
      
      // Determine which course template to use based on category name
      let coursesToAdd = [];
      
      switch(category.name.toLowerCase()) {
        case 'web development':
          coursesToAdd = courseTemplates.webDev;
          break;
        case 'data science':
          coursesToAdd = courseTemplates.dataScience;
          break;
        case 'mobile development':
          coursesToAdd = courseTemplates.mobileDev;
          break;
        case 'game development':
          coursesToAdd = courseTemplates.gameDev;
          break;
        case 'cybersecurity':
          coursesToAdd = courseTemplates.cybersecurity;
          break;
        case 'cloud computing':
          coursesToAdd = courseTemplates.cloudComputing;
          break;
        case 'artificial intelligence':
          coursesToAdd = courseTemplates.ai;
          break;
        case 'blockchain':
          coursesToAdd = courseTemplates.blockchain;
          break;
        case 'devops':
          coursesToAdd = courseTemplates.devOps;
          break;
        default:
          // For any other category, use web development courses as default
          coursesToAdd = courseTemplates.webDev;
      }
      
      // Add courses to this category
      for (const courseData of coursesToAdd) {
        console.log(`Creating course: ${courseData.courseName}`);
        
        // Create the course
        const courseResult = await createCourse(courseData, token, category._id);
        
        if (courseResult && courseResult.success) {
          const courseId = courseResult.data._id;
          console.log(`Course created with ID: ${courseId}`);
          
          // Add sections and subsections
          // This is a simplified example - you would need to customize this for each course
          const section1 = await addSectionToCourse(courseId, 'Introduction', token);
          const section2 = await addSectionToCourse(courseId, 'Fundamentals', token);
          const section3 = await addSectionToCourse(courseId, 'Advanced Topics', token);
          
          if (section1) {
            const section1Id = section1.courseContent[section1.courseContent.length - 1]._id;
            await addSubsectionToSection(
              section1Id, 
              courseId, 
              'Course Overview', 
              'An overview of what you will learn in this course', 
              'path/to/video1.mp4', 
              token
            );
            
            await addSubsectionToSection(
              section1Id, 
              courseId, 
              'Setting Up Your Environment', 
              'Learn how to set up your development environment', 
              'path/to/video2.mp4', 
              token
            );
          }
          
          if (section2) {
            const section2Id = section2.courseContent[section2.courseContent.length - 1]._id;
            await addSubsectionToSection(
              section2Id, 
              courseId, 
              'Core Concepts', 
              'Understanding the fundamental concepts', 
              'path/to/video3.mp4', 
              token
            );
            
            await addSubsectionToSection(
              section2Id, 
              courseId, 
              'Building Your First Project', 
              'Step-by-step guide to building your first project', 
              'path/to/video4.mp4', 
              token
            );
          }
          
          if (section3) {
            const section3Id = section3.courseContent[section3.courseContent.length - 1]._id;
            await addSubsectionToSection(
              section3Id, 
              courseId, 
              'Advanced Techniques', 
              'Learn advanced techniques and best practices', 
              'path/to/video5.mp4', 
              token
            );
            
            await addSubsectionToSection(
              section3Id, 
              courseId, 
              'Final Project', 
              'Build a comprehensive final project', 
              'path/to/video6.mp4', 
              token
            );
          }
          
          console.log(`Completed adding content to course: ${courseData.courseName}`);
        } else {
          console.error(`Failed to create course: ${courseData.courseName}`);
        }
      }
    }
    
    console.log('Finished adding courses to all categories');
  } catch (error) {
    console.error('Error in addCoursesToAllCategories:', error.message);
  }
}

// Execute the main function
addCoursesToAllCategories();
