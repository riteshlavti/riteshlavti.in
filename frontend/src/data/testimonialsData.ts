import { useEffect, useState } from 'react';
import { apiUrl } from '../api';

export interface Testimonial {
  avatar: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  verify_url?: string;
}

export function useTestimonials(): Testimonial[] {
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch(apiUrl('/testimonials/'))
      .then(res => res.ok ? res.json() : [])
      .then((dbTestimonials: any[]) => {
        const mapped = dbTestimonials.map(t => ({
          avatar: '',
          name: t.name,
          role: t.role || '',
          text: t.text,
          rating: t.rating ?? 5,
          verify_url: t.verify_url,
        }));
        setAllTestimonials(mapped);
      })
      .catch(() => setAllTestimonials([]));
  }, []);

  return allTestimonials;
} 