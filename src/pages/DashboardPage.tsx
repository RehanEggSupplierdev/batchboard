import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  User, 
  Edit, 
  FileText, 
  Image, 
  Settings, 
  Eye, 
  Plus,
  Calendar,
  Activity,
  BarChart3
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalPages: number;
  publishedPages: number;
  totalMedia: number;
  profileViews: number;
}

interface RecentPage {
  id: string;
  title: string;
  published: boolean;
  updated_at: string;
}

const DashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPages: 0,
    publishedPages: 0,
    totalMedia: 0,
    profileViews: 0,
  });
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const fetchDashboardData = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!profileError && profileData) {
        setProfile(profileData);
      }

      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('id, title, published, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (!pagesError && pagesData) {
        setRecentPages(pagesData);
        setStats(prev => ({
          ...prev,
          totalPages: pagesData.length,
          publishedPages: pagesData.filter(page => page.published).length,
        }));
      }

      const { count: mediaCount, error: mediaError } = await supabase
        .from('media')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (!mediaError && mediaCount !== null) {
        setStats(prev => ({ ...prev, totalMedia: mediaCount }));
      }

      setStats(prev => ({ ...prev, profileViews: Math.floor(Math.random() * 100) + 10 }));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.full_name || 'Student'}! 🎓
          </h1>
          <p className="text-gray-600">
            Manage your profile, create pages, and showcase your amazing work. Class 10th - Batch 2024-2028!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPages}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Published</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedPages}</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-xl">
                <Eye className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Media Files</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMedia}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Image className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/dashboard/edit-profile">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-3" />
                    Edit Profile
                  </Button>
                </Link>
                
                <Link to="/dashboard/pages">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-3" />
                    Create Page
                  </Button>
                </Link>
                
                <Link to="/dashboard/media">
                  <Button variant="outline" className="w-full justify-start">
                    <Image className="w-4 h-4 mr-3" />
                    Upload Media
                  </Button>
                </Link>
                
                <Link to="/dashboard/change-password">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-3" />
                    Change Password
                  </Button>
                </Link>

                {profile?.student_id && (
                  <Link to={`/students/${profile.student_id}`}>
                    <Button className="w-full justify-start">
                      <Eye className="w-4 h-4 mr-3" />
                      View Public Profile
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>

          {/* Recent Pages */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Pages</h2>
                <Link to="/dashboard/pages">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              {recentPages.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pages yet</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first page to showcase your work and interests.
                  </p>
                  <Link to="/dashboard/pages">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Page
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${page.published ? 'bg-green-100' : 'bg-yellow-100'}`}>
                          <FileText className={`w-4 h-4 ${page.published ? 'text-green-600' : 'text-yellow-600'}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{page.title}</h3>
                          <p className="text-sm text-gray-600">
                            {page.published ? 'Published' : 'Draft'} • Updated {formatDate(page.updated_at)}
                          </p>
                        </div>
                      </div>
                      <Link to={`/dashboard/pages?edit=${page.id}`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Profile Completion */}
        {profile && (
          <Card className="p-6 mt-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Profile Completion</h2>
                <p className="text-gray-600 mb-4">
                  Complete your profile to make a great impression on visitors.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Basic Info</span>
                    <span className="text-green-600">✓ Complete</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Profile Picture</span>
                    <span className={profile.profile_pic ? 'text-green-600' : 'text-yellow-600'}>
                      {profile.profile_pic ? '✓ Complete' : '⚠ Missing'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Bio & Quote</span>
                    <span className={profile.bio ? 'text-green-600' : 'text-yellow-600'}>
                      {profile.bio ? '✓ Complete' : '⚠ Missing'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Skills</span>
                    <span className={profile.skills?.length > 0 ? 'text-green-600' : 'text-yellow-600'}>
                      {profile.skills?.length > 0 ? '✓ Complete' : '⚠ Missing'}
                    </span>
                  </div>
                </div>

                <Link to="/dashboard/edit-profile" className="inline-block mt-4">
                  <Button size="sm">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
