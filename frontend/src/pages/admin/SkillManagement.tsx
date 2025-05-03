import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../api';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon_url: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const SkillManagement: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill>>({});
  const { showToast } = useToast();
  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const fetchSkills = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/skills'));
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      showToast('Failed to fetch skills', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      showToast('Only image files are allowed', 'error');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      showToast('File size must be less than 5MB', 'error');
      return false;
    }
    return true;
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedIcon(file);
      }
    }
  };

  const removeSelectedIcon = () => {
    setSelectedIcon(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileInputDisplayText = () => {
    if (!selectedIcon) return 'No file chosen';
    return selectedIcon.name;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(apiUrl('/upload/image'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsUploading(true);
    try {
      let iconUrl = currentSkill.icon_url;
      if (selectedIcon) {
        iconUrl = await uploadImage(selectedIcon);
      }
      const url = isEditing ? apiUrl(`/skills/${currentSkill.id}`) : apiUrl('/skills');
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ ...currentSkill, icon_url: iconUrl }),
      });
      if (response.ok) {
        showToast(
          `Skill ${isEditing ? 'updated' : 'created'} successfully`,
          'success'
        );
        fetchSkills();
        resetForm();
      } else {
        throw new Error('Failed to save skill');
      }
    } catch (error) {
      showToast('Failed to save skill', 'error');
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      const response = await fetch(apiUrl(`/skills/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        showToast('Skill deleted successfully', 'success');
        fetchSkills();
      } else {
        throw new Error('Failed to delete skill');
      }
    } catch (error) {
      showToast('Failed to delete skill', 'error');
    }
  };

  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill);
    setSelectedIcon(null);
    setIsEditing(true);
  };

  const resetForm = () => {
    setCurrentSkill({});
    setSelectedIcon(null);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      <h1 className="text-3xl font-bold mb-8 dark:text-white">
        {isEditing ? 'Edit Skill' : 'Add New Skill'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mb-8">
        <Input
          label="Name"
          value={currentSkill.name || ''}
          onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
          required
        />
        <Input
          label="Category"
          value={currentSkill.category || ''}
          onChange={(e) => setCurrentSkill({ ...currentSkill, category: e.target.value })}
          required
          placeholder="e.g., Frontend, Backend, Database"
        />
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Proficiency (1-100)
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={currentSkill.proficiency || 50}
            onChange={(e) => setCurrentSkill({ ...currentSkill, proficiency: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            {currentSkill.proficiency || 50}%
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Icon
          </label>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="block w-full text-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                />
                <span className="absolute right-0 top-0 h-full flex items-center pr-3 text-sm text-gray-500">
                  {getFileInputDisplayText()}
                </span>
              </div>
            </div>
            {selectedIcon && (
              <div className="mt-4 relative group">
                <img
                  src={URL.createObjectURL(selectedIcon)}
                  alt={currentSkill.name || 'Selected icon'}
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeSelectedIcon}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            {currentSkill.icon_url && !selectedIcon && (
              <div className="mt-4 relative group">
                <img
                  src={currentSkill.icon_url}
                  alt={currentSkill.name || 'Current icon'}
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCurrentSkill({ ...currentSkill, icon_url: '' });
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <Button type="submit" isLoading={isLoading || isUploading}>
            {isEditing ? 'Update Skill' : 'Add Skill'}
          </Button>
          {isEditing && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-bold mb-4 dark:text-white">Existing Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              {skill.icon_url && (
                <img
                  src={skill.icon_url}
                  alt={skill.name}
                  className="w-12 h-12 object-contain"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold dark:text-white">
                  {skill.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {skill.category}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${skill.proficiency}%` }}
                ></div>
              </div>
              <div className="text-right text-sm text-gray-600 dark:text-gray-300">
                {skill.proficiency}%
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => handleEdit(skill)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(skill.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillManagement; 