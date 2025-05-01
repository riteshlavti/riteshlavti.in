import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/forms/Button';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 dark:text-gray-300">
            Welcome, {user?.name}
          </span>
          <Button
            variant="secondary"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/blog"
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Blog Posts</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your blog posts, create new ones, and edit existing content.
          </p>
        </Link>

        <Link
          to="/admin/projects"
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Projects</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Update your portfolio projects, add new ones, and manage their details.
          </p>
        </Link>

        <Link
          to="/admin/skills"
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Skills</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your skills, add new ones, and update proficiency levels.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 