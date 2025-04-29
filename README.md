# TaskMaster Pro - Task Management Application

![TaskMaster Pro](https://i.imgur.com/XYZ123.png)

A professional full-stack task management application built with Next.js, React, and Supabase. This application allows users to manage their tasks efficiently with features like task creation, status tracking, priority management, and analytics.

## Features

- **User Authentication**
  - Secure email/password registration and login
  - Protected routes for authenticated users
  - User profile management

- **Task Management**
  - Create, read, update, and delete tasks
  - Mark tasks as complete/incomplete
  - Set priority levels (Low, Medium, High)
  - Task filtering and sorting options
  - Search functionality

- **Analytics Dashboard**
  - Visual representation of task completion rates
  - Priority distribution charts
  - Activity tracking over time

- **Modern UI/UX**
  - Responsive design for all devices
  - Dark/light mode support
  - Animations and transitions for a polished experience
  - Intuitive and clean interface

## Tech Stack

- **Frontend**
  - React with Next.js App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
  - shadcn/ui component library
  - Framer Motion for animations
  - Recharts for data visualization

- **Backend**
  - Next.js API Routes
  - Supabase for authentication and database

- **Database**
  - PostgreSQL (via Supabase)
  - Row Level Security for data protection

- **Authentication**
  - Supabase Auth with JWT

## Database Schema

### Profiles Table
\`\`\`sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

### Tasks Table
\`\`\`sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'incomplete',
  priority TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL
);
\`\`\`

## Setup Instructions

### Prerequisites
- Node.js 16.x or later
- Supabase account

### Environment Variables
Create a `.env.local` file in the root directory with the following variables:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/taskmaster-pro.git
cd taskmaster-pro
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Set up the database
- Create a new Supabase project
- Run the SQL queries in the `schema.sql` file to set up the tables and policies

4. Run the development server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Test Users

You can use these test users to log in:

1. **Demo Account**
   - Email: demo@example.com
   - Password: demo123456

2. **Test User 1**
   - Email: test1@example.com
   - Password: password123

3. **Test User 2**
   - Email: test2@example.com
   - Password: password123

## Deployment

The application can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the repository to Vercel
3. Set the environment variables in the Vercel dashboard
4. Deploy!

## Architecture

This application follows a modern full-stack architecture:

- **Client-side**: React components with hooks for state management
- **Server-side**: Next.js API routes for server operations
- **Database**: PostgreSQL database hosted on Supabase
- **Authentication**: JWT-based authentication via Supabase Auth
- **API**: RESTful API endpoints for CRUD operations

## Custom Hooks

The application includes custom hooks for better code organization and reusability:

- `useAuth`: Manages authentication state and user information
- `useTasks`: Handles task CRUD operations and real-time updates

## Security Considerations

- Row Level Security (RLS) policies ensure users can only access their own data
- JWT authentication for secure API requests
- Server-side validation of user permissions
- Protected routes for authenticated users only

## Future Enhancements

- Task categories and tags
- Team collaboration features
- Due dates and reminders
- File attachments for tasks
- Mobile app version

## License

MIT
