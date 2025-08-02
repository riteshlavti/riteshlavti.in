import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiUrl } from '../api';
import ReactMarkdown, { Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import TurndownService from 'turndown';

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
const htmlToMarkdown = (html: string): string => {
  const turndown = new TurndownService({
    codeBlockStyle: 'fenced',
    headingStyle: 'atx'
  });

  turndown.addRule('quillCodeBlocks', {
    filter: (node) => node.nodeName === 'PRE' && node.classList.contains('ql-syntax'),
    replacement: (content) => {
      const cleanedContent = content.replace(/\n+$/, '');
      return `\n\`\`\`text\n${cleanedContent}\n\`\`\`\n`;
    }
  });

  return turndown.turndown(html);
};

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  node?: any;
}

const SimpleCodeBlock = ({ children, className = '', ...props }: CodeProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const codeContent = String(children).replace(/\n$/, '');
    navigator.clipboard.writeText(codeContent)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Copy failed:', err));
  };

  return (
    <div className="my-6">
      <div className="max-w-[720px] mx-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 shadow-sm overflow-hidden">

        {/* Header Bar */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 flex items-center justify-between">
          <div className="flex space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>

          <button
            onClick={handleCopy}
            className={`transition-all rounded-full w-5 h-5 flex items-center justify-center text-white/90 hover:bg-white/20 ${
              copied ? 'bg-green-500 text-white' : ''
            }`}
            aria-label="Copy code"
          >
            {copied ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 012 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Code Content */}
        <pre className="p-4 overflow-x-auto text-sm font-mono text-zinc-800 dark:text-zinc-100 leading-relaxed">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};

export const CodeRenderer = ({ inline, className, children, ...props }: CodeProps) => {
  if (inline) {
    return (
      <code
        className={`bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded-md text-sm text-indigo-600 dark:text-indigo-300 font-mono tracking-tight ${className || ''}`}
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <SimpleCodeBlock className={className} {...props}>
      {children}
    </SimpleCodeBlock>
  );
};


// Custom components to render Markdown elements
const components: Components = {
  h1: ({ node, ...props }) => (
    <h1 className="text-4xl font-extrabold tracking-tight mt-10 mb-6 text-gray-900 dark:text-gray-100" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-3xl font-bold tracking-tight mt-8 mb-5 text-gray-900 dark:text-gray-100" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-gray-100" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="mb-5 text-[17px] leading-relaxed text-gray-700 dark:text-gray-300" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="list-disc pl-6 mb-5 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal pl-6 mb-5 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
  ),
  li: ({ node, ...props }) => (
    <li className="ml-2 leading-relaxed" {...props} />
  ),
  a: ({ node, children, href, ...props }) => (
    <a
      className="text-blue-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`External link to ${href}`}
      {...props}
    >
      {children}
    </a>
  ),
  img: ({ node, src, alt, ...props }) => (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      className="rounded-xl shadow-lg my-6 mx-auto border border-gray-200 dark:border-gray-700 max-w-full"
      {...props}
    />
  ),
  code: CodeRenderer
};


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
        <div className="prose dark:prose-invert prose-lg mx-auto font-sans leading-relaxed tracking-wide">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            components={components}
          >
            {htmlToMarkdown(project.description)}
          </ReactMarkdown>
        </div>
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