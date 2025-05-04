import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { apiUrl } from '../../api';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  github_url: string;
  live_url: string;
  technologies: string[];
  excerpt: string;
  is_featured?: boolean;
  featured_order?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [technologies, setTechnologies] = useState<string>('');
  const [excerpt, setExcerpt] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/projects'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      showToast('Failed to fetch projects', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      const validImages = newImages.filter(validateFile);
      if (selectedImages.length + validImages.length > MAX_FILES) {
        showToast(`Maximum ${MAX_FILES} images allowed`, 'error');
        return;
      }
      setSelectedImages(prev => [...prev, ...validImages]);
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const getFileInputDisplayText = () => {
    if (selectedImages.length === 0) return 'No file chosen';
    if (selectedImages.length === 1) return selectedImages[0].name;
    return `${selectedImages.length} files selected`;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(apiUrl('/upload/image?type=project'), {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
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
      let imageUrl = currentProject.image_url;
      if (selectedImages.length > 0) {
        imageUrl = await uploadImage(selectedImages[0]);
      }
      const projectData = {
        ...currentProject,
        image_url: imageUrl,
        technologies: technologies.split(',').map(tech => tech.trim()),
        excerpt,
        is_featured: !!currentProject.is_featured,
        featured_order: currentProject.is_featured ? currentProject.featured_order : null,
      };
      const url = isEditing ? apiUrl(`/projects/${currentProject.id}`) : apiUrl('/projects');
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      if (response.ok) {
        showToast(
          `Project ${isEditing ? 'updated' : 'created'} successfully`,
          'success'
        );
        fetchProjects();
        resetForm();
      } else {
        throw new Error('Failed to save project');
      }
    } catch (error) {
      showToast('Failed to save project', 'error');
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(apiUrl(`/projects/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        showToast('Project deleted successfully', 'success');
        fetchProjects();
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      showToast('Failed to delete project', 'error');
    }
  };

  const handleEdit = (project: Project) => {
    resetForm();
    setCurrentProject({
      ...project,
      is_featured: !!project.is_featured,
      featured_order: project.featured_order ?? undefined,
    });
    setTechnologies(project.technologies.join(', '));
    setExcerpt(project.excerpt || '');
    setSelectedImages([]);
    setIsEditing(true);
  };

  const resetForm = () => {
    setCurrentProject({});
    setTechnologies('');
    setExcerpt('');
    setSelectedImages([]);
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
        {isEditing ? 'Edit Project' : 'Create New Project'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mb-8">
        <Input
          label="Title"
          value={currentProject.title || ''}
          onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
          required
        />
        <Input
          label="Excerpt (short summary)"
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          required={!isEditing}
          placeholder="A short summary for project cards (max 300 chars)"
          maxLength={300}
        />
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Description
          </label>
          <ReactQuill
            value={currentProject.description || ''}
            onChange={value => setCurrentProject({ ...currentProject, description: value })}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                ['clean']
              ]
            }}
            className="bg-white dark:bg-gray-800 dark:text-white"
            theme="snow"
          />
        </div>
        <Input
          label="GitHub URL"
          value={currentProject.github_url || ''}
          onChange={(e) => setCurrentProject({ ...currentProject, github_url: e.target.value })}
          type="url"
        />
        <Input
          label="Live URL"
          value={currentProject.live_url || ''}
          onChange={(e) => setCurrentProject({ ...currentProject, live_url: e.target.value })}
          type="url"
        />
        <Input
          label="Technologies (comma-separated)"
          value={technologies}
          onChange={(e) => setTechnologies(e.target.value)}
          placeholder="React, TypeScript, Node.js"
        />
        <div className="mb-4 flex items-center gap-4">
          <label className="flex items-center text-sm font-medium dark:text-gray-200">
            <input
              type="checkbox"
              checked={!!currentProject.is_featured}
              onChange={e => setCurrentProject({ ...currentProject, is_featured: e.target.checked })}
              className="mr-2"
            />
            Featured Project
          </label>
          {currentProject.is_featured && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium dark:text-gray-200" htmlFor="featured_order">Featured Order:</label>
              <input
                id="featured_order"
                type="number"
                min={1}
                value={currentProject.featured_order ?? ''}
                onChange={e => setCurrentProject({ ...currentProject, featured_order: e.target.value === '' ? undefined : Number(e.target.value) })}
                className="w-20 px-2 py-1 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
                placeholder="Order"
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Images
          </label>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                  className="block w-full text-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                />
                <span className="absolute right-0 top-0 h-full flex items-center pr-3 text-sm text-gray-500">
                  {getFileInputDisplayText()}
                </span>
              </div>
            </div>
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Selected ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeSelectedImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {currentProject.image_url && selectedImages.length === 0 && (
              <div className="mt-2 relative group">
                <img
                  src={currentProject.image_url}
                  alt={currentProject.title || 'Current project'}
                  className="max-w-xs rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCurrentProject({ ...currentProject, image_url: '' });
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
            {isEditing ? 'Update Project' : 'Create Project'}
          </Button>
          {isEditing && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-bold mb-4 dark:text-white">Existing Projects</h2>
      <div className="grid gap-4">
        {isLoading && !isEditing ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
              <div className="flex gap-2">
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectManagement; 