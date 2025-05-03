import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../api';
import { useNavigate } from 'react-router-dom';

interface TestimonialForm {
  name: string;
  role: string;
  text: string;
  rating: number;
  verify_url?: string;
}

interface Testimonial extends TestimonialForm {
  id: number;
  created_at: string;
}

const defaultForm: TestimonialForm = {
  name: '',
  role: '',
  text: '',
  rating: 5,
  verify_url: '',
};

const TestimonialManagement: React.FC = () => {
  const [form, setForm] = useState<TestimonialForm>(defaultForm);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(apiUrl('/testimonials/'), {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    })
      .then(res => res.json())
      .then(setTestimonials)
      .catch(() => setTestimonials([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'rating' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(apiUrl('/testimonials/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newTestimonial = await res.json();
        setTestimonials(t => [...t, newTestimonial]);
        setForm(defaultForm);
        setMessage('Testimonial added successfully!');
      } else {
        setMessage('Failed to add testimonial.');
      }
    } catch {
      setMessage('Error adding testimonial.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(apiUrl(`/testimonials/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (res.ok) {
        setTestimonials(t => t.filter(testimonial => testimonial.id !== id));
        setMessage('Testimonial deleted successfully!');
      } else {
        setMessage('Failed to delete testimonial.');
      }
    } catch {
      setMessage('Error deleting testimonial.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
        onClick={() => navigate('/admin')}
      >
        ← Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Testimonial Management</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 max-w-xl">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Add New Testimonial</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-gray-200">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-gray-200">Role</label>
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-gray-200">Testimonial Text</label>
          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
            rows={4}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-gray-200">Rating</label>
          <input
            type="number"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            min={1}
            max={5}
            className="w-24 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-gray-200">Verify URL (optional)</label>
          <input
            type="url"
            name="verify_url"
            value={form.verify_url}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="https://..."
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Testimonial'}
        </button>
        {message && <p className="mt-3 text-sm text-primary-600 dark:text-primary-400">{message}</p>}
      </form>
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Existing Testimonials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">No testimonials found.</div>
        ) : testimonials.map(t => (
          <div key={t.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{t.name}</div>
            <div className="mb-1 text-primary-600 dark:text-primary-400">{t.role}</div>
            <div className="mb-2 text-gray-700 dark:text-gray-200 italic">"{t.text}"</div>
            <div className="mb-1 text-yellow-500">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
            {t.verify_url && (
              <a href={t.verify_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 underline">Verify</a>
            )}
            <div className="text-xs text-gray-400 mt-2">Added: {new Date(t.created_at).toLocaleString()}</div>
            <button
              onClick={() => handleDelete(t.id)}
              className="mt-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialManagement; 