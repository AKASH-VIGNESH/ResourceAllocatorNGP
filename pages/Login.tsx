import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { mockService, USERS } from '../services/mockData';
import { GraduationCap, BookOpen, User, Shield, ArrowLeft, Loader2, Info, Users, Coffee, Zap, Monitor, Box } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showSupportMenu, setShowSupportMenu] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleBack = () => {
    setSelectedRole(null);
    setShowSupportMenu(false);
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const user = mockService.authenticate(email, password);
      
      if (user) {
        if (user.role !== selectedRole) {
          setError(`This account is not authorized for ${selectedRole} portal.`);
          setIsLoading(false);
          return;
        }
        
        login(user);
        
        if (user.role === UserRole.TEACHER) navigate('/teacher');
        else if (user.role === UserRole.STUDENT) navigate('/student');
        else if (user.role === UserRole.PRINCIPAL) navigate('/principal');
        else navigate('/support');
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 800);
  };

  const demoUsers = selectedRole ? USERS.filter(u => u.role === selectedRole) : [];

  const fillCredentials = (uEmail: string, uPass: string) => {
    setEmail(uEmail);
    setPassword(uPass);
  };

  // Helper to render icon for role
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.TEACHER: return <BookOpen size={24} />;
      case UserRole.STUDENT: return <User size={24} />;
      case UserRole.PRINCIPAL: return <Shield size={24} />;
      case UserRole.STAFF_CANTEEN: return <Coffee size={24} />;
      case UserRole.STAFF_SECURITY: return <Shield size={24} />;
      case UserRole.STAFF_ELECTRICAL: return <Zap size={24} />;
      case UserRole.STAFF_CS: return <Monitor size={24} />;
      case UserRole.STAFF_STORE: return <Box size={24} />;
      default: return <User size={24} />;
    }
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case UserRole.TEACHER: return 'Staff';
      case UserRole.STUDENT: return 'Student';
      case UserRole.PRINCIPAL: return 'Admin';
      case UserRole.STAFF_CANTEEN: return 'Canteen';
      case UserRole.STAFF_SECURITY: return 'Security';
      case UserRole.STAFF_ELECTRICAL: return 'Electrical';
      case UserRole.STAFF_CS: return 'CS Lab';
      case UserRole.STAFF_STORE: return 'Store';
      default: return 'Login';
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        
        {/* Left Side: Branding */}
        <div className="login-left">
          <div style={{position: 'relative', zIndex: 10}}>
            <div style={{ background: 'rgba(255,255,255,0.1)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'}}>
              <GraduationCap size={40} color="white" />
            </div>
            <h1 className="text-2xl font-bold mb-4" style={{lineHeight: 1.2}}>Dr. N.G.P. <br/>Arts & Science College</h1>
            <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
              Resource Allocator App. Streamline hall bookings, manage events, and track student participation effortlessly.
            </p>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="login-right">
          
          {!selectedRole ? (
            !showSupportMenu ? (
              <div className="fade-in">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Welcome Back</h2>
                  <p className="text-gray-500 mt-2">Please select your portal to continue</p>
                </div>

                <div>
                  <button onClick={() => handleRoleSelect(UserRole.TEACHER)} className="role-btn">
                    <div className="role-icon"><BookOpen size={24} /></div>
                    <div>
                      <h3 className="font-bold">Staff Portal</h3>
                      <p className="text-sm text-gray-500">Book halls & manage events</p>
                    </div>
                  </button>

                  <button onClick={() => handleRoleSelect(UserRole.STUDENT)} className="role-btn">
                    <div className="role-icon"><User size={24} /></div>
                    <div>
                      <h3 className="font-bold">Student Portal</h3>
                      <p className="text-sm text-gray-500">Register & view history</p>
                    </div>
                  </button>

                  <button onClick={() => handleRoleSelect(UserRole.PRINCIPAL)} className="role-btn">
                    <div className="role-icon"><Shield size={24} /></div>
                    <div>
                      <h3 className="font-bold">Principal / Admin</h3>
                      <p className="text-sm text-gray-500">Administrative oversight</p>
                    </div>
                  </button>

                  <button onClick={() => setShowSupportMenu(true)} className="role-btn" style={{ background: 'var(--gray-50)' }}>
                    <div className="role-icon"><Users size={24} /></div>
                    <div>
                      <h3 className="font-bold">Support & Logistics</h3>
                      <p className="text-sm text-gray-500">Canteen, Security, Electrical, Store</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="fade-in">
                 <button 
                  onClick={() => setShowSupportMenu(false)}
                  style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'none', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--gray-500)' }}
                >
                  <ArrowLeft size={16} className="mr-2" /> Back
                </button>
                <div className="text-center mb-6 mt-4">
                  <h2 className="text-xl font-bold">Support Services</h2>
                  <p className="text-gray-500 text-sm mt-1">Select your department</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button onClick={() => handleRoleSelect(UserRole.STAFF_CANTEEN)} className="role-btn" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: 0 }}>
                    <div className="role-icon" style={{ margin: '0 0 0.5rem 0' }}><Coffee size={24} /></div>
                    <h3 className="font-bold text-sm">Canteen</h3>
                  </button>
                  <button onClick={() => handleRoleSelect(UserRole.STAFF_SECURITY)} className="role-btn" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: 0 }}>
                     <div className="role-icon" style={{ margin: '0 0 0.5rem 0' }}><Shield size={24} /></div>
                     <h3 className="font-bold text-sm">Security</h3>
                  </button>
                   <button onClick={() => handleRoleSelect(UserRole.STAFF_ELECTRICAL)} className="role-btn" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: 0 }}>
                     <div className="role-icon" style={{ margin: '0 0 0.5rem 0' }}><Zap size={24} /></div>
                     <h3 className="font-bold text-sm">Electrical</h3>
                  </button>
                   <button onClick={() => handleRoleSelect(UserRole.STAFF_CS)} className="role-btn" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: 0 }}>
                     <div className="role-icon" style={{ margin: '0 0 0.5rem 0' }}><Monitor size={24} /></div>
                     <h3 className="font-bold text-sm">CS Lab</h3>
                  </button>
                  <button onClick={() => handleRoleSelect(UserRole.STAFF_STORE)} className="role-btn" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: 0, gridColumn: '1 / -1' }}>
                     <div className="role-icon" style={{ margin: '0 0 0.5rem 0' }}><Box size={24} /></div>
                     <h3 className="font-bold text-sm">General Store</h3>
                  </button>
                </div>
              </div>
            )
          ) : (
            /* Login Form */
            <div className="fade-in" style={{width: '100%'}}>
              <button 
                onClick={handleBack}
                style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'none', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--gray-500)' }}
              >
                <ArrowLeft size={16} className="mr-2" /> Back
              </button>

              <div className="text-center mb-6 mt-4">
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  {getRoleIcon(selectedRole)}
                </div>
                <h2 className="text-2xl font-bold">
                  {getRoleName(selectedRole)} Login
                </h2>
              </div>

              <form onSubmit={handleLogin}>
                {error && (
                  <div style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    {error}
                  </div>
                )}
                
                <div className="input-group">
                  <label htmlFor="email" className="input-label">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="name@drngp.ac.in"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="password" className="input-label">Password</label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem' }}
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                </button>
              </form>

              <div style={{ marginTop: '2rem', background: 'var(--gray-50)', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--gray-700)' }}>
                  <Info size={14} className="mr-2"/> 
                  Click an account to auto-fill
                </div>
                <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                  {demoUsers.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => fillCredentials(u.email, u.password || '')}
                      style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid var(--gray-200)' }}
                    >
                      <div>
                        <div style={{ fontWeight: 500 }}>{u.name}</div>
                        <div style={{ color: 'var(--gray-400)', fontSize: '10px' }}>{u.department || u.role}</div>
                      </div>
                      <div style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                        <div style={{ color: 'var(--primary)' }}>{u.email}</div>
                        <div style={{ color: 'var(--gray-400)' }}>Pass: {u.password}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={{ position: 'absolute', bottom: '1rem', left: 0, width: '100%', textAlign: 'center', fontSize: '0.75rem', color: 'var(--gray-400)' }}>
            &copy; {new Date().getFullYear()} Dr. N.G.P. Arts and Science College
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;