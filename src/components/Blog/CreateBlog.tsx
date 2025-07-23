import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { blogService } from '../../services/blogService';
import { Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateBlog() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: ''
  });
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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

    if (!currentUser) {
      toast.error('You must be logged in to create a blog post');
      return;
    }

    try {
      setLoading(true);
      await blogService.createBlog({
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Anonymous'
      });
      toast.success('Blog post created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Article</h1>

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
              disabled={loading}
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
              placeholder="Write a brief summary of your article (this will appear in the article cards)"
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Publishing...' : 'Publish Article'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}