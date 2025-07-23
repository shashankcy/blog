import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { blogService } from '../../services/blogService';
import { commentService } from '../../services/commentService';
import { BlogPost, Comment } from '../../types';
import { Calendar, User, Edit, Trash2, ArrowLeft, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadBlogAndComments();
    }
  }, [id]);

  const loadBlogAndComments = async () => {
    if (!id) return;
    
    try {
      const [blogData, commentsData] = await Promise.all([
        blogService.getBlogById(id),
        commentService.getCommentsByBlog(id)
      ]);
      
      setBlog(blogData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading blog:', error);
      toast.error('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async () => {
    if (!blog || !currentUser) return;
    
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.deleteBlog(blog.id);
        toast.success('Blog post deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete blog post');
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !currentUser || !blog) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setCommentLoading(true);
      await commentService.addComment({
        blogId: blog.id,
        content: newComment.trim(),
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Anonymous'
      });
      
      setNewComment('');
      await loadBlogAndComments(); // Reload comments
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentService.deleteComment(commentId);
        setComments(comments.filter(c => c.id !== commentId));
        toast.success('Comment deleted successfully');
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
        <Link to="/" className="text-blue-600 hover:text-blue-700">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </button>
      </div>

      {/* Blog Content */}
      <article className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{blog.authorName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
              </div>

              {currentUser?.uid === blog.authorId && (
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/edit/${blog.id}`}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={handleDeleteBlog}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
            <p className="text-xl text-gray-600 leading-relaxed">{blog.excerpt}</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {blog.content}
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-2 mb-6">
          <MessageCircle className="h-6 w-6 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Comments ({comments.length})
          </h2>
        </div>

        {/* Add Comment Form */}
        {currentUser ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Share your thoughts..."
                disabled={commentLoading}
              />
            </div>
            <button
              type="submit"
              disabled={commentLoading || !newComment.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {commentLoading ? 'Adding Comment...' : 'Add Comment'}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>{' '}
              to join the conversation
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{comment.authorName}</span>
                    <span>•</span>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                  
                  {currentUser?.uid === comment.authorId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}