# U Chitkara

U Chitkara is a comprehensive Educational Technology platform developed specifically for Chitkara University using the MERN stack by Sanjay Mandal in 2025. This platform aims to enhance the learning experience for students and provide powerful teaching tools for instructors.

## About

U Chitkara serves as the central hub for all educational activities at Chitkara University. It provides a seamless interface for course management, student enrollment, content delivery, and performance tracking. The platform is designed to support the university's commitment to providing high-quality education through technology-enabled learning.

---

## Key Features

- **University-Specific Authentication**: U Chitkara provides secure user registration and authentication using JWT (JSON Web Tokens) integrated with Chitkara University's student and faculty databases. Users can sign up, log in, and manage their profiles with ease.

- **Comprehensive Course Management**: Faculty members can create and manage courses aligned with Chitkara University's curriculum. Students can access course materials, submit assignments, and participate in discussions all in one place.

- **Advanced Progress Tracking**: The platform offers detailed progress tracking for students, allowing them to monitor their academic journey through interactive dashboards. Faculty can track student engagement and performance metrics.

- **Secure Payment System**: U Chitkara integrates with Razorpay for processing various university-related payments including course fees, event registrations, and other services using multiple payment methods.

- **Intelligent Search**: The platform features an advanced search system that helps users quickly find courses, resources, faculty information, and university announcements.

- **Analytics Dashboard**: Faculty and administrators have access to comprehensive analytics dashboards that provide insights into student performance, course effectiveness, and engagement metrics. These visualizations help in data-driven decision making for improving educational outcomes.

- **University Calendar Integration**: The platform synchronizes with the university's academic calendar, automatically displaying important dates, events, and deadlines for students and faculty.

---

## Platform Interface

![U Chitkara Dashboard](https://github.com/himanshu8443/Study-Notion-master/assets/99420590/0cba8d5b-6a47-4721-ac9f-4279107c257e)
_Main dashboard showing course catalog and student progress metrics_

![U Chitkara Course View](https://github.com/himanshu8443/Study-Notion-master/assets/99420590/62c33b56-0bd5-4330-b1db-d41b80d9f69f)
_Course view with interactive learning materials and progress tracking_

<details>
  <summary>Additional Views</summary>

![U Chitkara Analytics Dashboard](https://github.com/himanshu8443/Study-Notion-master/assets/99420590/63f7163d-a74a-4e78-bc78-6b96b06073f9)
_Faculty analytics dashboard showing student performance metrics_

![U Chitkara Mobile View](https://github.com/himanshu8443/Study-Notion-master/assets/99420590/59d1d8c2-2824-45bb-a2f7-6f5dc234895c)
_Responsive mobile interface for on-the-go learning_

</details>

---

## Technical Information

- **Architecture**: The platform follows a microservices architecture with the backend located in the server folder.
- **Course Management**: Before adding courses, administrators must create course categories (e.g., Engineering, Business, Computer Science, etc.) through the admin panel.
- **Administrative Access**: To create an administrator account, first register as a faculty member, then update the 'accountType' field to 'Admin' in the users collection of the database.
- **Customization**: The platform is designed to be customizable to accommodate Chitkara University's specific academic structure and branding requirements.

## Deployment Guide

1. Clone the repository to your local machine.

   ```sh
   git clone https://github.com/sanjaymandal/U-Chitkara.git
   ```

2. Install the required packages.

   ```sh
   cd U-Chitkara
   npm install

   cd server
   npm install
   ```

3. Configure the environment:

   Create a `.env` file in both the root directory and `/server` folder.
   Configure the following essential variables:

   - `MONGODB_URL`: Connection string for your MongoDB database
   - `JWT_SECRET`: Secret key for JWT authentication
   - `MAIL_HOST`: SMTP host for email notifications
   - `RAZORPAY_KEY_ID` and `RAZORPAY_SECRET`: For payment processing
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`: For media storage

   Refer to `.env.example` files for a complete list of required variables.

4. Start the development server.

   ```sh
   npm run dev
   ```

5. Access the platform at [`http://localhost:3000`](http://localhost:3000).

## Technology Stack

- **Frontend**: React.js, Redux for state management, Tailwind CSS for styling
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Payment Processing**: Razorpay
- **Deployment**: Render.com, Docker, AWS/Azure

## Deployment on Render.com

U Chitkara can be easily deployed on Render.com. For detailed deployment instructions, see [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md).

### Quick Deployment Steps

1. Create a Render account and connect your GitHub repository
2. Deploy the backend as a Web Service:
   - Build command: `cd server && npm install`
   - Start command: `cd server && npm run start`
3. Deploy the frontend as a Static Site:
   - Build command: `npm install && npm run build`
   - Publish directory: `build`
4. Set up all required environment variables in the Render dashboard

## Contributing

Contributions to improve U Chitkara are welcome. Please follow the standard fork-and-pull request workflow. Contact Sanjay Mandal for more information on how to contribute to this project.
