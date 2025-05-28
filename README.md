# 📘 SkillSwap - Software Requirements Specification (SRS)

SkillSwap is a full-stack skill exchange platform that connects users who want to **learn** and **teach** various skills. Users can create profiles, list skills they can offer, search for skills they want to learn, send/accept skill exchange requests, and leave reviews post-session. This README serves as an overview of the **Software Requirements Specification (SRS)** for the backend system.

---

## 📑 Table of Contents

- [1. Introduction](#1-introduction)
- [2. Overall Description](#2-overall-description)
- [3. Functional Requirements](#3-functional-requirements)
- [4. Non-Functional Requirements](#4-non-functional-requirements)
- [5. API Endpoints](#5-api-endpoints)
- [6. Technology Stack](#6-technology-stack)
- [7. Backend Architecture](#7-backend-architecture)
- [8. Security Practices](#8-security-practices)
- [9. Future Enhancements](#9-future-enhancements)

---

## 1. 🧭 Introduction

### Purpose
This document describes the backend system's behavior, data models, endpoints, and constraints for SkillSwap — a platform that enables peer-to-peer skill sharing.

### Scope
This backend will power a web or mobile app, exposing REST APIs for user authentication, skill listings, request handling, and reviews.

---

## 2. 🌐 Overall Description

- **User roles:** Regular User, Admin
- **Core modules:**
  - Authentication (JWT-based)
  - Skill management
  - Skill exchange requests
  - Reviews and ratings
- **Admin tools (future):**
  - Manage users and content moderation

---

## 3. ✅ Functional Requirements

### User Module
- Register with email and password
- Login with JWT token generation
- View and update user profile
- View other users' profiles

### Skill Module
- Create a skill offered
- Browse/search skills
- Request to learn a skill from another user

### Request Module
- Send/accept/reject a skill exchange request
- Track request status (Pending, Accepted, Rejected)

### Review Module
- Review a user after session
- Add rating and optional comments

---

## 4. 🚦 Non-Functional Requirements

- RESTful API design
- Secure password handling (bcrypt)
- Input validation (Zod)
- Scalability through modular design (MVC)
- Role-based access control
- Prisma ORM for efficient DB communication

---

## 5. 🔌 API Endpoints (Phase 1)

### Auth
| Method | Endpoint          | Description             |
|--------|-------------------|-------------------------|
| POST   | `/auth/register`  | Register a new user     |
| POST   | `/auth/login`     | Login and get JWT       |
| GET    | `/auth/profile`   | Get logged-in user info |

### Skills
| Method | Endpoint          | Description                    |
|--------|-------------------|--------------------------------|
| POST   | `/skills`         | Create a new skill             |
| GET    | `/skills`         | List all skills                |
| GET    | `/skills/:id`     | Get skill by ID                |

### Requests
| Method | Endpoint                | Description                  |
|--------|-------------------------|------------------------------|
| POST   | `/requests`             | Send skill request           |
| GET    | `/requests/sent`        | List sent requests           |
| GET    | `/requests/received`    | List received requests       |
| PATCH  | `/requests/:id/status`  | Accept or reject a request   |

### Reviews
| Method | Endpoint           | Description                 |
|--------|--------------------|-----------------------------|
| POST   | `/reviews`         | Submit a review             |
| GET    | `/reviews/:userId` | Get reviews for a user      |

---

## 6. 🛠 Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** JWT (access + refresh tokens)
- **Validation:** Zod
- **Dev Tools:** TypeScript, ts-node-dev, dotenv

---

## 7. 🏗 Backend Architecture

### Pattern: Modular MVC + Service Layer

## src/
    - controllers/ # Input/output handling
    - services/ # Business logic
    - routes/ # Routing logic
    - middlewares/ # Auth, error, validation
    - prisma/ # Prisma schema and client
    - validators/ # Zod schemas
    - index.ts # App entry point


---

## 8. 🔐 Security Practices

- Passwords are hashed using `bcryptjs`
- JWT-based stateless authentication
- Role-based authorization (User/Admin)
- Input sanitization and validation using `zod`
- Environment variables stored securely in `.env`
- CORS configuration for frontend integration

---

## 9. 🚀 Future Enhancements

- Real-time chat during sessions (Socket.IO)
- Calendar sync for scheduling sessions
- Admin dashboard with analytics
- Gamification: badges, XP points
- Notification system (email or FCM)

---

## 🧑‍💻 Maintainer

**Rohit**  
Backend Developer | NodeJS | Prisma | DSA Enthusiast  
Email: rohhiiiit@gmail.com

---

> “The best way to learn is by teaching.”

# 🧠 SkillSwap Prisma Schema Overview

This document explains the data models used in the **SkillSwap** platform, built using **Prisma ORM**.  
SkillSwap allows users to **teach and learn skills** by connecting with others on the platform.

---

## 🧩 Models and Their Purpose

### 1. 🧑‍💼 `User`

```prisma
model User {
  id               String     @id @default(uuid())
  name             String
  email            String     @unique
  password         String
  bio              String?
  location         String?
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt

  skills           Skill[]    @relation("UserSkills")
  offeredSkills    Skill[]    @relation("UserOfferedSkills")

  sessionsAsLearner Session[] @relation("Learner")
  sessionsAsTeacher Session[] @relation("Teacher")

  reviewsGiven     Review[]   @relation("ReviewsGiven")
  reviewsTaken     Review[]   @relation("ReviewsTaken")
}
✅ Purpose:
Represents a registered user. A user can both offer skills to teach and seek skills to learn.

📌 Key Fields:

skills: Skills the user wants to learn.

offeredSkills: Skills the user is offering to teach.

sessionsAsLearner: Sessions where the user is a learner.

sessionsAsTeacher: Sessions where the user is a teacher.

reviewsGiven / reviewsTaken: Reviews the user gave and received.

2. 🎯 Skill
prisma
Copy
Edit
model Skill {
  id           String     @id @default(uuid())
  name         String
  description  String?
  category     String
  createdAt    DateTime   @default(now())

  users        User[]     @relation("UserSkills")
  offeredBy    User[]     @relation("UserOfferedSkills")
  sessions     Session[]
}
✅ Purpose:
Represents a specific skill (e.g., Guitar, Python, Yoga) that can be learned or taught.

📌 Key Fields:

users: Users who want to learn this skill.

offeredBy: Users who can teach this skill.

sessions: Sessions related to this skill.

3. 📅 Session
prisma
Copy
Edit
model Session {
  id             String         @id @default(uuid())
  skillId        String
  learnerId      String
  teacherId      String
  scheduledAt    DateTime
  durationMins   Int
  status         SessionStatus  @default(PENDING)
  createdAt      DateTime       @default(now())

  skill          Skill          @relation(fields: [skillId], references: [id])
  learner        User           @relation("Learner", fields: [learnerId], references: [id])
  teacher        User           @relation("Teacher", fields: [teacherId], references: [id])
  review         Review?
}
✅ Purpose:
Defines a scheduled learning session between a teacher and a learner for a particular skill.

📌 Key Fields:

learner & teacher: Both are users, but in different roles.

skill: The skill being taught.

scheduledAt: Time the session is scheduled for.

durationMins: Session duration in minutes.

status: Status of the session (PENDING, CONFIRMED, etc.).

review: Associated feedback.

4. 🌟 Review
prisma
Copy
Edit
model Review {
  id           String   @id @default(uuid())
  sessionId    String   @unique
  reviewerId   String
  revieweeId   String
  rating       Int      // 1 to 5
  comment      String?
  createdAt    DateTime @default(now())

  session      Session  @relation(fields: [sessionId], references: [id])
  reviewer     User     @relation("ReviewsGiven", fields: [reviewerId], references: [id])
  reviewee     User     @relation("ReviewsTaken", fields: [revieweeId], references: [id])
}
✅ Purpose:
A review left by one user about another after a session has taken place.

📌 Key Fields:

sessionId: The session being reviewed.

reviewer: User giving the review.

reviewee: User receiving the review.

rating: From 1 to 5.

comment: Optional text feedback.

5. 📊 SessionStatus (Enum)
prisma
Copy
Edit
enum SessionStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}
✅ Purpose:
Tracks the status of a session.

📌 Enum Values:

PENDING: Request made, not yet accepted.

CONFIRMED: Both users agreed to the session.

COMPLETED: Session completed successfully.

CANCELLED: Session canceled before it occurred.

🔁 Relationships Overview
Entity	Relationship Description
User ↔ Skill	Many-to-many (learned skills and offered skills)
User ↔ Session	One-to-many (as learner or teacher)
User ↔ Review	One-to-many (given and received reviews)
Skill ↔ Session	One-to-many (a skill can have multiple sessions)
Session ↔ Review	One-to-one (a session can have only one review)

🛠 Use Cases Supported by This Schema
✅ User Registration & Profile Management

✅ Skill Listing, Searching & Categorization

✅ Session Scheduling and Tracking

✅ Role-based Session Participation (Learner/Teacher)

✅ Ratings & Reviews for Users

✅ Status-based Session Workflow

📁 Tech Stack
🧬 Prisma ORM

🗄️ PostgreSQL / MySQL

☁️ Node.js / TypeScript

🔐 Secure Password Handling

🧪 Scalable Relationship Modeling