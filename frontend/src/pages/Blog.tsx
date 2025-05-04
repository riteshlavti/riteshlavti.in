import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

// Utility to strip HTML tags
function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
}

const Blog: React.FC = () => {
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDbPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(apiUrl('/blog/'));
        if (response.ok) {
          let dbPosts = await response.json();
          if (!Array.isArray(dbPosts)) dbPosts = [];
          dbPosts = dbPosts.sort((a: any, b: any) =>
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          );
          setAllPosts(dbPosts.map((post: any) => ({
            ...post,
            date: formatDate(post.created_at),
            read_time: post.read_time || '',
            image: post.featured_image || post.image || '',
          })));
        } else {
          setAllPosts([]);
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching blogs');
        setAllPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDbPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-12 lg:px-16 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight font-serif">
          My Blogs
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Sharing my thoughts, experiences, and insights about technology, development, and more.
        </p>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {loading ? (
          // Skeleton loader for 3 blog cards
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="w-full h-40 sm:h-48 bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 sm:p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4" />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : allPosts.length === 0 ? (
          <div>No blogs found.</div>
        ) : (
          allPosts.map((post) => {
            // Fallback gradient if image is missing
            const fallbackGradient = 'radial-gradient(circle at 60% 40%, #a5b4fc 0%, #f0abfc 60%, #f9fafb 100%)';
            const hasImage = !!post.image;
            return (
              <article key={post.slug} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform duration-200 hover:transform hover:scale-105">
                <div
                  className="relative w-full h-40 sm:h-48 flex items-stretch justify-center rounded-t-xl overflow-hidden"
                  style={{ background: !hasImage ? fallbackGradient : undefined }}
                >
                  {hasImage && (
                    <img
                      src={post.image}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 brightness-75 z-0"
                    />
                  )}
                  {hasImage && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="relative z-10 max-h-full max-w-full h-full object-contain"
                    />
                  )}
                  {!hasImage && (
                    <span className="relative z-10 text-gray-400 text-lg">No Image</span>
                  )}
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{post.date}</span>
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
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt && post.excerpt.trim() !== '' ? post.excerpt : stripHtml(post.content)}
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
            );
          })
        )}
      </div>

      {/* Newsletter Section */}
      {/*
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
      */}
    </div>
  );
};

export default Blog; 