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
    className={`nav-item ${active ? 'active' : ''}`}
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
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-icon">
             <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold">Dr. N.G.P. ASC</h1>
            <p className="text-xs" style={{opacity: 0.7}}>Resource Allocator</p>
          </div>
        </div>

        <nav className="nav-container">
          {renderNavItems()}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              {user?.name.charAt(0)}
            </div>
            <div style={{overflow: 'hidden'}}>
              <p className="text-sm font-medium" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{user?.name}</p>
              <p className="text-xs" style={{opacity: 0.7, textTransform: 'capitalize'}}>{user?.role.toLowerCase()}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="mobile-header">
          <h2 className="font-bold text-gray-800">Resource Allocator</h2>
        </header>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;