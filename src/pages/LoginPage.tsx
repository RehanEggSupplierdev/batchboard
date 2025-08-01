import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, Users, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { useAuth } from '../contexts/AuthContext';

interface LoginForm {
  studentId: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');

    try {
      const result = await signIn(data.studentId, data.password);
      
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
              Welcome Back!
            </h2>
            <p className="text-gray-600">
              Sign in to access your BatchBoard profile
            </p>
          </div>

          <Card className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Login Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Student ID"
                type="text"
                placeholder="Enter your student ID"
                error={errors.studentId?.message}
                {...register('studentId', {
                  required: 'Student ID is required',
                  minLength: {
                    value: 3,
                    message: 'Student ID must be at least 3 characters',
                  },
                })}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                helperText="First time? Use your full name as password (e.g., 'AFTAB ALAM')"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 4,
                    message: 'Password must be at least 4 characters',
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

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">First Time Login?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use your Student ID (provided by admin)</li>
                <li>• Use your FULL NAME as the initial password</li>
                <li>• You'll be prompted to change your password after first login</li>
              </ul>
            </div>
          </Card>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Not a student?{' '}
              <a href="/students" className="text-blue-600 hover:text-blue-500">
                Browse public profiles
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;