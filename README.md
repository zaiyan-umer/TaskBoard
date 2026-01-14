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

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible headless components
- **Recharts** - Data visualization library
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Backend
- **Next.js API Routes** - Serverless backend
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ORM
- **bcrypt** - Password hashing
- **JWT** - Authentication tokens

## 📋 Project Structure

```
task-manager/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── logout/
│   │   │   └── me/
│   │   ├── tasks/                # Task CRUD operations
│   │   ├── users/                # User management
│   │   └── dashboard/            # Dashboard stats
│   ├── auth/                     # Auth pages
│   │   ├── login/
│   │   └── register/
│   ├── admin-panel/              # Admin interface
│   ├── profile/                  # User profile page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   ├── card-components/          # Card layouts
│   ├── PieCharts/                # Chart components
│   ├── tasks/                    # Task-related components
│   └── ui/                       # Radix UI primitives
├── controllers/                  # Business logic
│   ├── helpers.ts                # Utility functions
│   └── permissions.ts            # Role-based permissions
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Authentication hook
│   ├── useCreateTask.ts          # Task creation
│   ├── useDeleteTask.ts          # Task deletion
│   ├── useFetchTasks.ts          # Task fetching
│   └── useStats.ts               # Statistics
├── lib/                          # Utilities
│   ├── axios.ts                  # Axios configuration
│   ├── db.ts                     # Database connection
│   └── utils.ts                  # Helper utilities
├── models/                       # MongoDB schemas
│   ├── task.ts                   # Task model
│   └── user.ts                   # User model
├── store/                        # Zustand stores
│   ├── auth.store.ts             # Auth state
│   └── tasks.store.ts            # Tasks state
├── public/                       # Static assets
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind configuration
└── next.config.ts                # Next.js configuration
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
   git clone <repository-url>
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

- **Home** (`/`) - Landing/home page
- **Login** (`/auth/login`) - User login
- **Register** (`/auth/register`) - User registration
- **Profile** (`/profile`) - User profile management
- **Admin Panel** (`/admin-panel`) - Admin dashboard
- **Dashboard** - User dashboard (redirects based on role)

## 🔐 Authentication

The app uses JWT-based authentication with:
- Secure password hashing with bcrypt
- HTTP-only cookies or localStorage for token storage
- Protected API routes with token verification
- Role-based access control (RBAC)

## 🎨 UI Components

Custom Radix UI-based components:
- **Badge** - Status indicators
- **Button** - Interactive buttons
- **Card** - Content containers
- **Dialog** - Modal dialogs
- **Input** - Text input fields
- **Select** - Dropdown selections
- **Calendar** - Date picker
- **Separator** - Visual dividers
- **Tooltip** - Hover information
- **Dropdown Menu** - Menu options

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
