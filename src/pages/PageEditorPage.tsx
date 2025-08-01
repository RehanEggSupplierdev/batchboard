import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Save, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Layout from '../components/Layout/Layout';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const schema = yup.object({
  title: yup.string().required('Title is required').max(100, 'Title too long'),
  content: yup.string().required('Content is required').max(10000, 'Content too long'),
  published: yup.boolean()
});

interface FormData {
  title: string;
  content: string;
  published: boolean;
}

const PageEditorPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { pageId } = useParams<{ pageId: string }>();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!pageId);

  const isEditing = pageId && pageId !== 'new';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      content: '',
      published: false
    }
  });

  const contentValue = watch('content');
  const titleValue = watch('title');

  useEffect(() => {
    if (isEditing && user) {
      fetchPage();
    } else {
      setInitialLoading(false);
    }
  }, [isEditing, user, pageId]);

  if (authLoading || initialLoading) {
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

  const fetchPage = async () => {
    if (!pageId || !user) return;

    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', pageId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        toast.error('Page not found');
        navigate('/dashboard/pages');
        return;
      }

      if (data) {
        setValue('title', data.title);
        setValue('content', data.content);
        setValue('published', data.published);
      }
    } catch (error) {
      toast.error('Failed to load page');
      navigate('/dashboard/pages');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setLoading(true);
    try {
      if (isEditing) {
        // Update existing page
        const { error } = await supabase
          .from('pages')
          .update({
            title: data.title,
            content: data.content,
            published: data.published
          })
          .eq('id', pageId)
          .eq('user_id', user.id);

        if (error) {
          toast.error('Failed to update page');
        } else {
          toast.success('Page updated successfully!');
          navigate('/dashboard/pages');
        }
      } else {
        // Create new page
        const { error } = await supabase
          .from('pages')
          .insert({
            user_id: user.id,
            title: data.title,
            content: data.content,
            published: data.published
          });

        if (error) {
          toast.error('Failed to create page');
        } else {
          toast.success('Page created successfully!');
          navigate('/dashboard/pages');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/pages')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pages
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Page' : 'Create New Page'}
              </h1>
              <p className="text-gray-600">
                {isEditing ? 'Update your page content' : 'Create a new page to showcase your work'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreview(!preview)}
            >
              {preview ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </>
              )}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <Card className="p-6">
            <Input
              label="Page Title"
              placeholder="Enter your page title..."
              error={errors.title?.message}
              {...register('title')}
            />
            
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  {...register('published')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="published" className="text-sm text-gray-700">
                  Publish this page (make it visible to others)
                </label>
              </div>
            </div>
          </Card>

          {/* Content Editor/Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor */}
            {!preview && (
              <Card className="p-6 lg:col-span-2">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <div className="text-xs text-gray-500 mb-2">
                    You can use Markdown formatting. Character count: {contentValue?.length || 0}/10,000
                  </div>
                </div>
                <textarea
                  {...register('content')}
                  rows={20}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Write your content here... You can use Markdown formatting:

# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet point
- Another point

1. Numbered list
2. Another item

[Link text](https://example.com)

```javascript
// Code block
console.log('Hello, world!');
```

> Blockquote text"
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
              </Card>
            )}

            {/* Preview */}
            {preview && (
              <Card className="p-6 lg:col-span-2">
                <div className="mb-4">
                  <h2 className="text-sm font-medium text-gray-700 mb-2">Preview</h2>
                </div>
                <div className="prose prose-blue max-w-none">
                  {titleValue && (
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                      {titleValue}
                    </h1>
                  )}
                  {contentValue ? (
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
                      {contentValue}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-gray-500 italic">
                      Your content preview will appear here...
                    </p>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Markdown Help */}
          {!preview && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Markdown Quick Reference</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Text Formatting</h4>
                  <div className="space-y-1 text-gray-600 font-mono">
                    <div>**bold text**</div>
                    <div>*italic text*</div>
                    <div>~~strikethrough~~</div>
                    <div>`inline code`</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Structure</h4>
                  <div className="space-y-1 text-gray-600 font-mono">
                    <div># Heading 1</div>
                    <div>## Heading 2</div>
                    <div>- Bullet point</div>
                    <div>1. Numbered list</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Links & Images</h4>
                  <div className="space-y-1 text-gray-600 font-mono">
                    <div>[Link](https://example.com)</div>
                    <div>![Image](image-url)</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Other</h4>
                  <div className="space-y-1 text-gray-600 font-mono">
                    <div>&gt; Blockquote</div>
                    <div>```code block```</div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/pages')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!isDirty}
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Update Page' : 'Create Page'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default PageEditorPage;