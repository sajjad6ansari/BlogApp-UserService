# BlogApp User Service

A comprehensive user management microservice built with Node.js, Express, TypeScript, and MongoDB. This service handles user authentication, profile management, and integrates with Google OAuth 2.0 for social login capabilities.

## 🚀 Features

### Authentication & Authorization
- **Dual Authentication**: Support for both traditional email/password and Google OAuth 2.0
- **JWT Security**: Secure token-based authentication with 5-day expiration
- **Password Encryption**: bcrypt hashing for secure password storage
- **Protected Routes**: Middleware-based route protection

### User Management
- **Profile Management**: Complete CRUD operations for user profiles
- **Image Upload**: Cloudinary integration for profile picture management
- **Social Links**: Support for Instagram, Facebook, and LinkedIn profiles
- **Bio Management**: User biography and personal information

### Security Features
- **Input Validation**: Comprehensive request validation
- **CORS Support**: Cross-origin resource sharing configuration
- **Error Handling**: Centralized error handling with try-catch wrappers
- **JWT Verification**: Secure token validation middleware

## 🛠️ Tech Stack

### Backend Framework
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript 5.8+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Google OAuth 2.0

### Key Dependencies
- **Authentication**: `jsonwebtoken`, `bcryptjs`, `googleapis`
- **File Upload**: `multer`, `cloudinary`, `datauri`
- **Database**: `mongoose`
- **Security**: `cors`
- **Development**: `concurrently`, `nodemon`

