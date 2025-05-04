// Featured projects data and types for use across the app

import { apiUrl } from '../api';

export interface FeaturedProject {
  id: number;
  title: string;
  description: string;
  excerpt?: string;
  technologies: string[];
  image: string;
  url?: string;
  githubUrl?: string;
  liveUrl?: string;
  created_at?: string;
}

export async function fetchFeaturedProjects(): Promise<FeaturedProject[]> {
  const res = await fetch(apiUrl('/projects/featured'));
  if (!res.ok) throw new Error('Failed to fetch featured projects');
  let data = await res.json();
  if (!Array.isArray(data)) data = [];
  return data.map((p: any) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    excerpt: p.excerpt,
    technologies: Array.isArray(p.technologies) ? p.technologies : [],
    image: p.image_url,
    url: p.live_url,
    githubUrl: p.github_url,
    liveUrl: p.live_url,
    created_at: p.created_at,
  }));
} 