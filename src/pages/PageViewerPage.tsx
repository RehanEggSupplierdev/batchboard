import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Layout from '../components/Layout/Layout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import CommentSection from '../components/Comments/CommentSection';
import { supabase } from '../lib/supabase';

interface PageData {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
    student_id: string;
    profile_pic: string | null;
  };
}

const PageViewerPage: React.FC = () => {
  const { studentId, pageId } = useParams<{ studentId: string; pageId: string }>();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (studentId && pageId) {
      fetchPage();
    }
  }, [studentId, pageId]);

  const fetchPage = async () => {
    try {
      // First get the user_id from student_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('student_id', studentId)
        .single();

      if (profileError || !profileData) {
        setError('Student not found');
        return;
      }

      // Then get the page
      const { data, error } = await supabase
        .from('pages')
        .select(`
          *,
          profiles:user_id (
            full_name,
            student_id,
            profile_pic
          )
        `)
        .eq('id', pageId)
        .eq('user_id', profileData.user_id)
        .eq('published', true)
        .single();

      if (error || !data) {
        setError('Page not found or not published');
        return;
      }

      setPage(data);
    } catch (error) {
      console.error('Error fetching page:', error);
      setError('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading page...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !page) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || 'The page you\'re looking for doesn\'t exist or is not published.'}
            </p>
            <Link to={`/students/${studentId}`}>
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
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
          <Link to={`/students/${studentId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <Card className="p-8 mb-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">{page.title}</h1>
            
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                {page.profiles.profile_pic ? (
                  <img
                    src={page.profiles.profile_pic}
                    alt={page.profiles.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {getInitials(page.profiles.full_name)}
                    </span>
                  </div>
                )}
                <span className="font-medium">{page.profiles.full_name}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Published {formatDate(page.created_at)}</span>
              </div>
              
              {page.updated_at !== page.created_at && (
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>Updated {formatDate(page.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Page Content */}
        <Card className="p-8 mb-8">
          <div className="prose prose-blue max-w-none">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {page.content}
            </ReactMarkdown>
          </div>
        </Card>

        {/* Comments Section */}
        <CommentSection targetType="page" targetId={page.id} />
      </div>
    </Layout>
  );
};

export default PageViewerPage;