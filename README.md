# 🚀 Ritesh Lavti's Modern Portfolio Site

A beautiful, full-stack portfolio and blog platform with a powerful admin dashboard, secure authentication, dynamic content, and stunning animations. Built for developers, by a developer—easy to use, easy to extend, and mobile-first.

---

## 📁 Project Structure

```
portfolio-site/
│
├── backend/
│   ├── app/
│   │   ├── api/endpoints/   # All API routes (blog, projects, skills, testimonials, contact, auth, upload, categories, tags)
│   │   ├── core/            # Config, Supabase, file utils
│   │   ├── db/              # Database setup
│   │   ├── models/          # SQLAlchemy models (User, Blog, Project, Skill, Testimonial, Contact, etc.)
│   │   ├── schemas/         # Pydantic schemas for validation
│   │   └── uploads/         # Uploaded images/files (profile, blog, projects)
│   ├── alembic/             # Database migrations
│   ├── scripts/             # Utility scripts (e.g., create admin)
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── public/              # Static assets (images, favicon.svg, index.html)
│   ├── src/
│   │   ├── components/      # Reusable React components (Layout, ThemeToggle, Toast, ProtectedRoute, etc.)
│   │   │   └── forms/       # Form UI components (Button, Input)
│   │   ├── context/         # Global state (Auth, Theme, Toast)
│   │   ├── data/            # Static fallback data (blog, testimonials, featured projects)
│   │   ├── pages/           # Main pages (Home, Blog, Projects, Contact, About, Admin)
│   │   │   └── admin/       # Admin dashboard & management pages
│   │   └── styles/          # Custom CSS (e.g., animated backgrounds)
│   ├── package.json         # Frontend dependencies
│   └── tailwind.config.js   # Tailwind CSS config
│
└── README.md
```

---

## ✨ Features (What Makes This Special?)

### 🌐 Public Site
- **Home**: Animated hero, profile, skills, featured projects, testimonials, and latest blogs.
- **Projects**: Dynamic, filterable, and beautifully presented portfolio projects. Each card has a blurred/gradient background, tech stack, and links.
- **Blog**: Rich blog posts with tags, related posts, author info, and reading time. Modern card previews and detail pages.
- **Skills**: Visual grid of skills with icons and colors.
- **Testimonials**: Carousel of real testimonials, animated and fetched live from the database.
- **Contact**: Contact form (with rate limiting), social links, and Topmate integration for booking sessions.
- **Dark Mode**: Toggle between light and dark themes. All colors, gradients, and backgrounds adapt.
- **Mobile-First**: Every page and component is optimized for phones and tablets. Touch-friendly, responsive, and beautiful.
- **Modern Animations**: Framer Motion for page transitions, menu, hero emoji, and more. 3D animated sphere in the footer with sparkling dots.
- **Accessibility**: Focus trap, keyboard navigation, and ARIA labels in menus and dialogs.
- **Performance**: Skeleton loaders, lazy loading, and optimized images.

### 🔒 Admin Dashboard (Superpowers!)
- **Authentication**: Secure login with JWT. Only admins can access management pages.
- **User-Level Protection**: All admin routes are protected. Non-admins are redirected. Session is persistent and validated on every page load.
- **Dashboard**: Central hub to manage everything—blogs, projects, skills, testimonials, and profile images.
- **Blog Management**: Create, edit, delete blog posts. Upload images, add tags, related posts, and rich text (with a modern editor).
- **Project Management**: Full CRUD for projects. Upload images, set tech stack, mark as featured, and control order.
- **Skill Management**: Add, edit, delete skills with icons and colors.
- **Testimonial Management**: Add, edit, delete testimonials. All testimonials are shown live on the site.
- **Profile Management**: Update hero and contact profile images.
- **Image Uploads**: All uploads go to Supabase Storage (or local in dev). Only public URLs are stored and validated.
- **Error Handling**: Friendly error messages, toast notifications, and skeleton loaders for all admin actions.

### 🛡️ Security & Best Practices
- **JWT Auth**: All admin APIs require a valid token. Tokens are stored securely and validated on every request.
- **Protected Routes**: Frontend uses a `ProtectedRoute` component to guard all admin pages. Only admins can access sensitive actions.
- **Rate Limiting**: Contact form is rate-limited to prevent spam.
- **Environment Variables**: All secrets, API URLs, and DB credentials are kept out of the codebase.

### 🎨 Animations & UI Polish
- **Framer Motion**: Used for menu transitions, hero emoji wave, card hover, and more.
- **3D Footer Sphere**: Interactive, animated sphere with sparkles, especially shiny in dark mode and on mobile.
- **Modern SVG Favicon**: Custom `</>` icon with a blue-purple gradient for instant recognition.
- **Radial Gradients & Blurred Previews**: Project and blog cards use gradients and blurred images for a modern look.
- **Mobile Menu**: Animated, touch-friendly, with social links and accessibility features.

---

