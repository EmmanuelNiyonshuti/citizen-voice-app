# Rwanda  Citizen Complaints and Engagement MVP

A minimal, web-based platform enabling Rwandan citizens to report complaints about public services and receive responses from public institutions. Built as a proof-of-concept for improving government accountability and civic feedback loops.

🔗 **Live Demo**: [https://citizen-voice-app.vercel.app](https://citizen-voice-app.vercel.app)

## Features

### 👥 For Citizens
-  Submit complaints or feedback through a simple web form

-  Upload supporting images (optional)

-  Receive a unique ticket ID to track complaint progress

### 🛡️ For Administrators
-  Secure login to access the admin portal

-  View submitted complaints and basic details

-  Update complaint status (e.g., “In Progress”, “Resolved”)

   ⚠️ Note: Filtering, response history, and advanced analytics are out of scope for this MVP.

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads

### Frontend
- React 18
- Tailwind CSS
- Axios for API calls

## Project Structure
```bash
civic-voice-app/
├── backend/       # Node.js + Express API with MongoDB
├── frontend/      # React web app for both citizens and admins

```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas (cloud) or local MongoDB instance (v6+)
- npm or yarn

### Environment Setup
1. Clone the repository
```bash
   git clone https://github.com/your-username/civic-voice-app.git

   cd civic-voice-app
   ```

2. configure environment variables
   -  copy the example files
   ```bash
      cp backend/.env.example backend/.env
      cp frontend/.env.example frontend/.env

   ```
   -  Update values inside both .env files:

      * In `backend/.env`, set your `MONGODB_URI`, `PORT`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, etc.

      * In `frontend/.env`, set the `VITE_API_BASE_URL` to match the backend (e.g., `http://localhost:3000`)

3. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

### Running the Application Locally
1. Start the backend

   ```bash
   cd backend
   npm run dev

2. Start the frontend

   ```bash
   cd ../frontend
   npm run dev
   ```
3. Open in browser

   Citizen interface: http://localhost:5173

   Backend API: http://localhost:3000

🧪 Optional: Run the seed script to create a default admin account:

   ```bash
   cd backend
   npm run seed
   npm run seed:agencies
   ```
## Future Improvements
This project was developed in a short timeframe during a hackathon, and there's plenty of room for enhancements, including:

1. Multi-language support for wider accessibility

2. Location tagging using maps to pinpoint issue locations

3. Email/SMS notifications for ticket updates

4. Analytics dashboard for insights on recurring issues

5. AI-powered categorization of complaints using NLP

## Author
EmmanuelNiyonshuti - [Twitter](https://x.com/NIYONSH77028058) / [Github](https://github.com/EmmanuelNiyonshuti)

Feel free to reach out with feedback, suggestions, or ideas for improvement [Email](mailto:emmanuelniyonshuti13@gmail.com)

