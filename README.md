# LinkUp Server 🚀

## Overview

LinkUp Server is the backend component of the LinkUp social networking platform - an advanced social media application designed for connecting users and sharing content. The server is built with Node.js and provides a comprehensive API for user management, connections, events, and real-time communication.

## ✨ Key Features

- **Authentication & Security**: Secure login system with JWT tokens
- **User Management**: User profiles, updates, and verification
- **Social Connections**: Friend system and user following
- **Event System**: Create and manage social events
- **Real-time Communication**: Live chat and streaming capabilities
- **File Upload**: Full media upload support
- **Data Management**: Advanced database models and relationships

## 🏗️ Project Structure

```
src/
├── config/           # Configuration files
│   ├── cloudinary.js # Cloud storage configuration
│   └── db.js        # Database connection setup
├── controllers/      # Route handlers and business logic
│   ├── authController.js
│   ├── connectionsController.js
│   ├── profilesController.js
│   └── userController.js
├── middlewares/      # Custom middleware functions
│   ├── authMiddleware.js
│   └── uploadd.js
├── models/          # Database models
│   ├── Connection.js
│   └── User.js
├── routes/          # API route definitions
│   ├── authRoutes.js
│   ├── chatRoutes.js
│   ├── connectionRoutes.js
│   ├── profilesRoutes.js
│   ├── streamRoutes.js
│   └── userRoutes.js
└── utils/           # Utility functions
│     └──dmChannelId.js
├── index.js
└── app.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database
- Cloudinary account (for media storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd linkup-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get specific user

### Connections

- `GET /api/connections` - Get user connections
- `POST /api/connections/send` - Send connection request
- `PUT /api/connections/accept` - Accept connection request

### Events

- `GET /api/events` - Get events
- `PUT /api/events/:id` - Update event

### Chat & Streaming

- `GET /api/chat/messages` - Get chat messages
- `POST /api/chat/send` - Send message
- `GET /api/stream/rooms` - Get streaming rooms

## 🛠️ Technologies Used

- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Cloudinary
- **Real-time Communication**: Socket.io
- **Security**: bcrypt, helmet, cors
- **Development Tools**: nodemon, dotenv

## 🔧 Configuration

### Database Models

**User Model**

- Profile information (name, email, bio, avatar)
- Authentication credentials
- Account settings and preferences

**Connection Model**

- Friend relationships between users
- Connection status (pending, accepted, blocked)

**Event Model**

- Event details (title, description, date, location)
- Participant management
- Event categories and tags

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation and sanitization
- CORS configuration
- Rate limiting
- File upload security

## 📝 Development

### Code Style

- ES6+ JavaScript features
- Async/await for asynchronous operations
- Modular architecture with separation of concerns
- RESTful API design principles

---

**LinkUp Server** - Connecting people, creating experiences 🌐
