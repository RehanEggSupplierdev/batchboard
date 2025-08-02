import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Star, BookOpen, Camera } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { supabase } from '../lib/supabase';

interface FeaturedStudent {
  id: string;
  full_name: string;
  bio: string;
  student_id: string;
  profile_pic: string | null;
  skills: string[];
}

const HomePage: React.FC = () => {
  const [featuredStudents, setFeaturedStudents] = useState<FeaturedStudent[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    fetchFeaturedStudents();
    fetchTotalStudents();
  }, []);

  const fetchFeaturedStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, bio, student_id, profile_pic, skills')
        .eq('public', true)
        .limit(3);

      if (!error && data) {
        setFeaturedStudents(data);
      }
    } catch (error) {
      console.error('Error fetching featured students:', error);
    }
  };

  const fetchTotalStudents = async () => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('public', true);

      if (!error && count !== null) {
        setTotalStudents(count);
      }
    } catch (error) {
      console.error('Error fetching total students:', error);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-teal-300 opacity-20 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-300 opacity-15 rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white opacity-5 rounded-full"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Welcome to <span className="text-teal-300">BatchBoard</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Your Digital Class Community Platform
              </p>
            </div>
            
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Connect with classmates, showcase your projects, and create lasting memories 
              in your exclusive class portal. Build your digital presence and stay connected!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link to="/students">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 hover:shadow-lg px-8 py-4 text-lg font-semibold transition-all duration-200 transform hover:scale-105">
                  <Users className="w-5 h-5 mr-2" />
                  Meet the Class
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 hover:shadow-lg px-8 py-4 text-lg font-semibold transition-all duration-200 transform hover:scale-105">
                  Student Login
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Amazing Class</h2>
            <p className="text-lg text-gray-600">The final batch of SOSE Lajpat Nagar - making history together</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-6 shadow-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">{totalStudents}</h3>
              <p className="text-gray-600 font-medium">Amazing Classmates</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl mb-6 shadow-lg">
                <BookOpen className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">2024-28</h3>
              <p className="text-gray-600 font-medium">Our Batch Years</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl mb-6 shadow-lg">
                <Camera className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">Class</h3>
              <p className="text-gray-600 font-medium">10th Standard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Students */}
      {featuredStudents.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
              <p className="text-lg text-gray-600">SOSE Lajpat Nagar Class 10th - Batch 2024-2028</p>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get to know some of our amazing Class 10th students and their incredible talents
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredStudents.map((student) => (
                <Card key={student.id} hover className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                      {student.profile_pic ? (
                        <img 
                          src={student.profile_pic} 
                          alt={student.full_name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          {student.full_name.charAt(0)}
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {student.full_name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {student.bio || 'Hello! I\'m part of the amazing Class of 2025.'}
                      </p>
                    </div>
                    
                    {student.skills && student.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center">
                        {student.skills.slice(0, 3).map((skill, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <Link to={`/students/${student.student_id}`}>
                      <Button variant="outline" size="sm" className="mt-4">
                        View Profile
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 text-blue-600">
                <Star className="w-5 h-5" />
                <span className="font-medium">About BatchBoard</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900">
                Your Digital Class Community
              </h2>
              
              <div className="space-y-4 text-gray-600">
                <p>
                  BatchBoard is more than just a directory—it's your digital home where 
                  the SOSE Lajpat Nagar Class 10th (Batch 2024-2028) comes together to share stories, 
                  showcase achievements, and stay connected.
                </p>
                <p>
                  As the final batch of SOSE Lajpat Nagar, each student has their own customizable 
                  space to highlight their journey, projects, and personality. Create your legacy 
                  and make these years unforgettable!
                </p>
              </div>
              
              <Link to="/students">
                <Button className="mt-6">
                  Explore All Profiles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Personal Pages</h3>
                <p className="text-sm text-gray-600">Create custom pages for your projects and stories</p>
              </Card>
              <Card className="p-6 text-center">
                <Camera className="w-8 h-8 text-teal-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Media Gallery</h3>
                <p className="text-sm text-gray-600">Share photos, videos, and documents</p>
              </Card>
              <Card className="p-6 text-center">
                <Users className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Connect</h3>
                <p className="text-sm text-gray-600">Find and connect with all your classmates</p>
              </Card>
              <Card className="p-6 text-center">
                <Star className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Showcase</h3>
                <p className="text-sm text-gray-600">Highlight your skills and achievements</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;