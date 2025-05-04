import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(apiUrl(`/projects/${id}`))
      .then(res => res.json())
      .then(data => {
        setProject(data);
        setError(null);
      })
      .catch(err => setError(err.message || 'Error fetching project'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-12 lg:px-16 py-8">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6" />
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-4/6 mb-4" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/6 mb-4" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 sm:px-12 lg:px-16 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Project Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            The project you're looking for doesn't exist.
          </p>
          <Link 
            to="/projects"
            className="inline-block mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-12 lg:px-16 py-8">
      <div className="max-w-3xl w-full mx-auto">
        <Link 
          to="/projects"
          className="inline-flex items-center px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition-colors font-semibold text-sm sm:text-base mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">{project.title}</h1>
        <div className="w-full flex justify-center mb-6 sm:mb-8">
          <img
            src={project.image_url}
            alt={project.title}
            className="max-w-full max-h-60 sm:max-h-[480px] rounded-xl shadow object-contain"
            style={{ height: 'auto', width: 'auto', display: 'block' }}
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 sm:py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-xs sm:text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-base sm:text-lg">
          <span dangerouslySetInnerHTML={{ __html: project.description }} />
        </p>
        <div className="flex gap-2 sm:gap-4">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors text-sm sm:text-base font-semibold"
            >
              Source
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm sm:text-base font-semibold"
            >
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 