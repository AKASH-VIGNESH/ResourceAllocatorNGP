import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  PlusCircle, 
  CalendarDays, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active ? 'bg-brand-700 text-white shadow-md' : 'text-brand-100 hover:bg-brand-800'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderNavItems = () => {
    switch (user?.role) {
      case UserRole.TEACHER:
        return (
          <>
            <SidebarItem to="/teacher" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/teacher'} />
            <SidebarItem to="/teacher/book" icon={PlusCircle} label="Book Hall" active={location.pathname === '/teacher/book'} />
          </>
        );
      case UserRole.STUDENT:
        return (
          <>
            <SidebarItem to="/student" icon={CalendarDays} label="Browse Events" active={location.pathname === '/student'} />
            <SidebarItem to="/student/my-events" icon={UserIcon} label="My Registrations" active={location.pathname === '/student/my-events'} />
          </>
        );
      case UserRole.PRINCIPAL:
        return (
          <>
            <SidebarItem to="/principal" icon={ShieldCheck} label="Admin Overview" active={location.pathname === '/principal'} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-brand-800 flex items-center space-x-3">
          <div className="bg-white p-2 rounded-full text-brand-900">
             <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Dr. N.G.P. ASC</h1>
            <p className="text-xs text-brand-300">Resource Allocator</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {renderNavItems()}
        </nav>

        <div className="p-4 border-t border-brand-800">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-brand-300 truncate capitalize">{user?.role.toLowerCase()}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-brand-800 hover:bg-brand-700 text-white py-2 rounded-md transition-colors text-sm"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <header className="bg-white shadow-sm sticky top-0 z-10 px-8 py-4 flex justify-between items-center md:hidden">
          <h2 className="font-semibold text-gray-800">Resource Allocator</h2>
          {/* Mobile menu trigger could go here */}
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;