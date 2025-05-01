// Featured projects data and types for use across the app

export interface FeaturedProject {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  url?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export const featuredProjects: FeaturedProject[] = [
  {
    title: 'Automated Candy Crush Game',
    description: 'A automated candy crush game using python and appium',
    technologies: ['Python', 'Appium', 'Pytest'],
    image: '/images/appium.png',
    url: 'https://github.com/yourusername/candy-crush-automation',
    githubUrl: 'https://github.com/yourusername/candy-crush-automation',
    liveUrl: '',
  },
  {
    title: 'Automated Rdklu website flows',
    description: 'Automated rdklu website flows using java and selenium',
    technologies: ['Java', 'Selenium', 'TestNG'],
    image: '/images/selenium.png',
    url: 'https://github.com/yourusername/rdklu-automation',
    githubUrl: 'https://github.com/yourusername/rdklu-automation',
    liveUrl: '',
  },
  {
    title: 'Blogging Website',
    description: 'A full-stack blogging website with JS, EJS and CSS',
    technologies: ['JS', 'EJS', 'CSS'],
    image: '/images/blogging_project.png',
    url: 'https://github.com/yourusername/blogging-website',
    githubUrl: 'https://github.com/yourusername/blogging-website',
    liveUrl: '',
  },
]; 