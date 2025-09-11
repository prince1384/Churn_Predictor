import React, { useState } from 'react';
import { Eye, EyeOff, UserIcon, LockIcon } from 'lucide-react';
import ThreeDBackground from './ThreeDBackground';
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = 'http://127.0.0.1:8000';
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (isRegister) {
        const url = new URL(API_URL + '/auth/register');
        url.searchParams.set('username', username || email);
        url.searchParams.set('email', email);
        url.searchParams.set('password', password);
        const regResp = await fetch(url.toString(), { method: 'POST' });
        if (!regResp.ok) {
          const msg = await regResp.text();
          throw new Error(msg || 'Registration failed');
        }
      }
      const body = new URLSearchParams();
      body.set('username', username || email);
      body.set('password', password);
      const resp = await fetch(API_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || 'Invalid credentials');
      }
      const data = await resp.json();
      localStorage.setItem('token', data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Background */}
      <ThreeDBackground />
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Churn Predictor
            </h1>
            <p className="text-gray-400">
              Predict and prevent customer churn with AI
            </p>
          </div>
          {/* Login Form */}
          <div className="bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-6">{isRegister ? 'Create Account' : 'Sign In'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon size={18} className="text-gray-500" />
                    </div>
                    <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} className="bg-gray-800 text-white pl-10 pr-3 py-2 block w-full rounded-md border border-gray-700 focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none" placeholder="yourusername" />
                  </div>
                </div>
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon size={18} className="text-gray-500" />
                    </div>
                    <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-gray-800 text-white pl-10 pr-3 py-2 block w-full rounded-md border border-gray-700 focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none" placeholder="your@email.com" />
                  </div>
                </div>
                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                      Password
                    </label>
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon size={18} className="text-gray-500" />
                    </div>
                    <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="bg-gray-800 text-white pl-10 pr-10 py-2 block w-full rounded-md border border-gray-700 focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none" placeholder="••••••••" />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} className="text-gray-500 hover:text-gray-300" /> : <Eye size={18} className="text-gray-500 hover:text-gray-300" />}
                    </button>
                  </div>
                </div>
                {error && <div className="text-red-400 text-sm">{error}</div>}
                {/* Submit Button */}
                <button type="submit" disabled={isLoading} className="w-full bg-white hover:bg-gray-200 text-black font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900">
                  {isLoading ? <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isRegister ? 'Creating account...' : 'Signing in...'}
                    </span> : (isRegister ? 'Create Account' : 'Sign In')}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button onClick={() => setIsRegister(!isRegister)} className="text-white hover:underline">
                  {isRegister ? 'Sign in' : 'Create one'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default LoginPage;