## 🛠️ Technologies Used
- **Frontend**: React (TypeScript), Tailwind CSS, Framer Motion, React Router, React Context, React-Quill, react-icons
- **Backend**: FastAPI, SQLAlchemy, Pydantic, python-jose (JWT), bcrypt, SQLite (dev), Supabase Storage, CORS
- **Other**: Toast notifications, custom hooks, accessibility best practices

---

## 👩‍💻 How to Run Locally

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```
- Runs on [http://localhost:8000](http://localhost:8000)

### Frontend
```bash
cd frontend
npm install
npm start
```
- Runs on [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💼 Admin Panel: User-Level Protection
- **Login Required**: Only authenticated admins can access `/admin` routes.
- **ProtectedRoute**: All admin pages are wrapped in a `ProtectedRoute` component. If not logged in, you're redirected to `/login`.
- **Role-Based Access**: Only users with `role: 'admin'` can perform admin actions. Others are redirected to the homepage.
- **Session Persistence**: JWT tokens are stored securely and validated on every page load.
- **Logout**: One-click logout from the dashboard.

---

## 🧩 All Features & Pages (In Detail)

### Public Pages
- **Home**: Animated hero, skills, featured projects, testimonials, latest blogs, and a 3D animated footer.
- **Projects**: List and detail pages, with images, tech stack, and links. Featured projects are curated and ordered.
- **Blog**: List and detail pages, with tags, related posts, author info, and reading time. Rich text and code blocks supported.
- **About**: Responsive, mobile-optimized about page with cards and grid.
- **Contact**: Contact form (with validation and rate limiting), social/contact icons, and Topmate integration.
- **Testimonials**: Carousel of real testimonials, animated and fetched live from the database.
- **Dark Mode**: Toggle with a single click. All colors, gradients, and backgrounds adapt.
- **Mobile Menu**: Animated, touch-friendly, with social links and accessibility features.
- **Footer**: 3D animated sphere with sparkles, especially shiny in dark mode and on mobile.

### Admin Pages
- **Dashboard**: Central hub for managing all content.
- **Blog Management**: Create, edit, delete blog posts. Upload images, add tags, related posts, and rich text.
- **Project Management**: Full CRUD for projects. Upload images, set tech stack, mark as featured, and control order.
- **Skill Management**: Add, edit, delete skills with icons and colors.
- **Testimonial Management**: Add, edit, delete testimonials. All testimonials are shown live on the site.
- **Profile Management**: Update hero and contact profile images.
- **Image Uploads**: All uploads go to Supabase Storage (or local in dev). Only public URLs are stored and validated.
- **Error Handling**: Friendly error messages, toast notifications, and skeleton loaders for all admin actions.

---

## 🗂️ API Overview (RESTful)
- **Auth**: `/auth/login`, `/auth/validate` (JWT)
- **Blog**: `/blog/`, `/blog/{slug}` (CRUD, tags, related)
- **Projects**: `/projects/`, `/projects/{id}` (CRUD, featured)
- **Skills**: `/skills/` (CRUD)
- **Testimonials**: `/testimonials/` (CRUD)
- **Contact**: `/contact/` (CRUD, profile images)
- **Upload**: `/upload/` (images)
- **Categories/Tags**: `/categories/`, `/tags/`
- **Contact Form**: `/contact/send-message` (rate-limited)

---

## 🏗️ Database Models
- **User**: id, email, password (bcrypt), name, role
- **BlogPost**: id, title, slug, content, excerpt, featured_image, is_published, read_time, author_name, author_avatar, related_posts, created_at, updated_at, category_id, tags (many-to-many)
- **Project**: id, title, description, image_url, technologies (JSON), github_url, live_url, is_featured, featured_order, created_at
- **Skill**: id, name, icon, color
- **Testimonial**: id, name, role, text, rating, verify_url, created_at
- **ContactInfo**: id, profile_image, contact_profile_image
- **Category**: id, name, slug, description, created_at
- **Tag**: id, name, slug, created_at

---

## 🎨 Customization & Theming
- **Colors & Fonts**: Edit `tailwind.config.js` for your own palette and typography.
- **Content**: Use the admin dashboard for all content management. No code changes needed for new blogs, projects, skills, or testimonials.
- **Images**: Upload via admin or place in `frontend/public/images/`.
- **Sections**: Add/remove sections by editing React components in `src/pages/` and `src/components/`.
- **Favicon**: Modern SVG favicon with a gradient and `</>` symbol for instant recognition.

---

## 🧑‍🎨 Animations & UI Polish
- **Framer Motion**: Used for menu transitions, hero emoji wave, card hover, and more.
- **3D Footer Sphere**: Interactive, animated sphere with sparkles, especially shiny in dark mode and on mobile.
- **Radial Gradients & Blurred Previews**: Project and blog cards use gradients and blurred images for a modern look.
- **Mobile Menu**: Animated, touch-friendly, with social links and accessibility features.

---

## 🧑‍💻 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
[MIT](LICENSE)
