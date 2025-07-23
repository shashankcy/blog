import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Hero from './components/Home/Hero';
import BlogList from './components/Blog/BlogList';
import BlogDetail from './components/Blog/BlogDetail';
import CreateBlog from './components/Blog/CreateBlog';
import EditBlog from './components/Blog/EditBlog';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import UserProfile from './components/Profile/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';

function HomePage() {
  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlogList />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreateBlog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditBlog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;