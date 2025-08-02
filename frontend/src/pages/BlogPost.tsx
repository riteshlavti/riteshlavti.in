import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts as staticBlogPosts } from '../data/blogData';
import { FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { apiUrl } from '../api';
import ReactMarkdown, { Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import TurndownService from 'turndown';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  avatar?: string;
  isAuthor?: boolean;
  parentId?: string;
  parentAuthor?: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  // If already in 'Month Day, Year' format, return as is
  if (/[A-Za-z]+ \d{1,2}, \d{4}/.test(dateStr)) return dateStr;
  // If in 'YYYY-MM-DD' format, convert
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
      <div className="max-w-2xl mx-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-0.5 flex items-center justify-between">
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

        {/* Code content */}
        <pre className="p-4 overflow-x-auto text-sm font-mono text-zinc-800 dark:text-zinc-200">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};



const CodeRenderer = ({ inline, className, children, ...props }: CodeProps) => {
  if (inline) {
    return (
      <code 
        className={`bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-sm text-indigo-600 dark:text-indigo-300 font-mono ${className || ''}`}
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
  h1: ({ node, ...props }) => <h2 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: ({ node, ...props }) => <h3 className="text-2xl font-bold mt-6 mb-3" {...props} />,
  h3: ({ node, ...props }) => <h4 className="text-xl font-bold mt-4 mb-2" {...props} />,
  p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 ml-4" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 ml-4" {...props} />,
  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
  img: ({ node, src, alt, ...props }) => (
    <img
      className="my-6 rounded-lg shadow-md max-w-full h-auto mx-auto"
      src={src}
      alt={alt || ''} // Empty string if no alt provided (for decorative images)
      loading="lazy"
      {...props}
    />
  ),

  // Fixed anchor component with accessible content
  a: ({ node, children, href, ...props }) => (
    <a
      className="text-primary-600 dark:text-primary-400 hover:underline"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children || href || 'External link'} 
    </a>
  ),
  code: CodeRenderer
};

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const contentRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);
  const [blogPost, setBlogPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      if (id && staticBlogPosts[id]) {
        setBlogPost(staticBlogPosts[id]);
        setLoading(false);
      } else if (id) {
        try {
          const response = await fetch(apiUrl(`/blog/${id}`));
          if (response.ok) {
            const data = await response.json();
            setBlogPost(data);
          } else {
            setBlogPost(null);
          }
        } catch {
          setBlogPost(null);
        } finally {
          setLoading(false);
        }
      } else {
        setBlogPost(null);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;
      const el = articleRef.current;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top + window.scrollY;
      const sectionHeight = rect.height;
      const scrollY = window.scrollY;
      let percent = 0;
      if (sectionHeight > 0) {
        const scrolled = Math.min(Math.max(scrollY + windowHeight - sectionTop, 0), sectionHeight);
        percent = (scrolled / sectionHeight) * 100;
      }
      percent = Math.max(0, Math.min(100, percent));
      setProgress(percent);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // This would typically be an API call to save the comment
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'John Doe', // This would typically come from user authentication
        content: newComment,
        date: new Date().toLocaleDateString(),
        avatar: '/images/author-avatar.jpg',
        isAuthor: true // This would typically be determined by authentication
      };

      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string, parentAuthor: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      const reply: Comment = {
        id: Date.now().toString(),
        author: 'John Doe', // This would typically come from user authentication
        content: replyContent,
        date: new Date().toLocaleDateString(),
        avatar: '/images/author-avatar.jpg',
        isAuthor: true, // This would typically be determined by authentication
        parentId,
        parentAuthor
      };

      setComments(prev => [reply, ...prev]);
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  // Group comments and their replies
  const groupedComments = comments.reduce((acc, comment) => {
    if (!comment.parentId) {
      // This is a parent comment
      acc.push({
        ...comment,
        replies: comments.filter(c => c.parentId === comment.id)
      });
    }
    return acc;
  }, [] as (Comment & { replies: Comment[] })[]);

  if (loading) {
    return (
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6" />
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/6" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            The blog post you're looking for doesn't exist.
          </p>
          <Link 
            to="/blog"
            className="inline-block mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const renderComment = (comment: Comment, isReply: boolean = false) => (
    <div key={comment.id} className={`flex space-x-3 sm:space-x-4 ${isReply ? 'ml-6 sm:ml-12' : ''}`}>
      <img 
        src={comment.avatar || '/images/author-avatar.jpg'} 
        alt={comment.author} 
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
      />
      <div className="flex-1">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {comment.author}
              </span>
              {comment.parentId && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  replying to {comment.parentAuthor}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {comment.date}
              </span>
              {comment.isAuthor && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            {comment.content}
          </p>
          {!isReply && (
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              Reply
            </button>
          )}
        </div>
        {!isReply && replyingTo === comment.id && (
          <form onSubmit={(e) => handleSubmitReply(comment.id, comment.author, e)} className="mt-3">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <img 
                src="/images/author-avatar.jpg" 
                alt="Your avatar" 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  rows={2}
                />
                <div className="mt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !replyContent.trim()}
                    className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Reply'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-12 lg:px-16 py-8 relative">
      {/* Progress Indicator above BackToTop button */}
      <div style={{position: 'fixed', right: 24, bottom: 76, zIndex: 1000}}>
        <div className="relative flex items-center justify-center">
          {/* Progress ring background, rotated to start at top */}
          <svg className="absolute" width="40" height="40" style={{transform: 'rotate(-90deg)'}}>
            <circle cx="20" cy="20" r="18" stroke="#e5e7eb" strokeWidth="4" fill="none" />
            <circle
              cx="20"
              cy="20"
              r="18"
              stroke="url(#progress-gradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray={2 * Math.PI * 18}
              strokeDashoffset={2 * Math.PI * 18 * (1 - progress / 100)}
              strokeLinecap="round"
              style={{transition: 'stroke-dashoffset 0.3s'}}
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-cyan-400 shadow-lg border-2 border-white flex items-center justify-center text-white text-[10px] font-bold select-none z-10 p-0" style={{lineHeight: '1', padding: '0'}}>
            {Math.round(progress)}%
          </div>
        </div>
      </div>
      {/* Back Button aligned with content and styled */}
      <div className="max-w-3xl w-full mx-auto mb-8 px-0">
          <Link 
            to="/blog"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition-colors font-semibold text-base"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>
        </div>
      {/* Main Article Section with Progress Bar */}
      <div className="max-w-3xl w-full mx-auto flex flex-row relative px-0" style={{alignItems: 'flex-start'}}>
        {/* Article Section Only (header, image, content, tags) */}
        <div className="flex-1" ref={articleRef}>
        {/* Article Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{formatDate(blogPost.date || (blogPost.created_at ? blogPost.created_at.slice(0, 10) : ''))}</span>
              {blogPost.read_time && (
                <>
                  <span className="mx-2">•</span>
                  <span>{blogPost.read_time}</span>
                </>
              )}
            </div>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              title="Copy link to clipboard"
            >
              {copySuccess ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              )}
            </button>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {blogPost.title}
          </h1>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <img 
              src={blogPost.author?.avatar || blogPost.author_avatar || '/images/author-avatar.jpg'} 
              alt={blogPost.author?.name || blogPost.author_name || 'Author'} 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
            />
            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              {blogPost.author?.name || blogPost.author_name || 'Unknown Author'}
            </span>
          </div>
        </header>
          {/* Content & Tags with Image at the start */}
          <div className="relative flex flex-col items-center gap-6 sm:gap-8">
            {/* Featured Image at the top, centered */}
            {blogPost.featured_image && (
              <div className="w-full flex justify-center">
                <img
                  src={blogPost.featured_image}
                  alt={blogPost.title}
                  className="w-64 max-w-full object-cover rounded-xl shadow mb-6"
                />
              </div>
            )}
            <div className="flex-1 w-full" ref={articleRef}>
        {/* Article Content */}
              <article className="prose dark:prose-invert prose-lg mx-auto">
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    components={components}
                  >
                    {htmlToMarkdown(blogPost.content)}
                  </ReactMarkdown>
        </article>
        {/* Tags */}
        <div className="mt-8">
          <div className="flex items-center space-x-2">
            {Array.isArray(blogPost.tags) ? blogPost.tags.map((tag: string) => (
              <span 
                key={tag}
                className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            )) : null}
          </div>
        </div>
            </div>
          </div>
        </div>
      </div>
        {/* Share Section */}
      <div className="max-w-3xl mx-auto mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Share this article
          </h3>
          <div className="flex space-x-4">
            {/* X (Twitter) */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blogPost.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              title="Share on X"
            >
              <FaXTwitter className="w-6 h-6" />
            </a>
            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blogPost.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              title="Share on LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blogPost.title + ' ' + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              title="Share on WhatsApp"
            >
              <FaWhatsapp className="w-6 h-6" />
            </a>
          </div>
        </div>
        {/* Related Posts */}
        {Array.isArray(blogPost.relatedPosts) && blogPost.relatedPosts.length > 0 ? (
        <div className="max-w-3xl mx-auto mt-16 bg-gray-50 dark:bg-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Related Posts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPost.relatedPosts.map((postId: string) => {
                const post = staticBlogPosts[postId as keyof typeof staticBlogPosts];
                return (
                  <Link
                    key={postId}
                    to={`/blog/${postId}`}
                    className="block group bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                      {post?.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {post?.date} • {post?.readTime}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
    </div>
  );
};

export default BlogPost; 