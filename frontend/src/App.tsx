import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import BlogManagement from './pages/admin/BlogManagement';
import ProjectManagement from './pages/admin/ProjectManagement';
import SkillManagement from './pages/admin/SkillManagement';
import ProfileManagement from './pages/admin/ProfileManagement';
import TestimonialManagement from './pages/admin/TestimonialManagement';
import BackToTop from './components/BackToTop';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Layout>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/blog"
                    element={
                      <ProtectedRoute requireAdmin>
                        <BlogManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/projects"
                    element={
                      <ProtectedRoute requireAdmin>
                        <ProjectManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/skills"
                    element={
                      <ProtectedRoute requireAdmin>
                        <SkillManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/profile-management"
                    element={
                      <ProtectedRoute requireAdmin>
                        <ProfileManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/testimonial-management"
                    element={
                      <ProtectedRoute requireAdmin>
                        <TestimonialManagement />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                <BackToTop />
              </Layout>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
