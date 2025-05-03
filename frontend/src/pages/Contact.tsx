import React, { useState, useContext, useEffect } from 'react';
import { FiMail, FiMapPin } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import { apiUrl } from '../api';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '', linkedin: '', mobile: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiUrl('/contact/'))
      .then(res => res.json())
      .then(data => {
        if (data && data.contact_profile_image) setProfileImage(data.contact_profile_image);
        else setProfileImage(null);
      })
      .catch(() => setProfileImage(null));
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Invalid email address.';
    if (!form.message.trim()) newErrors.message = 'Message is required.';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl('/contact/send-message'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setForm({ name: '', email: '', message: '', linkedin: '', mobile: '' });
        showToast('Message sent successfully!', 'success');
      } else {
        showToast(data.detail || 'Failed to send message.', 'error');
      }
    } catch (err) {
      showToast('Failed to send message. Please try again later.', 'error');
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="container mx-auto px-8 sm:px-12 lg:px-16 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Get in Touch
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact Form & Information */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
              <h2 className="text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-2 flex items-center gap-2">
                I'd love to hear from you!
                <FaHeart className="w-6 h-6 text-red-500 fill-red-500" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border-primary-400 dark:border-gray-600 bg-primary-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans text-base px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary-400 ${errors.name ? 'border-red-500' : ''}`}
                    disabled={submitting}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border-primary-400 dark:border-gray-600 bg-primary-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans text-base px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary-400 ${errors.email ? 'border-red-500' : ''}`}
                    disabled={submitting}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
              {/* New row for LinkedIn ID and Mobile Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn Profile</label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-primary-400 dark:border-gray-600 bg-primary-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans text-base px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary-400"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-primary-400 dark:border-gray-600 bg-primary-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans text-base px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary-400"
                    disabled={submitting}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border-primary-400 dark:border-gray-600 bg-primary-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans text-base px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary-400 placeholder-gray-500 dark:placeholder-gray-400 ${errors.message ? 'border-red-500' : ''}`}
                  disabled={submitting}
                  placeholder="Type your message here..."
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md transition-colors disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
              {success && <p className="text-green-500 text-center mt-2">Message sent! Thank you.</p>}
            </form>

          {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <FiMail className="w-6 h-6 text-gray-600 dark:text-gray-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                    <a href="mailto:riteshlavti@gmail.com" className="text-gray-600 dark:text-gray-400 hover:underline" aria-label="Send email to riteshlavti@gmail.com">riteshlavti@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <FiMapPin className="w-6 h-6 text-gray-600 dark:text-gray-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Location</h3>
                    <p className="text-gray-600 dark:text-gray-400">India</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Connect with Me
              </h2>
              <div className="flex space-x-4 items-center">
                <a
                  href="https://linkedin.com/in/riteshlavti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0077B5] hover:opacity-80 transition-opacity"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a
                  href="https://github.com/riteshlavti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#333] dark:text-white hover:opacity-80 transition-opacity"
                  aria-label="GitHub Profile"
                  title="GitHub"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E4405F] hover:opacity-80 transition-opacity"
                  aria-label="Instagram Profile"
                  title="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a
                  href="https://topmate.io/riteshlavti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1B1C31] font-semibold rounded-lg shadow transition-colors text-base gap-2 border border-[#E5E7EB]"
                  aria-label="Book a free session on Topmate"
                  title="Book a free session on Topmate"
                >
                  {/* Official Topmate SVG Icon from favicon.svg */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="8" fill="#2563EB"/>
                    <path d="M13.7 7.5V16H11.9V9.1H10.1V7.5H13.7Z" fill="white"/>
                  </svg>
                  Book a Free Session
                </a>
              </div>
            </div>
          </div>

          {/* Right: Profile Picture */}
          <div className="flex justify-center h-full">
            <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-xl mt-0 lg:mt-2">
              <img
                src={profileImage || "/images/profile.jfif"}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = "/images/profile.jfif"; }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 