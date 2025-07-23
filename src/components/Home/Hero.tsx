import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PenTool, BookOpen, Users } from 'lucide-react';

export default function Hero() {
  const { currentUser } = useAuth();

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Share Your <span className="text-blue-600">Stories</span><br />
            Inspire the <span className="text-indigo-600">World</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join our vibrant community of writers and readers. Publish your thoughts, 
            discover amazing content, and connect with like-minded individuals who share your passions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {currentUser ? (
              <>
                <Link
                  to="/create"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Writing
                </Link>
                <Link
                  to="/profile"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  View Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Writing</h3>
              <p className="text-gray-600">
                Intuitive editor that makes writing and publishing articles a breeze
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rich Content</h3>
              <p className="text-gray-600">
                Discover diverse articles across various topics and interests
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Engage with other writers through comments and discussions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}