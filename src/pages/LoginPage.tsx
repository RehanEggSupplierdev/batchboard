import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { LogIn, Users, AlertCircle, UserPlus } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { useAuth } from '../contexts/AuthContext';

interface LoginForm {
  email: string;
  password: string;
}

interface SignUpForm {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  studentId: string;
}

const LoginPage: React.FC = () => {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  });

  // Signup form state
  const [signUpForm, setSignUpForm] = useState<SignUpForm>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    studentId: ''
  });

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpForm(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const validateLoginForm = () => {
    if (!loginForm.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!loginForm.password) {
      setError('Password is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateSignUpForm = () => {
    if (!signUpForm.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!signUpForm.studentId.trim()) {
      setError('Student ID is required');
      return false;
    }
    if (!signUpForm.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!signUpForm.password) {
      setError('Password is required');
      return false;
    }
    if (!signUpForm.confirmPassword) {
      setError('Please confirm your password');
      return false;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpForm.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate full name
    if (signUpForm.fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters');
      return false;
    }

    // Validate student ID
    if (signUpForm.studentId.length < 3 || signUpForm.studentId.length > 20) {
      setError('Student ID must be 3-20 characters');
      return false;
    }
    if (!/^[A-Za-z0-9]+$/.test(signUpForm.studentId)) {
      setError('Student ID can only contain letters and numbers');
      return false;
    }

    // Validate password
    if (signUpForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    // Check password match
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const onLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;

    setLoading(true);
    setError('');

    try {
      const result = await signIn(loginForm.email.trim(), loginForm.password);
      
      if (result.error) {
        setError(result.error);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignUpForm()) return;

    setLoading(true);
    setError('');

    try {
      const result = await signUp(
        signUpForm.email.trim(), 
        signUpForm.password, 
        signUpForm.fullName.trim(), 
        signUpForm.studentId.trim()
      );
      
      if (result.error) {
        setError(result.error);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoData = () => {
    if (isSignUp) {
      setSignUpForm({
        email: 'demo@example.com',
        password: 'password',
        confirmPassword: 'password',
        fullName: 'Demo User',
        studentId: 'DEMO001'
      });
    } else {
      setLoginForm({
        email: 'demo@example.com',
        password: 'password'
      });
    }
    setError('');
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Join BatchBoard!' : 'Welcome Back!'}
            </h2>
            <p className="text-gray-600">
              {isSignUp 
                ? 'Create your account to join the SOSE Class 10th community'
                : 'Sign in to access your BatchBoard profile'
              }
            </p>
          </div>

          <Card className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    {isSignUp ? 'Sign Up Failed' : 'Login Failed'}
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {!isSignUp ? (
              // Login Form
              <form onSubmit={onLoginSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    placeholder="Enter your email"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    placeholder="Enter your password"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              </form>
            ) : (
              // Sign Up Form
              <form onSubmit={onSignUpSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={signUpForm.fullName}
                    onChange={handleSignUpChange}
                    placeholder="Enter your full name"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={signUpForm.studentId}
                    onChange={handleSignUpChange}
                    placeholder="Choose a unique ID (e.g., john123)"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">3-20 characters, letters and numbers only</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={signUpForm.email}
                    onChange={handleSignUpChange}
                    placeholder="Enter your email address"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={signUpForm.password}
                    onChange={handleSignUpChange}
                    placeholder="Create a password (min 6 characters)"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={signUpForm.confirmPassword}
                    onChange={handleSignUpChange}
                    placeholder="Confirm your password"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </Button>
              </form>
            )}

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setLoginForm({ email: '', password: '' });
                    setSignUpForm({ email: '', password: '', confirmPassword: '', fullName: '', studentId: '' });
                  }}
                >
                  {isSignUp ? 'Sign In Instead' : 'Create New Account'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={fillDemoData}
                >
                  Fill Demo Data
                </Button>
              </div>
            </div>
          </Card>

          {/* Demo Info */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Quick Start
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Click "Fill Demo Data" to auto-fill the form</p>
              <p>• Or use: demo@example.com / password</p>
              <p>• Create your own account with any email</p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;