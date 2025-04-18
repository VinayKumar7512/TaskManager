import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeDarkMode } from './utils/darkModeUtils';

// Layout components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Register from './pages/register';
import Tasks from './pages/tasks';
import NewTask from './pages/newTask';
import EditTask from './pages/editTask';
import Profile from './pages/profile';
import Settings from './pages/settings';
import Trash from './pages/trash';
import Calendar from './pages/calendar';
import Analytics from './pages/analytics';

// Auth wrapper component
const RequireAuth = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Layout component
const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-dark">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-dark">
          {children}
        </main>
      </div>
    </div>
  );
};

// Public route component
const PublicRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (user) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize dark mode on app load
    initializeDarkMode();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark">
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Default route - redirect to dashboard if logged in, otherwise to login */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        {/* Public routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <RequireAuth>
            <Layout>
              <Dashboard />
            </Layout>
          </RequireAuth>
        } />
        
        <Route path="/tasks" element={
          <RequireAuth>
            <Layout>
              <Tasks />
            </Layout>
          </RequireAuth>
        } />
        
        <Route path="/tasks/new" element={
          <RequireAuth>
            <Layout>
              <NewTask />
            </Layout>
          </RequireAuth>
        } />
        
        <Route path="/tasks/edit/:id" element={
          <RequireAuth>
            <Layout>
              <EditTask />
            </Layout>
          </RequireAuth>
        } />
        
        <Route path="/profile" element={
          <RequireAuth>
            <Layout>
              <Profile />
            </Layout>
          </RequireAuth>
        } />
        
        <Route path="/settings" element={
          <RequireAuth>
            <Layout>
              <Settings />
            </Layout>
          </RequireAuth>
        } />

        <Route path="/trash" element={
          <RequireAuth>
            <Layout>
              <Trash />
            </Layout>
          </RequireAuth>
        } />

        <Route path="/calendar" element={
          <RequireAuth>
            <Layout>
              <Calendar />
            </Layout>
          </RequireAuth>
        } />

        <Route path="/analytics" element={
          <RequireAuth>
            <Layout>
              <Analytics />
            </Layout>
          </RequireAuth>
        } />

        {/* Catch all route */}
        <Route path="*" element={
          <Navigate to={user ? "/dashboard" : "/"} replace />
        } />
      </Routes>
    </div>
  );
}

export default App;