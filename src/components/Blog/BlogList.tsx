import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import { BlogPost } from '../../types';
import BlogCard from './BlogCard';
import { Search, Loader } from 'lucide-react';

export default function BlogList() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const blogData = await blogService.getAllBlogs();
      setBlogs(blogData);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.authorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader className="h-5 w-5 animate-spin" />
          <span>Loading articles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Blog Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            {searchTerm ? 'No articles found matching your search.' : 'No articles published yet.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}