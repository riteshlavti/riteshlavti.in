import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts as staticBlogPosts } from '../data/blogData';
import { apiUrl } from '../api';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  // If already in 'Month Day, Year' format, return as is
  if (/[A-Za-z]+ \d{1,2}, \d{4}/.test(dateStr)) return dateStr;
  // If in 'YYYY-MM-DD' format, convert
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const Blog: React.FC = () => {
  // Use state for blog data
  const [blogData, setBlogData] = useState<{ [slug: string]: any }>({ ...staticBlogPosts });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDbPosts = async () => {
      try {
        const response = await fetch(apiUrl('/blog/'));
        if (response.ok) {
          const dbPosts = await response.json();
          // Merge db posts into blogData by slug
          const merged = { ...staticBlogPosts };
          dbPosts.forEach((post: any) => {
            merged[post.slug] = {
              ...merged[post.slug], // keep static fields if needed
              ...post,              // overwrite/add with db fields
            };
          });
          setBlogData(merged);
        }
      } catch (error) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchDbPosts();
  }, []);

  const allPosts = Object.values(blogData);

  return (
    <div className="container mx-auto px-8 sm:px-12 lg:px-16 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          My Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Sharing my thoughts, experiences, and insights about technology, development, and more.
        </p>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div>Loading...</div>
        ) : (
          allPosts.map((post) => (
            <article key={post.slug} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform duration-200 hover:transform hover:scale-105">
              <img 
                src={post.featured_image || post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded-t-xl border-t-4 border-white"
              />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>{formatDate(post.date || (post.created_at ? post.created_at.slice(0, 10) : ''))}</span>
                  {post.read_time && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{post.read_time}</span>
                    </>
                  )}
                </div>
                <Link 
                  to={`/blog/${post.slug}`}
                  className="block"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {(post.tags || []).map((tag: string) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Newsletter Section */}
      <div className="mt-16 bg-gray-50 dark:bg-gray-700 rounded-xl p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Subscribe to My Newsletter
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Get the latest posts delivered right to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Blog; 