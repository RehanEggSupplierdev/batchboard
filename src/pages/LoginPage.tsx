import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginForm>();

  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    watch,
    formState: { errors: signUpErrors },
  } = useForm<SignUpForm>();

  const watchPassword = watch('password');

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onLoginSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');

    try {
      const result = await signIn(data.email, data.password);
      
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

  const onSignUpSubmit = async (data: SignUpForm) => {
    setLoading(true);
    setError('');

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(data.email, data.password, data.fullName, data.studentId);
      
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
              <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email (e.g., john@example.com)"
                  error={loginErrors.email?.message}
                  {...registerLogin('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  error={loginErrors.password?.message}
                  {...registerLogin('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />

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
              <form onSubmit={handleSignUpSubmit(onSignUpSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name (e.g., John Doe)"
                    error={signUpErrors.fullName?.message}
                    {...registerSignUp('fullName', {
                      required: 'Full name is required',
                      pattern: {
                        value: /^[A-Za-z\s]{2,50}$/,
                        message: 'Name must be 2-50 characters (letters and spaces only)',
                      },
                    })}
                  />

                  <Input
                    label="Student ID"
                    type="text"
                    placeholder="Choose a unique ID (e.g., john123, student001)"
                    error={signUpErrors.studentId?.message}
                    helperText="3-20 characters, letters and numbers only"
                    {...registerSignUp('studentId', {
                      required: 'Student ID is required',
                      pattern: {
                        value: /^[A-Za-z0-9]{3,20}$/,
                        message: 'Student ID must be 3-20 characters (letters and numbers only)',
                      },
                    })}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    error={signUpErrors.email?.message}
                    {...registerSignUp('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address',
                      },
                    })}
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="Create a password (min 6 characters)"
                    error={signUpErrors.password?.message}
                    {...registerSignUp('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                    error={signUpErrors.confirmPassword?.message}
                    {...registerSignUp('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === watchPassword || 'Passwords do not match',
                    })}
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

              <div className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                >
                  {isSignUp ? 'Sign In Instead' : 'Create New Account'}
                </Button>
              </div>
            </div>
          </Card>

          {!isSignUp && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Not a student?{' '}
                <Link to="/students" className="text-blue-600 hover:text-blue-500">
                  Browse public profiles
                </Link>
              </p>
            </div>
          )}

          {/* Demo Info */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              {isSignUp ? 'Getting Started' : 'Demo Accounts'}
            </h3>
            {isSignUp ? (
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Choose a unique Student ID (like john123 or student001)</li>
                <li>• Use your real email address</li>
                <li>• Create a secure password (minimum 6 characters)</li>
                <li>• Complete your profile after signing up</li>
              </ul>
            ) : (
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Email: demo@example.com, Password: password</li>
                <li>• Email: admin@example.com, Password: password</li>
                <li>• Or create your own account using "Create New Account"</li>
              </ul>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;