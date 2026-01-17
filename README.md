# Task Manager

A comprehensive full-stack task management application with role-based access control, real-time dashboard analytics, and intuitive UI for organizing team workflows.

## 🚀 Features

- **User Authentication** - Secure login/registration with JWT tokens
- **Task Management** - Create, read, update, and delete tasks with status tracking
- **Admin Dashboard** - System-wide analytics and user management
- **User Dashboard** - Personal task stats and workload overview
- **Role-Based Access** - Admin and regular user permissions
- **Workload Tracking** - Visualize task distribution across team members
- **Deadline Management** - Track and manage task deadlines
- **User Profiles** - Manage user information and settings
- **Responsive Design** - Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend: 
- Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Zustand, Recharts, Axios, Lucide React, Sonner
### Backend: 
- Next.js API Routes, Node.js, MongoDB + Mongoose, bcrypt, JWT
  
## 📊 Architecture & Flow
### Flow
<img width="3123" height="1470" alt="flowchart" src="https://github.com/user-attachments/assets/a6823306-a5d8-42da-bf80-729901728053" />

### Dashboard
<img width="1883" height="871" alt="gh-1" src="https://github.com/user-attachments/assets/406def8e-3b8d-4bfc-8763-671592b9ac45" />

### Admin Panel
<img width="1157" height="435" alt="gh-2" src="https://github.com/user-attachments/assets/fdc4bda4-7185-4b14-a236-8d92d7d1beeb" />


## 📋 Project Structure

```
task-manager/
├── app/             # Pages & API routes
├── components/      # UI components & charts
├── controllers/     # Business logic
├── hooks/           # Custom React hooks
├── lib/             # Utilities
├── models/          # MongoDB schemas
├── store/           # Zustand stores
├── public/          # Static assets
└── next.config.ts   # Next.js config
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - List all tasks (with filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `POST /api/users/:id/upgrade` - Upgrade user role
- `GET /api/users/role` - Get users by role

### Dashboard
- `GET /api/dashboard/my-stats` - User statistics
- `GET /api/dashboard/admin-stats` - Admin statistics
- `GET /api/dashboard/deadlines` - Upcoming deadlines
- `GET /api/dashboard/workload` - Team workload data

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zaiyan-umer/TaskBoard.git
   cd task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📱 Pages

- **Login** (`/auth/login`) - User login
- **Register** (`/auth/register`) - User registration
- **Dashboard** (`/`) - User dashboard (home page)
- **Profile** (`/profile`) - User profile management
- **Admin Panel** (`/admin-panel`) - Admin dashboard

## 🔐 Authentication

The app uses JWT-based authentication with:
- Secure password hashing with bcrypt
- HTTP-only cookies or localStorage for token storage
- Protected API routes with token verification
- Role-based access control (RBAC)

## 🎨 UI Components

- Radix UI-based components (Cards, Buttons, Dialogs, Inputs, etc.)
- Charts with Recharts for task stats and workload visualization
- Responsive and mobile-friendly design

## 📊 Data Visualization

- **Pie Charts** - Task distribution and workload visualization
- **Admin Charts** - System-wide statistics
- **User Charts** - Personal task breakdown

## 🔄 State Management

- **Zustand Stores:**
  - `auth.store.ts` - User authentication state
  - `tasks.store.ts` - Task management state

- **Custom Hooks:**
  - `useAuth()` - Authentication state and methods
  - `useFetchTasks()` - Fetch tasks with filters
  - `useCreateTask()` - Create new tasks
  - `useUpdateTaskStatus()` - Update task status
  - `useDeleteTask()` - Delete tasks
  - `useStats()` - Dashboard statistics


## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [MongoDB](https://docs.mongodb.com)
- [Zustand](https://github.com/pmndrs/zustand)



---

**Built with ❤️ using Next.js, React, and MongoDB**
