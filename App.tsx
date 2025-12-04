import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, UserRole } from './types';
import { mockService } from './services/mockData';
import Login from './pages/Login';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import BookHall from './pages/teacher/BookHall';
import StudentDashboard from './pages/student/StudentDashboard';
import PrincipalDashboard from './pages/principal/PrincipalDashboard';
import Layout from './components/Layout';
import EventDetails from './pages/teacher/EventDetails';
import MyEvents from './pages/student/MyEvents';
import './index.css';


// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    mockService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Protected Route ---
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: UserRole[] }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Or unauthorized page
  }

  return <>{children}</>;
};

// --- Main App ---
const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      {/* Teacher Routes */}
      <Route path="/teacher" element={
        <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<TeacherDashboard />} />
        <Route path="book" element={<BookHall />} />
        <Route path="event/:eventId" element={<EventDetails />} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<StudentDashboard />} />
        <Route path="my-events" element={<MyEvents />} />
      </Route>

      {/* Principal Routes */}
      <Route path="/principal" element={
        <ProtectedRoute allowedRoles={[UserRole.PRINCIPAL]}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<PrincipalDashboard />} />
      </Route>
    </Routes>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
}