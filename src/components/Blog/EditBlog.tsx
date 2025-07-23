import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { blogService } from '../../services/blogService';
import { BlogPost } from '../../types';
import { Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadBlog();
    }
  }, [id]);

  const loadBlog = async () => {
    if (!id) return;
    
    try {
      const blogData = await blogService.getBlogById(id);
      if (blogData) {
        setBlog(blogData);
        setFormData({
          title: blogData.title,
          content: blogData.content,
          excerpt: blogData.excerpt
        });
      }
    } catch (error) {
      console.error('Error loading blog:', error);
      toast.error('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.excerpt) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!blog || !currentUser) {
      toast.error('Unauthorized');
      return;
    }

    if (currentUser.uid !== blog.authorId) {
      toast.error('You can only edit your own posts');
      return;
    }

    try {
      setSaving(true);
      await blogService.updateBlog(blog.id, {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt
      });
      toast.success('Blog post updated successfully!');
      navigate(`/blog/${blog.id}`);
    } catch (error) {
      toast.error('Failed to update blog post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
        <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700">
          Return to Home
        </button>
      </div>
    );
  }

  if (currentUser?.uid !== blog.authorId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
        <p className="text-gray-600 mb-4">You can only edit your own posts.</p>
        <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/blog/${blog.id}`)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Article</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Article</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Article Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
              placeholder="Enter an engaging title for your article"
              disabled={saving}
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt (Brief Summary)
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              value={formData.excerpt}
              onChange={handleChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Write a brief summary of your article"
              disabled={saving}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Article Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={15}
              value={formData.content}
              onChange={handleChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Write your article content here..."
              disabled={saving}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/blog/${blog.id}`)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}