# Gym Class Scheduling and Membership Management System

## Project Overview
This system is designed to manage gym operations efficiently with three user roles: **Admin**, **Trainer**, and **Trainee**.This system is designed to manage gym operations efficiently with three user roles: Admin, Trainer, and Trainee. Admins can create/manage trainers and schedule classes, Trainers can view their assigned classes, and Trainees can book available classes. The system enforces business rules like maximum 5 classes per day, 10 trainees per class, and proper authentication/authorization.

- **Admin**: Create and manage trainers, schedule classes.
- **Trainer**: View their assigned classes.
- **Trainee**: Book available classes.

The system enforces important business rules:
- Maximum 5 classes per day per trainer.
- Maximum 10 trainees per class.
- Proper authentication and authorization.

---

## Relation Diagram
![Database Schema Diagram](https://i.postimg.cc/6537pBRr/Screenshot-1513.png)

### Entities
- **User**: Stores all user information (name, email, password, role).
- **Schedule**: Contains class schedules with date, time, trainer, and trainees.

### Relationships
- One Trainer (User) ➔ Many Schedules
- Many Trainees (Users) ➔ Many Schedules (through bookings)


---

## Technology Stack
- **Backend**: TypeScript, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Error Handling**: Custom error middleware
- **Environment**: Node.js runtime

---

## API Endpoints

### Authentication
| Method | Endpoint         | Description                | Access       |
|--------|------------------|----------------------------|--------------|
| POST   | /api/users        | Register new user          | Public       |
| POST   | /api/users/login  | Login user                 | Public       |

### User Management
| Method | Endpoint             | Description                | Access         |
|--------|----------------------|-----------------------------|----------------|
| GET    | /api/users            | Get all users               | Admin only     |
| GET    | /api/users/trainers   | Get all trainers            | Admin only     |
| GET    | /api/users/profile    | Get user profile            | Authenticated  |
| PUT    | /api/users/profile    | Update user profile         | Authenticated  |

### Schedule Management
| Method | Endpoint             | Description                       | Access        |
|--------|----------------------|-----------------------------------|---------------|
| POST   | /api/schedules        | Create new schedule               | Admin only    |
| GET    | /api/schedules        | Get all schedules                 | Authenticated |
| GET    | /api/schedules/:id    | Get schedule by ID                | Authenticated |
| PUT    | /api/schedules/:id    | Update schedule (reschedule class)| Admin only    |
| DELETE | /api/schedules/:id    | Delete schedule                   | Admin only    |

### Booking Classes (Trainees)
| Method | Endpoint                   | Description                       | Access        |
|--------|-----------------------------|-----------------------------------|---------------|
| POST   | /api/schedules/:id/book      | Book a trainee into a schedule    | Trainee only  |
| DELETE | /api/schedules/:id/unbook    | Cancel trainee booking            | Trainee only  |

---
# **Database Schema**
-------------------
![Database Image](https://i.postimg.cc/k58RPwSL/Screenshot-1512.png)

### **User Model**

interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'trainer' | 'trainee';
  createdAt: Date;
  updatedAt: Date;
}

### **Schedule Model**

interface ISchedule {
  _id: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  trainer: mongoose.Types.ObjectId; // Reference to User
  trainees: mongoose.Types.ObjectId[]; // Array of User references
  maxTrainees: number;
  createdAt: Date;
  updatedAt: Date;
}

* * * * *

**Admin Credentials**
---------------------


{
  "email": "admin@gym.com",
  "password": "admin123",
  "role": "admin"
}

### **How to Create First Admin**

1.  Use this curl command to create your first admin:

curl -X POST https://gym-managemnet-system-z4d7.vercel.app/api/users
  -H "Content-Type: application/json"\
  -d '{"name":"Admin","email":"admin@gym.com","password":"admin123","role":"admin"}'

1.  Then login to get your JWT token:

curl -X POST https://gym-managemnet-system-z4d7.vercel.app/api/users/login
  -H "Content-Type: application/json"\
  -d '{"email":"admin@gym.com","password":"admin123"}'

* * * * *

**Sample API Responses**
------------------------

### **Successful Login (200 OK)**

{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin",
    "email": "admin@gym.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

### **Error Response (400 Bad Request)**

{
  "success": false,
  "error": "Invalid email or password"
}

* * * * *


## Business Rules
- A trainer cannot be assigned more than **5 classes per day**.
- A schedule cannot have more than **10 trainees**.
- Only **Admins** can create, update, or delete schedules.
- Only **Trainees** can book or unbook classes.

---

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/gym-management-system.git

# Navigate to the project directory
cd gym-management-system

# Install dependencies
npm install

# Create a .env file and configure your environment variables
cp .env.example .env

# Run the development server
npm run dev
```

---

## Environment Variables

The project uses the following environment variables:

```env
PORT
MONGODB_URI
JWT_SECRET
```

---

## Folder Structure

```
src/
|-- config/
|-- controllers/
|-- middlewares/
|-- models/
|-- routes/
|-- utils/
|-- types/
|-- app.ts
```

- **controllers/**: Request handlers (business logic)
- **middlewares/**: Error handling, authentication
- **models/**: Mongoose models (User, Schedule)
- **routes/**: API endpoints
- **utils/**: Helper functions (token generation, validation)
- **config/**: DB connection
- **app.ts**: Application entry point

---

## Future Enhancements
- Email notifications for class bookings and cancellations.
- Role-based dashboard views.
- Admin analytics dashboard for usage statistics.

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
