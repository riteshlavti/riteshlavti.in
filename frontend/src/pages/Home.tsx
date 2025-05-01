import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  SiPython, 
  SiAppium, 
  SiSelenium, 
  SiJenkins 
} from 'react-icons/si';
import { DiJava } from 'react-icons/di';
import { FiSend } from 'react-icons/fi';
import { blogPosts } from '../data/blogData';
import { featuredProjects } from '../data/featuredProjectsData';
import TestimonialsSlider from '../components/TestimonialsSlider';
import { FaQuoteLeft } from 'react-icons/fa';

const Home: React.FC = () => {
  const skills = [
    { name: 'Python', icon: SiPython, color: '#3776AB' },
    { name: 'Java', icon: DiJava, color: '#007396' },
    { name: 'Appium', icon: SiAppium, color: '#00B5B8' },
    { name: 'Selenium', icon: SiSelenium, color: '#43B02A' },
    { name: 'Requests', icon: FiSend, color: '#2b7bb9' },
    { name: 'Jenkins', icon: SiJenkins, color: '#D24939' }
  ];

  const recentPosts = Object.values(blogPosts)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  return (
    <div className="space-y-24 mb-32">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl font-bold text-gray-900 dark:text-darkTextPrimary mb-6"
              >
                Hi, I'm{' '}
                <motion.span 
                  className="relative inline-block"
                >
                  <motion.span
                    className="absolute inset-0 -skew-y-3 bg-yellow-200 dark:bg-yellow-400/50"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    style={{ zIndex: -1 }}
                  />
                  <span className="relative text-primary-600 dark:text-primary-400">
                    Ritesh Lavti
                  </span>
                </motion.span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-gray-600 dark:text-darkTextSecondary mb-8"
              >
                SDET | Building scalable automation for UI, API & mobile | Exploring AI across automation, development & productivity | Passionate about learning, investing & mentoring
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center md:justify-start space-x-4"
              >
                <Link
                  to="/about"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Learn More
                </Link>
                <Link
                  to="/contact"
                  className="bg-gray-200 dark:bg-darkSurface text-gray-800 dark:text-darkTextPrimary px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-darkBorder transition-colors"
                >
                  Contact Me
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-primary-500 shadow-xl">
                <img
                  src="/images/profile.jfif"
                  alt="Your Name"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl">
                <motion.span
                  animate={{
                    rotate: [0, 14, -8, 14, -4, 10, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: 3,
                    repeatType: "reverse",
                  }}
                >
                  👋
                </motion.span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-6">
            <span className="px-4 py-1 rounded-md bg-primary-100 text-primary-800 dark:bg-darkSurface dark:text-darkPrimaryAccent inline-block">Skills & Expertise</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => {
            const Icon = skill.icon as React.ElementType;
            return (
              <div
                key={skill.name}
                className="bg-white dark:bg-darkSurface p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center space-x-3"
              >
                <Icon size={32} color={skill.color} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-darkTextPrimary">
                  {skill.name}
                </h3>
              </div>
            );
          })}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-6">
            <span className="px-4 py-1 rounded-md bg-primary-100 text-primary-800 dark:bg-darkSurface dark:text-darkPrimaryAccent inline-block">Featured Projects</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <div
                key={project.title}
                className="bg-white dark:bg-darkSurface rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-t-xl border-t-4 border-white"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-darkTextPrimary mb-2">
                    {project.url ? (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary-600 dark:text-darkPrimaryAccent">
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </h3>
                  <p className="text-gray-600 dark:text-darkTextSecondary mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-primary-100 dark:bg-darkBorder text-primary-800 dark:text-darkPrimaryAccent rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {project.githubUrl && project.githubUrl !== '' && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors text-xs font-semibold"
                      >
                        Source
                      </a>
                    )}
                    {project.liveUrl && project.liveUrl !== '' && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-xs font-semibold"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <div className="py-4 rounded-2xl mt-2">
        <h2 className="text-xl font-bold text-center mb-2">
          <span className="px-4 py-1 rounded-md bg-primary-100 text-primary-800 dark:bg-darkSurface dark:text-darkPrimaryAccent inline-block">Testimonials</span>
        </h2>
        <TestimonialsSlider />
      </div>

      {/* Recent Blog Posts Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-6">
            <span className="px-4 py-1 rounded-md bg-primary-100 text-primary-800 dark:bg-darkSurface dark:text-darkPrimaryAccent inline-block">Recent Blog Posts</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPosts.map((post) => (
              <div key={post.slug} className="bg-white dark:bg-darkSurface rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-darkTextPrimary mb-2">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-darkTextSecondary mb-2">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <p className="text-gray-600 dark:text-darkTextSecondary mb-4">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="text-primary-600 dark:text-darkPrimaryAccent hover:text-primary-700 dark:hover:text-darkPrimaryHover font-medium mt-auto"
                >
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 