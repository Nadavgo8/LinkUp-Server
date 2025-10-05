# LinkUp Server 🚀

## Overview

LinkUp Server is the backend component of the LinkUp social networking platform - an advanced social media application designed for connecting users and sharing content. The server is built with Node.js and provides a comprehensive API for user management, connections, events, and real-time communication.

## Features

- User authentication (JWT)
- User profiles and updates
- Social connections (match/pass)
- Event creation and discovery
- Real-time chat (Stream Chat API)
- File uploads (Cloudinary)
- Geolocation-based user discovery

## Project Structure

```
src/
  app.js                # Express app setup
  index.js              # Entry point
  config/               # Configuration files
    cloudinary.js
    db.js
  controllers/          # Route handlers
    authController.js
    connectionsController.js
    eventController.js
    profilesController.js
    uesrController.js
  middlewares/          # Express middlewares
    authMiddleware.js
    upload.js
  models/               # Mongoose models
    Connection.js
    Events.js
    User.js
  routes/               # API routes
    authRoutes.js
    chat.js
    chatRoutes.js
    connectionRoutes.js
    eventRoutes.js
    profilesRoutes.js
    streamRoutes.js
    userRoutes.js
  services/
    chatService.js      # Chat/DM logic
  utils/
    dmChannelId.js      # Utility for DM channel IDs
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Cloudinary account
- Stream Chat account

### Setup

1. Clone the repository
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   ```
4. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login
- `GET /user/profile` - Get current user profile
- `PUT /user/profile` - Update profile
- `GET /user/:id` - Get another user's profile
- `PUT /user/change-password` - Change password
- `POST /user/upload-id` - Upload ID document
- `GET /profile/discover` - Discover users nearby
- `GET /profile/searchbuddy` - Find users with similar goals
- `POST /connections/:targetId` - Match/pass another user
- `GET /events/events` - List events
- `POST /events/events` - Create event
- `POST /api/stream/token` - Get Stream Chat token
- `POST /api/chat/ensure-dm` - Ensure DM channel

## License

MIT
