# Rwanda Citizen Complaints and Engagement System

A digital platform enabling Rwandan citizens to submit and track complaints about public services while allowing government institutions to manage and respond to them effectively.

## Features

### Citizen Portal
- Submit complaints with ticket tracking
- Upload supporting images
- Track complaint status
- View official responses

### Admin Portal
- Secure admin dashboard
- Manage and respond to complaints
- Filter complaints by category/status
- Update complaint status

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads

### Frontend
- React 19
- Tailwind CSS
- Axios for API calls

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Environment Setup
1. Clone the repository
2. Copy `.env.example` to `.env` and update the values
3. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

### Running the Application
1. Start MongoDB service
2. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```
3. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```
4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## API Documentation

### Authentication Endpoints
- POST /api/auth/login
- POST /api/auth/logout

### Complaint Endpoints
- POST /api/complaints
- GET /api/complaints
- GET /api/complaints/:id
- PUT /api/complaints/:id
- GET /api/complaints/track/:ticketId

## Security
- JWT tokens stored in HTTP-only cookies
- Password hashing using bcrypt
- Input validation and sanitization
- Protected admin routes

## Project Structure
```
.
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── utils/
    └── public/
```

## Contributing
This is an MVP project. For contributions, please open an issue first to discuss proposed changes.

## License
MIT 