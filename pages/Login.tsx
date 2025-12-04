import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { mockService, USERS } from '../services/mockData';
import { GraduationCap, BookOpen, User, Shield, ArrowLeft, Loader2, Info } from 'lucide-react';


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
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
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
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
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 800);
  };

  // Get users for the selected role to display in demo box
  const demoUsers = selectedRole ? USERS.filter(u => u.role === selectedRole) : [];

  const fillCredentials = (uEmail: string, uPass: string) => {
    setEmail(uEmail);
    setPassword(uPass);
  };

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left Side: Branding */}
        <div className="md:w-1/2 bg-gradient-to-br from-brand-900 to-brand-700 p-12 text-white flex flex-col justify-center relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10">
            <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm shadow-inner">
              <GraduationCap size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Dr. N.G.P. <br/>Arts & Science College</h1>
            <p className="text-brand-100 text-lg leading-relaxed font-light">
              Resource Allocator App. Streamline hall bookings, manage events, and track student participation effortlessly.
            </p>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-white">
          
          {/* View 1: Role Selection */}
          {!selectedRole ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-gray-500 mt-2">Please select your portal to continue</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleRoleSelect(UserRole.TEACHER)}
                  className="w-full group flex items-center p-4 rounded-xl border border-gray-200 hover:border-brand-500 hover:bg-brand-50 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                >
                  <div className="bg-brand-100 text-brand-600 p-3 rounded-lg group-hover:bg-brand-500 group-hover:text-white transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <div className="ml-4 text-left">
                    <h3 className="font-semibold text-gray-900">Staff Portal</h3>
                    <p className="text-sm text-gray-500">Book halls & manage events</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect(UserRole.STUDENT)}
                  className="w-full group flex items-center p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                >
                  <div className="bg-green-100 text-green-600 p-3 rounded-lg group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <User size={24} />
                  </div>
                  <div className="ml-4 text-left">
                    <h3 className="font-semibold text-gray-900">Student Portal</h3>
                    <p className="text-sm text-gray-500">Register & view history</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect(UserRole.PRINCIPAL)}
                  className="w-full group flex items-center p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                >
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    <Shield size={24} />
                  </div>
                  <div className="ml-4 text-left">
                    <h3 className="font-semibold text-gray-900">Principal / Admin</h3>
                    <p className="text-sm text-gray-500">Administrative oversight</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* View 2: Login Form */
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full">
              <button 
                onClick={handleBack}
                className="absolute top-8 left-8 text-gray-400 hover:text-gray-600 flex items-center text-sm font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> Back
              </button>

              <div className="text-center mb-8 mt-4">
                <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 ${
                  selectedRole === UserRole.TEACHER ? 'bg-brand-100 text-brand-600' :
                  selectedRole === UserRole.STUDENT ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  {selectedRole === UserRole.TEACHER && <BookOpen size={24} />}
                  {selectedRole === UserRole.STUDENT && <User size={24} />}
                  {selectedRole === UserRole.PRINCIPAL && <Shield size={24} />}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedRole === UserRole.TEACHER ? 'Staff Login' :
                   selectedRole === UserRole.STUDENT ? 'Student Login' : 'Admin Login'}
                </h2>
                <p className="text-gray-500 mt-1 text-sm">Sign in to access your dashboard</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center font-medium border border-red-100 animate-in shake">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                    placeholder="name@drngp.ac.in"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full text-white font-semibold py-3 rounded-lg transition-all shadow-md flex items-center justify-center ${
                    selectedRole === UserRole.TEACHER ? 'bg-brand-600 hover:bg-brand-700 focus:ring-brand-500' :
                    selectedRole === UserRole.STUDENT ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' :
                    'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
                  } focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                </button>
              </form>

              {/* Demo Credentials List */}
              <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-100 text-xs text-gray-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold flex items-center text-gray-700">
                    <Info size={14} className="mr-1"/> 
                    Click an account to auto-fill
                  </span>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {demoUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => fillCredentials(u.email, u.password || '')}
                      className="w-full flex items-center justify-between p-2 rounded hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-left"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{u.name}</div>
                        <div className="text-gray-400 text-[10px]">{u.department || u.role}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-brand-600">{u.email}</div>
                        <div className="text-gray-400">Pass: {u.password}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Dr. N.G.P. Arts and Science College
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;