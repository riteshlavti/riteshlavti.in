import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/forms/Button';
import { apiUrl } from '../../api';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch(apiUrl('/upload/profile'), {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const uploadData = await uploadRes.json();
      if (uploadRes.ok && uploadData.file_path) {
        // Update contact info with new profile image path
        const imageUrl = uploadData.file_path.replace(/^.*uploads/, '/uploads');
        const updateRes = await fetch(apiUrl('/contact/'), {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({ profile_image: imageUrl }),
        });
        if (updateRes.ok) {
          setProfileImage(imageUrl);
          setMessage('Profile image updated successfully!');
        } else {
          setMessage('Failed to update profile image in contact info.');
        }
      } else {
        setMessage('Failed to upload image.');
      }
    } catch (err) {
      setMessage('Error uploading image.');
    } finally {
      setUploading(false);
    }
  };

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

        <Link
          to="/admin/profile-management"
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Profile Management</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Update your hero and contact section profile pictures.
          </p>
        </Link>

        <Link
          to="/admin/testimonial-management"
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Testimonial Management</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Add and manage testimonials for your portfolio.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 