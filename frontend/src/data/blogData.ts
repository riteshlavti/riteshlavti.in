// Blog data and types for use across the app

import { apiUrl } from '../api';

export interface BlogPostData {
  title: string;
  date: string;
  readTime: string;
  content: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  relatedPosts: string[];
  excerpt?: string;
  slug?: string;
  image?: string;
}

export const blogPosts: { [id: string]: BlogPostData } = {
  '1': {
    title: 'How to Build a Portfolio Website with React',
    date: '2024-04-01',
    readTime: '5 min read',
    content: '<p>This is a sample blog post about building a portfolio website with React.</p>',
    tags: ['React', 'Portfolio', 'Web Development'],
    author: {
      name: 'Ritesh Kumar',
      avatar: '/images/author-avatar.jpg',
    },
    relatedPosts: ['2', '3'],
    excerpt: 'Learn how to build a modern portfolio website using React and best practices.',
    slug: 'how-to-build-portfolio-website',
    image: '/images/blog/blog1.jpg',
  },
  '2': {
    title: 'Mastering Test Automation in 2024',
    date: '2024-03-15',
    readTime: '7 min read',
    content: '<p>Automation is key to modern software development. Here are the latest trends.</p>',
    tags: ['Automation', 'Testing'],
    author: {
      name: 'Ritesh Kumar',
      avatar: '/images/author-avatar.jpg',
    },
    relatedPosts: ['1', '3'],
    excerpt: 'Stay ahead in test automation with these expert tips and tools.',
    slug: 'mastering-test-automation',
    image: '/images/blog/blog2.jpg',
  },
  '3': {
    title: 'Top 10 JavaScript Frameworks in 2024',
    date: '2024-02-28',
    readTime: '6 min read',
    content: '<p>Explore the most popular JavaScript frameworks for building web apps in 2024.</p>',
    tags: ['JavaScript', 'Frameworks'],
    author: {
      name: 'Ritesh Kumar',
      avatar: '/images/author-avatar.jpg',
    },
    relatedPosts: ['1', '2'],
    excerpt: 'A rundown of the top JavaScript frameworks you should know.',
    slug: 'top-10-js-frameworks',
    image: '/images/blog/blog3.jpg',
  },
};

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export async function fetchLatestBlogsFromDB(): Promise<BlogPostData[]> {
  const res = await fetch(apiUrl('/blog/?limit=3&skip=0'));
  if (!res.ok) throw new Error('Failed to fetch blog posts');
  let data = await res.json();
  if (!Array.isArray(data)) data = [];
  data = data.sort((a: any, b: any) =>
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
  return data.slice(0, 3).map((b: any) => ({
    title: b.title,
    date: formatDate(b.created_at),
    readTime: b.read_time || '',
    content: b.content || '',
    tags: b.tags || [],
    author: {
      name: b.author_name || '',
      avatar: b.author_avatar || '',
    },
    relatedPosts: b.related_posts || [],
    excerpt: b.excerpt || '',
    slug: b.slug,
    image: b.featured_image || b.image || '',
  }));
} 