import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Eye,
  FileText,
  Star,
  Share2
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import CommentSection from '../components/Comments/CommentSection';
import { supabase, trackProfileView } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface StudentProfile {
  id: string;
  user_id: string;
  student_id: string;
  full_name: string;
  bio: string | null;
  skills: string[] | null;
  social_links: Record<string, string> | null;
  profile_pic: string | null;
  quote: string | null;
  created_at: string;
}

interface StudentPage {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const StudentProfilePage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [pages, setPages] = useState<StudentPage[]>([]);
  const [viewCount, setViewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (studentId) {
      fetchProfile();
      fetchPages();
      fetchViewCount();
    }
  }, [studentId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('student_id', studentId)
        .eq('public', true)
        .single();

      if (error) {
        setError('Student profile not found');
        return;
      }

      if (data) {
        setProfile(data);
        
        // Track profile view
        if (data.id) {
          await trackProfileView(data.id, user?.id);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    if (!studentId) return;

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('student_id', studentId)
        .single();

      if (profileData) {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('user_id', profileData.user_id)
          .eq('published', true)
          .order('updated_at', { ascending: false });

        if (!error && data) {
          setPages(data);
        }
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  const fetchViewCount = async () => {
    if (!studentId) return;

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('student_id', studentId)
        .single();

      if (profileData) {
        const { count, error } = await supabase
          .from('profile_views')
          .select('*', { count: 'exact', head: true })
          .eq('profile_id', profileData.id);

        if (!error && count !== null) {
          setViewCount(count);
        }
      }
    } catch (error) {
      console.error('Error fetching view count:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.full_name} - BatchBoard`,
          text: `Check out ${profile?.full_name}'s profile on BatchBoard!`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Profile URL copied to clipboard!');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, string> = {
      github: '🐙',
      linkedin: '💼',
      twitter: '🐦',
      instagram: '📷',
      facebook: '📘',
      youtube: '📺',
      behance: '🎨',
      dribbble: '🏀',
      medium: '📝',
      website: '🌐',
    };
    return icons[platform.toLowerCase()] || '🔗';
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || 'The student profile you\'re looking for doesn\'t exist or is private.'}
            </p>
            <Link to="/students">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Students
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/students">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Students
            </Button>
          </Link>
        </div>

        {/* Profile Header */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0">
              {profile.profile_pic ? (
                <img
                  src={profile.profile_pic}
                  alt={profile.full_name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-4xl font-bold text-white">
                    {getInitials(profile.full_name)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.full_name}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex items-center space-x-1">
                    <span>ID: {profile.student_id}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDate(profile.created_at)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{viewCount} views</span>
                  </span>
                </div>
              </div>

              {profile.bio && (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {profile.quote && (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 bg-blue-50 p-4 rounded-r-lg">
                  "{profile.quote}"
                </blockquote>
              )}

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleShare} variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills & Interests */}
            {profile.skills && profile.skills.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Skills & Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Custom Pages */}
            {pages.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" />
                  Pages & Projects
                </h2>
                <div className="space-y-4">
                  {pages.map((page) => (
                    <div key={page.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h3 className="font-semibold text-gray-900 mb-2">{page.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {page.content.replace(/[#*`]/g, '').substring(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Updated {new Date(page.updated_at).toLocaleDateString()}
                        </span>
                        <Link to={`/students/${studentId}/pages/${page.id}`}>
                          <Button variant="ghost" size="sm">
                            Read More
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Comments Section */}
            <CommentSection targetType="profile" targetId={profile.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Links */}
            {profile.social_links && Object.keys(profile.social_links).length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
                <div className="space-y-3">
                  {Object.entries(profile.social_links).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <span className="text-xl">{getSocialIcon(platform)}</span>
                      <span className="font-medium text-gray-900 capitalize">{platform}</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-semibold text-gray-900">{viewCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Published Pages</span>
                  <span className="font-semibold text-gray-900">{pages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Skills Listed</span>
                  <span className="font-semibold text-gray-900">{profile.skills?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-900">{formatDate(profile.created_at)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfilePage;