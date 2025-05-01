import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-8 sm:px-12 lg:px-16 py-4">
      {/* Hero Section */}
      <div className="text-center mb-4">
        <div className="w-24 h-24 mx-auto mb-2 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
          <svg className="w-12 h-12 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          About Me
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          SDET | Building scalable automation for UI, API & mobile | Exploring AI across automation, development & productivity | Passionate about learning, investing & mentoring
        </p>
      </div>

      {/* Introduction Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Introduction
          </h2>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
          SDET with a passion for automation and quality engineering. Skilled in Python, Java, Selenium, Playwright, Appium, and API testing tools like RestAssured and Postman. I build scalable test frameworks for UI, API, and mobile platforms.
          Exploring AI in automation. Love helping others with career growth, investing, and mental models. Always curious and eager to learn.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
          I'm a passionate SDET with a strong focus on automation and quality assurance. I've honed my skills in Python, Java, and automation tools like Selenium, Playwright, and Appium. My expertise lies in building scalable test frameworks that ensure robust and efficient software delivery.
          </p>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Skills
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Programming Language
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                Python
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                Java
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                C#
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                C/C++
              </span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
              Testing Frameworks
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                Selenium
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                Playwright
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                Appium
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                RestAssured
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                Requests
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                TestNG
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                Pytest
              </span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Tools & Others
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                Git/GitHub
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                Bitbucket
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                Postman
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                Jenkins
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                Jira
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                Allure
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Experience & Education
          </h2>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          
          {/* Timeline items */}
          <div className="space-y-8">
            {/* Work Experience */}
            <div className="relative pl-12">
              <div className="absolute left-0 w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border-2 border-primary-100 dark:border-primary-900">
                <img 
                  src="/images/zeta.avif" 
                  alt="Zeta Company Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">SDET</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Zeta • Jan 2025 - Present</p>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Working on backend automation using python and requests. Contributing to make the framework more modular, reusable and scalable.
                </p>
              </div>
            </div>

            <div className="relative pl-12">
              <div className="absolute left-0 w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border-2 border-primary-100 dark:border-primary-900">
                <img 
                  src="/images/itt.png" 
                  alt="In Time Tec Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Jr. Software Engineer</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">In Time Tec • Jan 2024 - Dec 2024</p>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Worked on frontend automation using selenium and playwright and backend automation using java and rest assured.
                </p>
              </div>
            </div>

            {/* Education */}
            <div className="relative pl-12">
              <div className="absolute left-0 w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border-2 border-primary-100 dark:border-primary-900">
                <img 
                  src="/images/skit-logo.png" 
                  alt="University Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">B.Tech. in Computer Science</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">SKIT, Jaipur • 2020 - 2024</p>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Focused on software engineering. Participated in various hackathons and 
                  coding competitions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connect with Me Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mt-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Let's Connect!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Ready to collaborate on exciting projects? Let's turn ideas into reality together!
          </p>
        </div>
        <div className="flex justify-center space-x-6">
          <a
            href="https://linkedin.com/in/riteshlavti"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0077B5] hover:text-[#005582] transition-colors"
            aria-label="LinkedIn Profile"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a
            href="https://github.com/riteshlavti"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#333] dark:text-[#fff] hover:text-[#666] dark:hover:text-[#ccc] transition-colors"
            aria-label="GitHub Profile"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a
            href="mailto:riteshlavti@gmail.com"
            className="text-[#EA4335] hover:text-[#D33426] transition-colors"
            aria-label="Email"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About; 