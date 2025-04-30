# Deploying U Chitkara on Render.com

This guide provides step-by-step instructions for deploying the U Chitkara application on Render.com.

## Prerequisites

Before deploying, make sure you have:

1. A Render.com account
2. A MongoDB Atlas database (or any MongoDB provider)
3. A Cloudinary account for media storage
4. A Razorpay account for payment processing
5. SMTP credentials for email notifications

## Deployment Steps

### 1. Deploy the Backend API Service

1. Log in to your Render.com dashboard
2. Click on "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: u-chitkara-api
   - **Environment**: Node
   - **Region**: Choose a region close to your users
   - **Branch**: main (or your preferred branch)
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm run start`
   - **Plan**: Choose an appropriate plan (Free tier works for testing)

5. Add the following environment variables:
   - `NODE_ENV`: production
   - `PORT`: 10000
   - `MONGODB_URL`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT token generation
   - `MAIL_HOST`: Your SMTP host (e.g., smtp.gmail.com)
   - `MAIL_USER`: Your email address
   - `MAIL_PASS`: Your email password or app password
   - `RAZORPAY_KEY`: Your Razorpay key
   - `RAZORPAY_SECRET`: Your Razorpay secret
   - `CLOUD_NAME`: Your Cloudinary cloud name
   - `API_KEY`: Your Cloudinary API key
   - `API_SECRET`: Your Cloudinary API secret
   - `CONTACT_MAIL`: Email address for contact form submissions
   - `JUDGE0_API_KEY`: Your Judge0 API key (if using code execution)
   - `CORS_ORIGIN`: `["https://u-chitkara.onrender.com"]`

6. Click "Create Web Service"

### 2. Deploy the Frontend Service

1. In your Render.com dashboard, click on "New" and select "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: u-chitkara
   - **Branch**: main (or your preferred branch)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: build
   - **Plan**: Choose an appropriate plan (Free tier works for testing)

4. Add the following environment variables:
   - `REACT_APP_BASE_URL`: https://u-chitkara-api.onrender.com/api/v1
   - `REACT_APP_RAZORPAY_KEY_ID`: Your Razorpay key ID

5. Click "Create Static Site"

### 3. Configure Custom Domain (Optional)

1. In your Render.com dashboard, select your deployed service
2. Go to the "Settings" tab
3. Scroll down to "Custom Domain"
4. Click "Add Custom Domain" and follow the instructions

## Troubleshooting

If you encounter issues during deployment:

1. Check the logs in the Render.com dashboard
2. Verify that all environment variables are correctly set
3. Ensure your MongoDB database is accessible from Render.com
4. Check that your Cloudinary and Razorpay credentials are correct

## Maintenance

To update your deployed application:

1. Push changes to your GitHub repository
2. Render will automatically rebuild and deploy your application

## Scaling

As your application grows:

1. Upgrade your Render.com plan for better performance
2. Consider using a CDN for static assets
3. Optimize your database queries and implement caching
4. Monitor your application's performance and make adjustments as needed
