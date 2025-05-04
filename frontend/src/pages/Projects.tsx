import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../api';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  created_at?: string;
  excerpt?: string;
}

// Utility to strip HTML tags
function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(apiUrl('/projects?limit=100&skip=0'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setProjects(data);
        } else {
          setProjects([]);
        }
        setError(null);
      })
      .catch(err => setError(err.message || 'Error fetching projects'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-12 lg:px-16 py-8">
      <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4 text-center tracking-tight font-serif">All Projects</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 text-center">
        Explore a collection of my featured and recent projects—showcasing my work, skills, and creativity across web, automation, and more.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="w-full h-40 sm:h-48 bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 sm:p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4" />
                <div className="flex gap-2 mt-4">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full text-center py-8 text-red-500">{error}</div>
        ) : projects.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">No projects found.</div>
        ) : (
          projects.map((project) => {
            // Fallback gradient if image is missing
            const fallbackGradient = 'radial-gradient(circle at 60% 40%, #a5b4fc 0%, #f0abfc 60%, #f9fafb 100%)';
            const hasImage = !!project.image_url;
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group"
                tabIndex={0}
                style={{ textDecoration: 'none' }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform duration-200 hover:transform hover:scale-105 flex flex-col h-full">
                  <div
                    className="relative w-full h-40 sm:h-48 flex items-stretch justify-center rounded-t-xl overflow-hidden"
                    style={{ background: !hasImage ? fallbackGradient : undefined }}
                  >
                    {hasImage && (
                      <img
                        src={project.image_url}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 brightness-75 z-0"
                      />
                    )}
                    {hasImage && (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="relative z-10 max-h-full max-w-full h-full object-contain"
                      />
                    )}
                    {!hasImage && (
                      <span className="relative z-10 text-gray-400 text-lg">No Image</span>
                    )}
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-1 mb-1">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 sm:py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2">
                      {project.title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {stripHtml(project.excerpt && project.excerpt.trim() !== '' ? project.excerpt : project.description)}
                    </p>
                    <div className="flex gap-2 mt-auto">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 sm:px-3 sm:py-1 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors text-xs font-semibold"
                          onClick={e => e.stopPropagation()}
                        >
                          Source
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 sm:px-3 sm:py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-xs font-semibold"
                          onClick={e => e.stopPropagation()}
                        >
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Projects; 