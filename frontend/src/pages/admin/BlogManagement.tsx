import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { apiUrl } from '../../api';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  featured_image: string;
  created_at: string;
  author_name: string;
  author_avatar: string;
  is_published: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

const BlogManagement: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [readTime, setReadTime] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [relatedPosts, setRelatedPosts] = useState<string[]>([]);
  const [relatedInput, setRelatedInput] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allSlugs, setAllSlugs] = useState<string[]>([]);

  const initialPostState: BlogPost = {
    id: '',
    slug: '',
    title: '',
    content: '',
    featured_image: '',
    created_at: '',
    author_name: '',
    author_avatar: '',
    is_published: false,
  };
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>(initialPostState);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/blog/'), {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      showToast('Failed to fetch blog posts', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    // Fetch all tags
    fetch(apiUrl('/tags/'), {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
    })
      .then(res => res.json())
      .then(data => setAllTags(Array.isArray(data) ? data.map((tag: any) => tag.name) : []));
    // Fetch all blog slugs
    fetch(apiUrl('/blog/'), {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
    })
      .then(res => res.json())
      .then(data => setAllSlugs(Array.isArray(data) ? data.map((post: any) => post.slug) : []));
  }, []);

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

    const response = await fetch(apiUrl('/upload/image'), {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
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
      const formData = new FormData();
      formData.append('title', currentPost.title || '');
      formData.append('content', currentPost.content || '');
      formData.append('excerpt', excerpt || '');
      formData.append('is_published', String(currentPost.is_published || false));
      formData.append('read_time', readTime || '');
      formData.append('author_name', currentPost.author_name || 'Ritesh Lavti');
      formData.append('author_avatar', currentPost.author_avatar || '/images/profile.jfif');
      formData.append('related_posts', relatedPosts.join(','));
      formData.append('tags', tags.join(','));
      if (selectedImages.length > 0) {
        formData.append('image', selectedImages[0]);
      }

      const url = isEditing ? apiUrl(`/blog/${currentPost.slug}`) : apiUrl('/blog/');
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      });

      if (response.ok) {
        showToast(`Blog post ${isEditing ? 'updated' : 'created'} successfully`, 'success');
        fetchPosts();
        resetForm();
      } else {
        throw new Error('Failed to save blog post');
      }
    } catch (error) {
      showToast('Failed to save blog post', 'error');
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(apiUrl(`/blog/${slug}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      });

      if (response.ok) {
        showToast('Blog post deleted successfully', 'success');
        fetchPosts();
      } else {
        throw new Error('Failed to delete blog post');
      }
    } catch (error) {
      showToast('Failed to delete blog post', 'error');
    }
  };

  const handleEdit = async (post: BlogPost) => {
    try {
      const response = await fetch(apiUrl(`/blog/${post.slug}`), {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched blog post data:', data); // Debug log
        setCurrentPost({
          id: data.id,
          slug: data.slug,
          title: data.title || '',
          content: data.content || '',
          featured_image: data.featured_image || '',
          created_at: data.created_at || '',
          author_name: data.author_name || '',
          author_avatar: data.author_avatar || '',
          is_published: data.is_published,
        });
        setReadTime(data.read_time || '');
        setTags(data.tags || []);
        setRelatedPosts(data.related_posts || []);
        setExcerpt(data.excerpt || '');
        setSelectedImages([]);
        setIsEditing(true);
      } else {
        showToast('Failed to fetch blog post details', 'error');
      }
    } catch (error) {
      showToast('Failed to fetch blog post details', 'error');
    }
  };

  const resetForm = () => {
    setCurrentPost(initialPostState);
    setSelectedImages([]);
    setIsEditing(false);
    setTags([]);
    setRelatedPosts([]);
    setReadTime('');
    setExcerpt('');
    setTagInput('');
    setRelatedInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  console.log('CurrentPost before render:', currentPost);

  const filteredTagSuggestions = allTags.filter(
    tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(tag)
  );
  const filteredRelatedSuggestions = allSlugs.filter(
    slug => slug.toLowerCase().includes(relatedInput.toLowerCase()) && !relatedPosts.includes(slug)
  );

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
        {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h1>
      {(isEditing || !currentPost.id) && (
        <form onSubmit={handleSubmit} className="max-w-2xl mb-8">
          <Input
            label="Title"
            value={currentPost.title || ''}
            onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Content
            </label>
            <ReactQuill
              value={currentPost.content || ''}
              onChange={value => setCurrentPost({ ...currentPost, content: value })}
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
              
              {/* Selected Images Preview */}
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

              {/* Current Post Image */}
              {currentPost.featured_image && selectedImages.length === 0 && (
                <div className="mt-2 relative group">
                  <img
                    src={currentPost.featured_image}
                    alt={currentPost.title || 'Current post'}
                    className="max-w-xs rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPost({ ...currentPost, featured_image: '' });
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Read Time (e.g. '5 min read')</label>
            <input
              type="text"
              value={readTime}
              onChange={e => setReadTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    e.preventDefault();
                    if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
                    setTagInput('');
                  }
                }}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Add tag and press Enter"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span key={tag} className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full px-3 py-1 text-sm font-medium flex items-center">
                  {tag}
                  <button type="button" className="ml-2 text-red-500" onClick={() => setTags(tags.filter((_, i) => i !== idx))}>&times;</button>
                </span>
              ))}
            </div>
            {filteredTagSuggestions.length > 0 && tagInput && (
              <ul className="bg-white border rounded shadow mt-1 absolute z-10 w-full">
                {filteredTagSuggestions.map(suggestion => (
                  <li
                    key={suggestion}
                    className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                    onClick={() => {
                      setTags([...tags, suggestion]);
                      setTagInput('');
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Related Posts (slugs)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={relatedInput}
                onChange={e => setRelatedInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && relatedInput.trim()) {
                    e.preventDefault();
                    if (!relatedPosts.includes(relatedInput.trim())) setRelatedPosts([...relatedPosts, relatedInput.trim()]);
                    setRelatedInput('');
                  }
                }}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Add related post slug and press Enter"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {relatedPosts.map((slug, idx) => (
                <span key={slug} className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-medium flex items-center">
                  {slug}
                  <button type="button" className="ml-2 text-red-500" onClick={() => setRelatedPosts(relatedPosts.filter((_, i) => i !== idx))}>&times;</button>
                </span>
              ))}
            </div>
            {filteredRelatedSuggestions.length > 0 && relatedInput && (
              <ul className="bg-white border rounded shadow mt-1 absolute z-10 w-full">
                {filteredRelatedSuggestions.map(suggestion => (
                  <li
                    key={suggestion}
                    className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                    onClick={() => {
                      setRelatedPosts([...relatedPosts, suggestion]);
                      setRelatedInput('');
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Excerpt (short summary)</label>
            <input
              type="text"
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit" isLoading={isLoading || isUploading}>
              {isEditing ? 'Update Post' : 'Create Post'}
            </Button>
            {isEditing && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}

      <h2 className="text-2xl font-bold mb-4 dark:text-white">Existing Posts</h2>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              {post.title}
            </h3>
            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {post.content.substring(0, 150)}...
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => handleEdit(post)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(post.slug)}
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

export default BlogManagement; 