### medilab-diagnostic-app
 simple CRUD application b to help medical laboratories manage diagnostic test results efficiently.

## Features
Create, Read, Update, Delete (CRUD) operations for diagnostic test results.
RESTful API for managing test results.
Frontend UI built with React and Tailwind CSS.
Validation using Zod for API requests.


## Technologies Used
Frontend: Next.js, React, Tailwind CSS
Backend: Next.js API Routes
Database: PostgreSQL
ORM: Prisma
Validation: Zod


## Architecture
The application follows a client-server architecture:
1. Frontend: Built with Next.js and Tailwind CSS, providing a user-friendly interface for managing test results.
2. Backend**: Next.js API routes handle CRUD operations and interact with the PostgreSQL database using Prisma ORM.
3. Database**: PostgreSQL stores diagnostic test results with the following schema:
  
## Setup
1. Clone the repository.
2. Run `npm install`.
3. Set up PostgreSQL and update `.env`.
4. Run `npx prisma migrate dev --name init`.
5. Start the app with `npm run dev`.
