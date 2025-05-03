import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../api';

const ProfileManagement: React.FC = () => {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [contactImage, setContactImage] = useState<string | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [contactFile, setContactFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [contactPreview, setContactPreview] = useState<string | null>(null);
  const [heroLoading, setHeroLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch current images
  useEffect(() => {
    fetch(apiUrl('/contact/'), {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setHeroImage(data.profile_image || null);
          setContactImage(data.contact_profile_image || null);
        }
      });
  }, []);

  // Preview for hero image
  useEffect(() => {
    if (heroFile) {
      const url = URL.createObjectURL(heroFile);
      setHeroPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setHeroPreview(null);
    }
  }, [heroFile]);

  // Preview for contact image
  useEffect(() => {
    if (contactFile) {
      const url = URL.createObjectURL(contactFile);
      setContactPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setContactPreview(null);
    }
  }, [contactFile]);

  // Upload handler for hero/contact
  const handleUpload = async (type: 'hero' | 'contact', file: File | null) => {
    if (!file) return;
    if (type === 'hero') setHeroLoading(true);
    if (type === 'contact') setContactLoading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch(apiUrl('/upload/profile'), {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      const uploadData = await uploadRes.json();
      if (uploadRes.ok && uploadData.file_path) {
        // Update contact info with new image path
        const imageUrl = uploadData.file_path.replace(/^.*uploads/, '/uploads');
        const updateRes = await fetch(apiUrl('/contact/'), {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
          body: JSON.stringify(type === 'hero' ? { profile_image: imageUrl } : { contact_profile_image: imageUrl }),
        });
        if (updateRes.ok) {
          if (type === 'hero') {
            setHeroImage(imageUrl);
            setHeroFile(null);
            setHeroPreview(null);
          } else {
            setContactImage(imageUrl);
            setContactFile(null);
            setContactPreview(null);
          }
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
      if (type === 'hero') setHeroLoading(false);
      if (type === 'contact') setContactLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => navigate('/admin')}
        className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        ← Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold dark:text-white mb-8">Profile Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hero Section Profile Image */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col items-start border border-primary-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 dark:text-white text-left w-full">Hero Section Profile Picture</h2>
          <form onSubmit={e => { e.preventDefault(); handleUpload('hero', heroFile); }} className="flex flex-col gap-3 w-full items-start">
            <input type="file" accept="image/*" onChange={e => setHeroFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-gray-700 dark:file:text-gray-300" />
            <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-60" disabled={heroLoading || !heroFile}>
              {heroLoading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
          {/* Preview before upload */}
          {heroPreview && (
            <img src={heroPreview} alt="Hero Preview" className="w-32 h-32 rounded-full mt-4 object-cover border-2 border-primary-300 shadow" />
          )}
          {/* Uploaded image after upload */}
          {!heroPreview && heroImage && (
            <img src={heroImage} alt="Hero Profile Preview" className="w-32 h-32 rounded-full mt-4 object-cover border-4 border-primary-200 shadow" />
          )}
        </div>
        {/* Contact Section Profile Image */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col items-start border border-primary-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 dark:text-white text-left w-full">Contact Section Profile Picture</h2>
          <form onSubmit={e => { e.preventDefault(); handleUpload('contact', contactFile); }} className="flex flex-col gap-3 w-full items-start">
            <input type="file" accept="image/*" onChange={e => setContactFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-gray-700 dark:file:text-gray-300" />
            <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-60" disabled={contactLoading || !contactFile}>
              {contactLoading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
          {/* Preview before upload */}
          {contactPreview && (
            <img src={contactPreview} alt="Contact Preview" className="w-32 h-32 rounded-full mt-4 object-cover border-2 border-primary-300 shadow" />
          )}
          {/* Uploaded image after upload */}
          {!contactPreview && contactImage && (
            <img src={contactImage} alt="Contact Profile Preview" className="w-32 h-32 rounded-full mt-4 object-cover border-4 border-primary-200 shadow" />
          )}
        </div>
      </div>
      {message && <p className="mt-6 text-center text-sm text-primary-600 font-medium">{message}</p>}
    </div>
  );
};

export default ProfileManagement; 