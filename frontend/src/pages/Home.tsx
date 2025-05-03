import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  SiPython, 
  SiAppium, 
  SiSelenium, 
  SiJenkins 
} from 'react-icons/si';
import { DiJava } from 'react-icons/di';
import { FiSend } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
import { TbApi } from 'react-icons/tb';
import { fetchFeaturedProjects, FeaturedProject } from '../data/featuredProjectsData';
import TestimonialsSlider from '../components/TestimonialsSlider';
import { FaQuoteLeft, FaArrowRight } from 'react-icons/fa';
import { fetchLatestBlogsFromDB, BlogPostData } from '../data/blogData';
import { apiUrl } from '../api';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

// Staggered animation variants for grid containers and items
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] // easeOutBack for a nice pop
    } 
  },
};

// Sparkling stars background for hero section (night mode only)
type Star = {
  top: number;
  left: number;
  size: number;
  delay: number;
  vx: number;
  vy: number;
};
function StarsBackground({ numStars = 80 }) {
  const [stars, setStars] = useState<Star[]>([]);

  // Helper to check if a new star is too close to existing ones
  function isTooClose(newStar: Star, arr: Star[], minDist = 5) {
    return arr.some(star => {
      const dx = newStar.left - star.left;
      const dy = newStar.top - star.top;
      return Math.sqrt(dx * dx + dy * dy) < minDist;
    });
  }

  useEffect(() => {
    const arr: Star[] = [];
    let attempts = 0;
    while (arr.length < numStars && attempts < numStars * 20) {
      const candidate: Star = {
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.03, // slow movement
        vy: (Math.random() - 0.5) * 0.03,
      };
      if (!isTooClose(candidate, arr, 5)) {
        arr.push(candidate);
      }
      attempts++;
    }
    setStars(arr);
  }, [numStars]);

  // Animate movement
  useEffect(() => {
    let frame: number;
    function animate() {
      setStars(prevStars =>
        prevStars.map(star => {
          let newTop = star.top + star.vy;
          let newLeft = star.left + star.vx;
          // Wrap around
          if (newTop < 0) newTop = 100;
          if (newTop > 100) newTop = 0;
          if (newLeft < 0) newLeft = 100;
          if (newLeft > 100) newLeft = 0;
          return { ...star, top: newTop, left: newLeft };
        })
      );
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="bg-white rounded-full opacity-80 animate-twinkle dark:bg-white"
            style={{
              position: 'absolute',
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              filter: 'blur(0.5px)',
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle 2.5s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}

const Home: React.FC = () => {
  const skills = [
    { name: 'Python', icon: SiPython, color: '#3776AB' },
    { name: 'Java', icon: DiJava, color: '#007396' },
    { name: 'Appium', icon: SiAppium, color: '#00B5B8' },
    { name: 'Selenium', icon: SiSelenium, color: '#43B02A' },
    { name: 'Playwright', icon: FaRobot, color: '#45ba6a' },
    { name: 'Rest Assured', icon: TbApi, color: '#16a34a' },
    { name: 'Requests', icon: FiSend, color: '#2b7bb9' },
    { name: 'Jenkins', icon: SiJenkins, color: '#D24939' }
  ];

  const [recentPosts, setRecentPosts] = useState<BlogPostData[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState<string | null>(null);

  useEffect(() => {
    setBlogsLoading(true);
    fetchLatestBlogsFromDB()
      .then(setRecentPosts)
      .catch((err) => setBlogsError(err.message || 'Error fetching blogs'))
      .finally(() => setBlogsLoading(false));
  }, []);

  // Section refs
  const heroRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const blogRef = useRef(null);

  const heroInView = useInView(heroRef, { once: false, margin: '-100px' });
  const skillsInView = useInView(skillsRef, { once: false, margin: '-100px' });
  const projectsInView = useInView(projectsRef, { once: false, margin: '-100px' });
  const testimonialsInView = useInView(testimonialsRef, { once: false, margin: '-100px' });
  const blogInView = useInView(blogRef, { once: false, margin: '-100px' });

  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  useEffect(() => {
    setProjectsLoading(true);
    fetchFeaturedProjects()
      .then(setFeaturedProjects)
      .catch((err) => setProjectsError(err.message || 'Error fetching projects'))
      .finally(() => setProjectsLoading(false));
  }, []);

  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiUrl('/contact/'))
      .then(res => res.json())
      .then(data => {
        if (data && data.profile_image) setProfileImage(data.profile_image);
        else setProfileImage(null);
      })
      .catch(() => setProfileImage(null));
  }, []);

  return (
    <div className="space-y-24 mb-8">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        variants={sectionVariants}
        initial="hidden"
        animate={heroInView ? 'visible' : 'hidden'}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 relative"
      >
        {/* Sparkling stars in dark mode only */}
        <div className="hidden dark:block absolute inset-0 w-full h-full z-0">
          <StarsBackground numStars={80} />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
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
                {[{
                  to: '/about',
                  label: 'Learn More',
                  extraClass: 'bg-primary-600 text-white',
                  hoverBorder: 'dark:group-hover:border-primary-400',
                }, {
                  to: '/contact',
                  label: 'Contact Me',
                  extraClass: 'bg-gray-200 dark:bg-darkSurface text-gray-800 dark:text-darkTextPrimary',
                  hoverBorder: 'dark:group-hover:border-primary-400',
                }].map((btn, idx) => (
                  <div
                    key={btn.to}
                    className="inline-block transition-all duration-300 dark:scale-100 dark:hover:scale-105 dark:hover:shadow-[0_4px_24px_0_rgba(59,130,246,0.18)]"
                  >
                    <Link
                      to={btn.to}
                      className={`${btn.extraClass} px-6 py-3 rounded-lg font-semibold relative overflow-hidden shadow-md transition-colors group border-2 border-transparent`}
                      style={{ boxShadow: '0 2px 8px 0 rgba(59,130,246,0.08)' }}
                    >
                      <span className="relative z-10">
                        {btn.label}
                      </span>
                      <span className={`absolute inset-0 rounded-lg pointer-events-none ${btn.hoverBorder} transition-all duration-300 border-2 border-transparent dark:group-hover:shadow-[0_0_0_3px_rgba(59,130,246,0.18)]`}></span>
                    </Link>
                  </div>
                ))}
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
                  src={profileImage ? (profileImage.startsWith('/uploads/') ? apiUrl(profileImage) : profileImage) : "/images/profile.jfif"}
                  alt="Your Name"
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = "/images/profile.jfif"; }}
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
      </motion.section>

      {/* Skills Section */}
      <motion.section
        ref={skillsRef}
        variants={sectionVariants}
        initial="hidden"
        animate={skillsInView ? 'visible' : 'hidden'}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-6">
            <span
              className="inline-block px-6 py-1.5 rounded-md bg-primary-600 text-white dark:bg-primary-400 dark:text-primary-900 font-semibold shadow-sm tracking-wide select-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:bg-primary-700 dark:hover:bg-primary-300 hover:no-underline"
            >
              Skills & Expertise
            </span>
          </h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate={skillsInView ? 'visible' : 'hidden'}
          >
          {skills.map((skill) => {
            const Icon = skill.icon as React.ComponentType<{ size?: number; color?: string }>;
            return (
              <motion.div
                key={skill.name}
                variants={staggerItem}
                className="bg-white dark:bg-darkSurface p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center space-x-3"
              >
                <Icon size={32} color={skill.color} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-darkTextPrimary">
                  {skill.name}
                </h3>
              </motion.div>
            );
          })}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Projects Section */}
      <motion.section
        ref={projectsRef}
        variants={sectionVariants}
        initial="hidden"
        animate={projectsInView ? 'visible' : 'hidden'}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-6">
            <span
              className="inline-block px-6 py-1.5 rounded-md bg-primary-600 text-white dark:bg-primary-400 dark:text-primary-900 font-semibold shadow-sm tracking-wide select-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:bg-primary-700 dark:hover:bg-primary-300 hover:no-underline"
            >
              Featured Projects
            </span>
          </h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
            variants={staggerContainer}
            initial="hidden"
            animate={projectsInView ? 'visible' : 'hidden'}
          >
            {projectsLoading ? (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">Loading projects...</div>
            ) : projectsError ? (
              <div className="col-span-full text-center py-8 text-red-500">{projectsError}</div>
            ) : featuredProjects.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">No projects found.</div>
            ) : featuredProjects.map((project) => {
              // Determine the main link for the card and title
              const mainUrl = project.url || project.liveUrl || project.githubUrl || '';
              const isExternal = !!mainUrl;
              return (
                <div key={project.id || project.title}>
                  {isExternal ? (
                    <a
                      href={mainUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      tabIndex={0}
                      style={{ textDecoration: 'none' }}
                    >
                      <motion.div
                        variants={staggerItem}
                        whileHover={{ scale: 1.045 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white dark:bg-darkSurface rounded-lg shadow-md hover:shadow-lg transition-shadow p-0 flex flex-col h-full cursor-pointer focus:ring-2 focus:ring-primary-500 outline-none hover:shadow-xl hover:-translate-y-1 hover:border-primary-400 dark:hover:border-darkPrimaryAccent border border-transparent max-w-sm mx-auto"
                      >
                        <div className="p-2 pb-0">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-40 object-cover rounded-t-lg border-b border-gray-100 dark:border-darkBorder"
                          />
                        </div>
                        <div className="p-3 flex flex-col flex-1">
                          <div className="flex flex-wrap gap-1 mb-1">
                            {project.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="px-1.5 py-0.5 bg-primary-100 dark:bg-darkBorder text-primary-800 dark:text-darkPrimaryAccent rounded-full text-[10px] font-semibold"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-darkTextPrimary mb-1 hover:text-primary-600 dark:hover:text-darkPrimaryAccent">
                            <span className="hover:underline text-primary-600 dark:text-darkPrimaryAccent">
                              {project.title}
                            </span>
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-darkTextSecondary mb-2 line-clamp-3">
                            {project.description}
                          </p>
                          <div className="flex gap-1 mt-auto">
                            {project.githubUrl && project.githubUrl !== '' && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors text-xs font-semibold"
                                onClick={e => e.stopPropagation()}
                              >
                                Source
                              </a>
                            )}
                            {project.liveUrl && project.liveUrl !== '' && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-xs font-semibold"
                                onClick={e => e.stopPropagation()}
                              >
                                Website
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </a>
                  ) : (
                    <motion.div
                      variants={staggerItem}
                      whileHover={{ scale: 1.045 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white dark:bg-darkSurface rounded-lg shadow-md hover:shadow-lg transition-shadow p-0 flex flex-col h-full cursor-pointer focus:ring-2 focus:ring-primary-500 outline-none hover:shadow-xl hover:-translate-y-1 hover:border-primary-400 dark:hover:border-darkPrimaryAccent border border-transparent max-w-sm mx-auto"
                    >
                      <div className="p-2 pb-0">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-40 object-cover rounded-t-lg border-b border-gray-100 dark:border-darkBorder"
                        />
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <div className="flex flex-wrap gap-1 mb-1">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-1.5 py-0.5 bg-primary-100 dark:bg-darkBorder text-primary-800 dark:text-darkPrimaryAccent rounded-full text-[10px] font-semibold"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-darkTextPrimary mb-1 hover:text-primary-600 dark:hover:text-darkPrimaryAccent">
                          {project.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-darkTextSecondary mb-2 line-clamp-3">
                          {project.description}
                        </p>
                        <div className="flex gap-1 mt-auto">
                          {project.githubUrl && project.githubUrl !== '' && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors text-xs font-semibold"
                            >
                              Source
                            </a>
                          )}
                          {project.liveUrl && project.liveUrl !== '' && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-xs font-semibold"
                            >
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.div
        ref={testimonialsRef}
        variants={sectionVariants}
        initial="hidden"
        animate={testimonialsInView ? 'visible' : 'hidden'}
        className="py-4 rounded-2xl mt-2"
      >
        <h2 className="text-xl font-bold text-center mb-2">
          <span
            className="inline-block px-6 py-1.5 rounded-md bg-primary-600 text-white dark:bg-primary-400 dark:text-primary-900 font-semibold shadow-sm tracking-wide select-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:bg-primary-700 dark:hover:bg-primary-300 hover:no-underline"
          >
            Testimonials
          </span>
        </h2>
        <TestimonialsSlider />
      </motion.div>

      {/* Recent Blog Posts Section */}
      <motion.section
        ref={blogRef}
        variants={sectionVariants}
        initial="hidden"
        animate={blogInView ? 'visible' : 'hidden'}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24"
      >
        <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
          <h2 className="text-xl font-bold text-center mb-6">
            <span
              className="inline-block px-6 py-1.5 rounded-md bg-primary-600 text-white dark:bg-primary-400 dark:text-primary-900 font-semibold shadow-sm tracking-wide select-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:bg-primary-700 dark:hover:bg-primary-300 hover:no-underline"
            >
              Recent Blog Posts
            </span>
          </h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
            variants={staggerContainer}
            initial="hidden"
            animate={blogInView ? 'visible' : 'hidden'}
          >
            {blogsLoading ? (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">Loading blogs...</div>
            ) : blogsError ? (
              <div className="col-span-full text-center py-8 text-red-500">{blogsError}</div>
            ) : recentPosts.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">No blogs found.</div>
            ) : recentPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group"
                tabIndex={0}
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  variants={staggerItem}
                  whileHover={{ scale: 1.045 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white dark:bg-darkSurface rounded-lg shadow-md hover:shadow-lg transition-shadow p-0 flex flex-col h-full cursor-pointer focus:ring-2 focus:ring-primary-500 outline-none group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-primary-400 dark:group-hover:border-darkPrimaryAccent border border-transparent max-w-sm mx-auto"
                >
                  {post.image && (
                    <div className="p-2 pb-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-40 object-cover rounded-t-lg border-b border-gray-100 dark:border-darkBorder"
                      />
                    </div>
                  )}
                  <div className="p-3 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-1 mb-1">
                      {post.tags && post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 bg-primary-100 dark:bg-darkBorder text-primary-800 dark:text-darkPrimaryAccent rounded-full text-[10px] font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-darkTextPrimary mb-1 group-hover:text-primary-600 dark:group-hover:text-darkPrimaryAccent line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-darkTextSecondary mb-1">
                      <span>{post.date}</span>
                      <span className="mx-1">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <span
                      className="text-primary-600 dark:text-darkPrimaryAccent hover:text-primary-700 dark:hover:text-darkPrimaryHover font-medium mt-auto inline-block text-xs"
                    >
                      Read More →
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home; 