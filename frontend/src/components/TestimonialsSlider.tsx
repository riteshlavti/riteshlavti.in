import React, { useState, useCallback } from 'react';
import { useTestimonials } from '../data/testimonialsData';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';

const AUTO_PLAY_INTERVAL = 5000; // 5 seconds

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex justify-center mb-3">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
      </svg>
    ))}
  </div>
);

const useResponsiveTestimonials = () => {
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

const TestimonialsSlider: React.FC = () => {
  const isMobile = useResponsiveTestimonials();
  const testimonials = useTestimonials();
  const testimonialsPerSlide = 1;
  const [current, setCurrent] = useState(0);

  const total = testimonials.length;
  const maxIndex = Math.max(0, total - testimonialsPerSlide);

  const next = useCallback(() => setCurrent((prev) => (prev + testimonialsPerSlide > maxIndex ? 0 : prev + testimonialsPerSlide)), [maxIndex, testimonialsPerSlide]);
  const prev = useCallback(() => setCurrent((prev) => (prev - testimonialsPerSlide < 0 ? maxIndex : prev - testimonialsPerSlide)), [maxIndex, testimonialsPerSlide]);

  React.useEffect(() => {
    const timer = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  const visibleTestimonials = testimonials.slice(current, current + testimonialsPerSlide);
  if (visibleTestimonials.length < testimonialsPerSlide) {
    visibleTestimonials.push(...testimonials.slice(0, testimonialsPerSlide - visibleTestimonials.length));
  }
  const numDots = Math.ceil(total / testimonialsPerSlide);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-0">
      <div className="max-w-2xl mx-auto">
        <div className="relative flex flex-col items-center">
          <button
            aria-label="Previous testimonial"
            onClick={prev}
            className="absolute left-0 -ml-16 sm:-ml-6 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-darkSurface border border-gray-200 dark:border-darkBorder rounded-full p-2 shadow hover:bg-gray-100 dark:hover:bg-darkBorder transition-colors"
          >
            <FiChevronLeft size={24} />
          </button>
          <div className="w-full flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5 }}
                className="flex w-full justify-center"
              >
                {visibleTestimonials.map((testimonial, idx) => {
                  // Get initials from name
                  const nameParts = testimonial.name.split(' ');
                  const initials = nameParts.length > 1
                    ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
                    : nameParts[0][0];
                  // Fixed palette of visually distinct colors
                  const avatarColors = [
                    'bg-blue-600',    // blue
                    'bg-green-600',   // green
                    'bg-orange-500',  // orange
                    'bg-red-500',     // red
                    'bg-purple-600',  // purple
                    'bg-teal-500',    // teal
                    'bg-yellow-400',  // yellow
                    'bg-pink-500',    // pink
                    'bg-indigo-600',  // indigo
                  ];
                  // Hash the name to pick a color
                  let hash = 0;
                  for (let i = 0; i < testimonial.name.length; i++) {
                    hash = testimonial.name.charCodeAt(i) + ((hash << 5) - hash);
                  }
                  const colorClass = avatarColors[Math.abs(hash) % avatarColors.length];
                  // Card content
                  const cardContent = (
                    <>
                      <FaQuoteLeft className="absolute left-4 top-4 text-4xl text-gray-300 dark:text-darkBorder opacity-40 pointer-events-none select-none" />
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow text-white text-4xl font-bold select-none ${colorClass}`}>
                        {initials}
                      </div>
                      <StarRating rating={testimonial.rating} />
                      <p className="text-gray-700 dark:text-darkTextPrimary italic text-xl leading-relaxed mb-6 z-10">"{testimonial.text}"</p>
                      <div>
                        <span className="block font-semibold text-gray-900 dark:text-darkTextPrimary text-2xl">{testimonial.name}</span>
                        <span className="block text-primary-600 dark:text-darkPrimaryAccent text-lg mt-1">{testimonial.role}</span>
                      </div>
                    </>
                  );
                  // If verify_url, make card clickable
                  return testimonial.verify_url ? (
                    <a
                      key={testimonial.name + idx}
                      href={testimonial.verify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white dark:bg-darkSurface rounded-xl shadow-2xl px-10 py-8 flex flex-col items-center text-center w-full max-w-2xl border border-gray-100 dark:border-darkBorder relative transition-transform duration-200 hover:scale-105 cursor-pointer"
                      style={{ textDecoration: 'none' }}
                    >
                      {cardContent}
                    </a>
                  ) : (
                    <div
                      key={testimonial.name + idx}
                      className="bg-white dark:bg-darkSurface rounded-xl shadow-2xl px-10 py-8 flex flex-col items-center text-center w-full max-w-2xl border border-gray-100 dark:border-darkBorder relative"
                    >
                      {cardContent}
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
          <button
            aria-label="Next testimonial"
            onClick={next}
            className="absolute right-0 -mr-16 sm:-mr-6 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-darkSurface border border-gray-200 dark:border-darkBorder rounded-full p-2 shadow hover:bg-gray-100 dark:hover:bg-darkBorder transition-colors"
          >
            <FiChevronRight size={24} />
          </button>
        </div>
          <div className="flex justify-center mt-8 space-x-3">
            {Array.from({ length: numDots }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx * testimonialsPerSlide)}
                className={`w-3 h-3 rounded-full border ${current === idx * testimonialsPerSlide ? 'bg-primary-500 border-primary-500' : 'bg-gray-300 dark:bg-darkBorder border-gray-400 dark:border-darkBorder'} transition-colors`}
                aria-label={`Go to testimonial set ${idx + 1}`}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider; 