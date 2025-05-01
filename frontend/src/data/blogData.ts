// Blog data and types for use across the app

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

export const blogPosts: Record<string, BlogPostData> = {
  'self-help': {
    title: "Don't Believe Everything You Think – Book Summary",
    date: "May 1, 2025",
    readTime: "5 min read",
    content: `
      <p>This is a summary of the book "Don't Believe Everything You Think" by Joseph Nguyen. It talks about how most of our suffering comes from our own thoughts, not from the actual situation.</p>
      
      <h2 id="what-book-says">What the Book Says</h2>
      <p>The main idea is that you are not your thoughts. Just because you think something doesn't mean it's true. Many people believe every thought that comes to their mind, and this creates stress, anxiety, and sadness.</p>
      
      <h2 id="key-points">Key Points from the Book</h2>
      <ul>
        <li>Suffering doesn't come from outside events. It comes from how we think about them.</li>
        <li>Thoughts are not facts. You don't have to believe everything you think.</li>
        <li>You don't need to control or change your thoughts. You just need to stop identifying with them.</li>
        <li>When you stop reacting to every thought, you start to feel peace.</li>
        <li>Inner peace is your natural state. It's always there, but it gets hidden by constant thinking.</li>
      </ul>

      <h2 id="how-it-helped">How It Helped Me</h2>
      <p>This book made me realize that I don't need to argue with every negative thought. I can just notice it and let it go. I feel more calm and less anxious now.</p>

      <h2 id="how-to-use">How You Can Use It in Your Life</h2>
      <ul>
        <li>When a bad thought comes, ask yourself: "Is this thought useful?"</li>
        <li>Try to observe your thoughts instead of reacting to them.</li>
        <li>Focus on the present moment instead of getting stuck in your mind.</li>
      </ul>

      <h2 id="final-thought">Final Thought</h2>
      <p>This is a short and simple book, but it gives a new way to look at your mind. If you often feel stressed or overthink, this book can help you a lot.</p>
    `,
    tags: ["Self-Help"],
    author: {
      name: "Ritesh Lavti",
      avatar: "/images/profile.jfif"
    },
    relatedPosts: [],
    excerpt: 'This is a summary of the book "Don\'t Believe Everything You Think" by Joseph Nguyen. It talks about how most of our suffering comes from our own thoughts, not from the actual situation.',
    slug: 'self-help',
    image: '/images/blog-placeholder.jpg'
  },
  'tailwind-css': {
    title: "Building Responsive UIs with Tailwind CSS",
    date: "March 10, 2024",
    readTime: "8 min read",
    content: `
      <p>Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. In this guide, we'll explore how to create beautiful, responsive user interfaces using Tailwind CSS.</p>
      <h2 id="getting-started">Getting Started with Tailwind</h2>
      <p>First, install Tailwind CSS in your project:</p>
      <pre><code>npm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p</code></pre>
      <h2 id="configuring">Configuring Tailwind</h2>
      <p>Update your tailwind.config.js file to include the paths to your template files:</p>
      <pre><code>module.exports = {\n  content: [\n    \"./src/**/*.{js,jsx,ts,tsx}\",\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}</code></pre>
      <h2 id="best-practices">Best Practices</h2>
      <ul>
        <li>Use the @apply directive for repeated utility combinations</li>
        <li>Create custom components for complex UI elements</li>
        <li>Leverage Tailwind's responsive design utilities</li>
        <li>Use the dark mode feature for theme switching</li>
      </ul>
    `,
    tags: ["CSS", "Tailwind"],
    author: {
      name: "John Doe",
      avatar: "/images/author-avatar.jpg"
    },
    relatedPosts: ['react-typescript', 'state-management'],
    excerpt: 'A comprehensive guide to creating beautiful, responsive user interfaces using Tailwind CSS.',
    slug: 'tailwind-css',
    image: '/images/blog-placeholder.jpg'
  },
  'state-management': {
    title: "State Management in React Applications",
    date: "March 5, 2024",
    readTime: "6 min read",
    content: `
      <p>State management is a crucial aspect of building React applications. In this guide, we'll explore different state management solutions and when to use them.</p>
      <h2 id="local-state">Local State</h2>
      <p>For simple state management, React's built-in useState hook is often sufficient:</p>
      <pre><code>const [count, setCount] = useState(0);</code></pre>
      <h2 id="global-state">Global State</h2>
      <p>For more complex applications, you might need a global state management solution like Redux:</p>
      <pre><code>const store = configureStore({\n  reducer: {\n    counter: counterReducer,\n  },\n});</code></pre>
      <h2 id="best-practices">Best Practices</h2>
      <ul>
        <li>Use local state for component-specific data</li>
        <li>Consider Context API for simple global state</li>
        <li>Use Redux for complex state management</li>
        <li>Keep state as close as possible to where it's used</li>
      </ul>
    `,
    tags: ["React", "Redux"],
    author: {
      name: "John Doe",
      avatar: "/images/author-avatar.jpg"
    },
    relatedPosts: ['react-typescript', 'tailwind-css'],
    excerpt: 'Exploring different state management solutions and when to use them in your React applications.',
    slug: 'state-management',
    image: '/images/blog-placeholder.jpg'
  }
}; 