import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { blogService } from '../../services/blogService';
import { BlogPost } from '../../types';
import BlogCard from '../Blog/BlogCard';
import { User, Calendar, FileText, Loader } from 'lucide-react';

export default function UserProfile() {
  const { currentUser } = useAuth();
  const [userBlogs, setUserBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadUserBlogs();
    }
  }, [currentUser]);

  const loadUserBlogs = async () => {
    if (!currentUser) return;
    
    try {
      const blogs = await blogService.getBlogsByAuthor(currentUser.uid);
      setUserBlogs(blogs);
    } catch (error) {
      console.error('Error loading user blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  const joinDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long'
  }).format(new Date(currentUser.metadata.creationTime || ''));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-white" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentUser.displayName || 'Anonymous User'}
            </h1>
            <p className="text-gray-600 mb-2">{currentUser.email}</p>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Joined {joinDate}</span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{userBlogs.length}</div>
            <div className="text-sm text-gray-600">Articles Published</div>
          </div>
        </div>
      </div>

      {/* User's Blog Posts */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="h-6 w-6 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-900">Your Articles</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader className="h-5 w-5 animate-spin" />
              <span>Loading your articles...</span>
            </div>
          </div>
        ) : userBlogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Yet</h3>
            <p className="text-gray-600 mb-6">You haven't published any articles yet. Start writing to share your thoughts with the world!</p>
            <a
              href="/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
            >
              Write Your First Article
            </a>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}