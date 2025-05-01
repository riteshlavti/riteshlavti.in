export interface Testimonial {
  avatar: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    avatar: '/images/avatars/female.png',
    name: 'Priya Sharma',
    role: 'QA Lead, TechCorp',
    text: 'Ritesh is a fantastic team player and automation expert. His attention to detail and passion for quality are unmatched.',
    rating: 5
  },
  {
    avatar: '/images/avatars/male.png',
    name: 'Amit Verma',
    role: 'Senior Developer, InnovateX',
    text: 'Working with Ritesh was a pleasure. He brings innovative solutions and a positive attitude to every project.',
    rating: 4
  },
  {
    avatar: '/images/avatars/female.png',
    name: 'Sonal Gupta',
    role: 'Mentor & Automation Architect',
    text: 'Ritesh is always eager to learn and share knowledge. His mentorship has helped many in our community.',
    rating: 5
  },
  {
    avatar: '/images/avatars/male.png',
    name: 'Rahul Mehta',
    role: 'Product Manager, FinEdge',
    text: 'Ritesh consistently delivers high-quality work and is always ready to help the team. His technical skills are top-notch.',
    rating: 5
  },
  {
    avatar: '/images/avatars/female.png',
    name: 'Neha Singh',
    role: 'QA Engineer, SoftServe',
    text: "A true professional and a great mentor. Ritesh's guidance has been invaluable to my career growth.",
    rating: 4
  },
  {
    avatar: '/images/avatars/male.png',
    name: 'Vikram Patel',
    role: 'Automation Lead, CodeCrafters',
    text: 'Ritesh brings energy and innovation to every project. He is a go-to person for solving complex automation challenges.',
    rating: 5
  }
]; 