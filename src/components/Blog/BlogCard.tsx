import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  blog: BlogPost;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100">
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{blog.authorName}</span>
          </div>
          <span className="mx-2">•</span>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          <Link to={`/blog/${blog.id}`}>
            {blog.title}
          </Link>
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {blog.excerpt}
        </p>

        <Link 
          to={`/blog/${blog.id}`}
          className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium group"
        >
          <span>Read More</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}