### Containerization
- **Docker**: Multi-stage Docker build for optimized production images
- **Docker Hub**: [sajjad6ansari/user_service](https://hub.docker.com/repository/docker/sajjad6ansari/user_service)
- **Base Image**: Node.js 22 Alpine for lightweight containers
- **Build Strategy**: Separate build and runtime stages for smaller images

## 📁 Project Structure

```
src/
├── server.ts                 # Application entry point
├── controllers/
│   ├── user.ts              # User profile operations
│   └── auth/
│       └── auth.ts          # Authentication handlers
├── middleware/
│   ├── isAuth.ts            # JWT authentication middleware
│   └── multer.ts            # File upload middleware
├── model/
│   └── User.ts              # User schema and interfaces
├── routes/
│   └── user.ts              # API route definitions
└── utils/
    ├── db.ts                # Database connection
    ├── GoogleConfig.ts      # Google OAuth configuration
    ├── dataUri.ts           # File buffer utilities
    └── TryCatch.ts          # Error handling wrapper
```

## 🔌 API Endpoints

### Authentication Routes
```http
POST /api/v1/login                    # Google OAuth login
POST /api/v1/auth/login               # Email/password login
POST /api/v1/auth/register            # User registration
```

### User Management Routes
```http
GET  /api/v1/me                       # Get current user profile
GET  /api/v1/user/:id                 # Get user by ID
POST /api/v1/user/update              # Update user profile
POST /api/v1/user/update/pic          # Update profile picture
```

## 📊 Database Schema

### User Model
```typescript
interface IUser {
  name: string;           // Required: User's full name
  email: string;          // Required: Unique email address
  image: string;          // Profile picture URL
  instagram: string;      // Instagram profile link
  facebook: string;       // Facebook profile link
  linkedin: string;       // LinkedIn profile link
  bio: string;           // User biography
  password?: string;      // Hashed password (optional for OAuth users)
  createdAt: Date;       // Auto-generated timestamp
  updatedAt: Date;       // Auto-generated timestamp
}
```

## 🔐 Authentication Flow

### Google OAuth 2.0 Flow
1. **Frontend Request**: Sends authorization code to `/api/v1/login`
2. **Token Exchange**: Service exchanges code for Google access token
3. **User Data**: Fetches user information from Google API
4. **User Creation/Login**: Creates new user or logs in existing user
5. **JWT Generation**: Issues JWT token for subsequent requests

### Email/Password Flow
1. **Registration**: User provides email, password, and profile information
2. **Password Hashing**: bcrypt hashes password before storage
3. **Login**: User provides credentials for authentication
4. **Verification**: Service verifies credentials against database
5. **JWT Generation**: Issues JWT token upon successful authentication

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance
- Cloudinary account (for image uploads)
- Google OAuth 2.0 credentials

### Environment Variables
Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/blogapp

# JWT Security
JWT_SEC=your_jwt_secret_key

# Google OAuth
Google_Client_id=your_google_client_id
Google_client_secret=your_google_client_secret

# Cloudinary Configuration
Cloud_Name=your_cloudinary_cloud_name
Cloud_Api_Key=your_cloudinary_api_key
Cloud_Api_Secret=your_cloudinary_api_secret
```

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build TypeScript**
   ```bash
   npm run build
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## � Docker Deployment

### Dockerfile Configuration
The service uses a multi-stage Docker build for optimized production images:

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine 

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/server.js"]
```

### Docker Hub Repository
- **Image**: [sajjad6ansari/user_service](https://hub.docker.com/repository/docker/sajjad6ansari/user_service)
- **Tags**: Available with version tags and `latest`

### Docker Commands

#### Build Local Image
```bash
docker build -t user-service .
```

#### Run Container
```bash
docker run -d \
  --name user-service \
  -p 5000:5000 \
  --env-file .env \
  user-service
```

#### Pull from Docker Hub
```bash
docker pull sajjad6ansari/user_service:latest
docker run -d \
  --name user-service \
  -p 5000:5000 \
  --env-file .env \
  sajjad6ansari/user_service:latest
```

### Multi-Stage Build Benefits
- **Smaller Image Size**: Production image excludes development dependencies
- **Security**: Reduces attack surface by excluding build tools
- **Performance**: Faster deployment with optimized layers
- **Efficiency**: TypeScript compilation in build stage only

## �🔒 Security Features

### JWT Authentication
- **Token Expiration**: 5-day token lifetime
- **Bearer Token**: Standard Authorization header format
- **Payload Security**: Excludes sensitive information from tokens

### Password Security
- **bcrypt Hashing**: Industry-standard password hashing
- **Salt Rounds**: Configurable salt rounds for enhanced security
- **Password Exclusion**: Passwords excluded from API responses

### Input Validation
- **Required Fields**: Validation for mandatory user information
- **Email Uniqueness**: Prevents duplicate email registrations
- **File Upload**: Secure file handling with buffer validation

## 🧪 API Usage Examples

### User Registration
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "bio": "Software Developer"
  }'
```

### Google OAuth Login
```bash
curl -X POST http://localhost:5000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "code": "google_authorization_code"
  }'
```

### Get User Profile
```bash
curl -X GET http://localhost:5000/api/v1/me \
  -H "Authorization: Bearer your_jwt_token"
```

### Update Profile
```bash
curl -X POST http://localhost:5000/api/v1/user/update \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sajjad Ansari",
    "bio": "Backend Engineer",
    "linkedin": "https://linkedin.com/in/sajjad-ansari-solo"
  }'
```

## 🏗️ Architecture Patterns

### Middleware Pattern
- **Authentication**: JWT verification for protected routes
- **File Upload**: Multer configuration for image uploads
- **Error Handling**: Centralized try-catch error management

### Controller Pattern
- **Separation of Concerns**: Business logic separated from routing
- **Async/Await**: Modern asynchronous request handling
- **Response Consistency**: Standardized API response format

### Model Pattern
- **Mongoose ODM**: Object Document Mapping for MongoDB
- **Type Safety**: TypeScript interfaces for data validation
- **Schema Validation**: Built-in Mongoose validation

## 🔄 Integration Points

This service integrates with:
- **Author Service**: User information for blog authorship
- **Blog Service**: User authentication for blog operations
- **Frontend Application**: User authentication and profile management

## 🚧 Development Notes

### Current Implementation
- ✅ **Complete Authentication**: Both OAuth and traditional auth
- ✅ **Profile Management**: Full CRUD operations
- ✅ **Image Upload**: Cloudinary integration
- ✅ **Security**: JWT and password encryption
- ✅ **Type Safety**: Full TypeScript implementation

### Future Enhancements
- Email verification for new registrations
- Password reset functionality
- Two-factor authentication (2FA)
- User role management
- Account suspension/deactivation
- Login activity tracking

## 📄 License

This microservice is part of the BlogApp Microservices architecture.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with proper TypeScript types
4. Add appropriate error handling
5. Test authentication flows
6. Submit a pull request

## 📞 Support

For questions regarding the User Service:
- Check the API documentation above
- Review the authentication flow diagrams
- Examine the TypeScript interfaces for data structures
- Test endpoints with the provided curl examples
