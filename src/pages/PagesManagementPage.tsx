import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  Search
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Page {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const PagesManagementPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [filteredPages, setFilteredPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    if (user) {
      fetchPages();
    }
  }, [user]);

  useEffect(() => {
    filterPages();
  }, [pages, searchTerm, filter]);

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

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (!error && data) {
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPages = () => {
    let filtered = pages;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(page =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filter === 'published') {
      filtered = filtered.filter(page => page.published);
    } else if (filter === 'draft') {
      filtered = filtered.filter(page => !page.published);
    }

    setFilteredPages(filtered);
  };

  const togglePublished = async (pageId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('pages')
        .update({ published: !currentStatus })
        .eq('id', pageId);

      if (error) {
        toast.error('Failed to update page status');
      } else {
        await fetchPages();
        toast.success(currentStatus ? 'Page unpublished' : 'Page published');
      }
    } catch (error) {
      toast.error('Failed to update page status');
    }
  };

  const deletePage = async (pageId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);

      if (error) {
        toast.error('Failed to delete page');
      } else {
        await fetchPages();
        toast.success('Page deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContentPreview = (content: string) => {
    return content.replace(/[#*`]/g, '').substring(0, 100) + (content.length > 100 ? '...' : '');
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Pages</h1>
            <p className="text-gray-600">
              Create and manage your custom pages to showcase your work and interests.
            </p>
          </div>
          <Link to="/dashboard/pages/new">
            <Button className="mt-4 sm:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Create New Page
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="lg:w-48">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'draft')}
              >
                <option value="all">All Pages</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredPages.length} of {pages.length} pages
            </span>
            {(searchTerm || filter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </Card>

        {/* Pages List */}
        {filteredPages.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {pages.length === 0 ? 'No pages yet' : 'No pages found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {pages.length === 0 
                  ? 'Create your first page to showcase your work, projects, or thoughts.'
                  : 'Try adjusting your search terms or clearing the filters.'
                }
              </p>
              {pages.length === 0 && (
                <Link to="/dashboard/pages/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Page
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPages.map((page) => (
              <Card key={page.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {page.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {page.published ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Eye className="w-3 h-3 mr-1" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Draft
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">
                      {getContentPreview(page.content)}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Updated {formatDate(page.updated_at)}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Link to={`/dashboard/pages/edit/${page.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublished(page.id, page.published)}
                    >
                      {page.published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePage(page.id, page.title)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PagesManagementPage;