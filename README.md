# Portfolio Site

A modern, full-stack personal portfolio web application with a robust admin dashboard, dynamic content, and secure authentication.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Frontend](#frontend)
5. [Backend](#backend)
6. [API Overview](#api-overview)
7. [Setup & Running Locally](#setup--running-locally)
8. [Deployment](#deployment)
9. [Customization](#customization)
10. [Contributing](#contributing)
11. [License](#license)

---

## Project Structure

```
portfolio-site/
│
├── backend/
│   ├── app/
│   │   ├── api/endpoints/   # FastAPI endpoints (blog, projects, skills, testimonials, contact, auth, etc.)
│   │   ├── core/            # Config, file utils, settings
│   │   ├── db/              # Database setup
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── uploads/         # Uploaded images/files
│   │   └── ...
│   ├── requirements.txt
│   └── portfolio.db         # SQLite database (dev)
│
├── frontend/
│   ├── public/              # Static assets (images, favicon, etc.)
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers (e.g., Auth, Toast)
│   │   ├── data/            # Static fallback data (blog, testimonials, etc.)
│   │   ├── pages/           # Page components (Home, Blog, Admin, etc.)
│   │   └── ...
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## Features

### Public

- **Homepage**: Introduction, profile, and highlights.
- **Projects**: Dynamic portfolio projects with images, tech stack, and links.
- **Blog**: Dynamic blog posts with rich content, tags, related posts, and share buttons.
- **Skills**: Visual display of skills with icons and proficiency.
- **Testimonials**: Dynamic testimonials from database (with optional static fallback).
- **Contact**: Contact form, social links, and "Book a Free Session" (Topmate integration).
- **Dark Mode**: Fully supported.
- **Responsive Design**: Mobile-first, modern UI.

### Admin

- **Dashboard**: Central hub for managing all content.
- **Blog Management**: Create, edit, delete blog posts (with image upload, tags, related posts).
- **Project Management**: CRUD for projects (with image upload, tech stack).
- **Skill Management**: CRUD for skills (with icon upload).
- **Testimonial Management**: Add, delete testimonials.
- **Profile Management**: Upload/update hero and contact profile images.
- **Authentication**: Secure login, JWT-based session, protected admin routes.

---

## Technologies Used

- **Frontend**: React (TypeScript), Tailwind CSS, React Router, React Context, React-Quill, react-icons
- **Backend**: FastAPI, SQLAlchemy, Pydantic, python-jose (JWT), bcrypt, SQLite (dev), CORS, static file serving
- **Other**: Toast notifications, custom hooks, modern UI/UX patterns

---

## Frontend

### Key Structure

- `src/components/`: UI elements (Buttons, Inputs, Toasts, etc.)
- `src/pages/`: Main pages (Home, Blog, BlogPost, Projects, Admin, etc.)
- `src/pages/admin/`: Admin management pages (Blog, Projects, Skills, Testimonials, Profile)
- `src/context/`: Global state (Auth, Toast)
- `src/data/`: Static fallback data (used only if backend is unavailable)

### Running the Frontend

```bash
cd frontend
npm install
npm start
```
- Runs on [http://localhost:3000](http://localhost:3000) by default.

---

## Backend

### Key Structure

- `app/api/endpoints/`: All API routes (blog, projects, skills, testimonials, contact, auth, upload, categories, tags)
- `app/models/`: SQLAlchemy models for all entities
- `app/schemas/`: Pydantic schemas for validation
- `app/uploads/`: Uploaded images/files
- `portfolio.db`: SQLite database (for development)

### Running the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```
- Runs on [http://localhost:8000](http://localhost:8000) by default.

---

## API Overview

### Authentication

- `POST /api/v1/auth/login` – Login, returns JWT token
- `GET /api/v1/auth/validate` – Validate token (for session persistence)

### Public Endpoints

- `GET /api/v1/blog/` – List blog posts
- `GET /api/v1/blog/{slug}` – Get blog post by slug
- `GET /api/v1/projects/` – List projects
- `GET /api/v1/projects/{id}` – Get project by ID
- `GET /api/v1/skills/` – List skills
- `GET /api/v1/testimonials/` – List testimonials
- `GET /api/v1/contact/` – Get contact/profile info
- `GET /api/v1/categories/` – List categories
- `GET /api/v1/tags/` – List tags

### Protected/Admin Endpoints (require JWT)

- `POST/PUT/DELETE /api/v1/blog/` – Create, update, delete blog posts
- `POST/PUT/DELETE /api/v1/projects/` – Create, update, delete projects
- `POST/PUT/DELETE /api/v1/skills/` – Create, update, delete skills
- `POST/PUT/DELETE /api/v1/testimonials/` – Create, update, delete testimonials
- `POST/PUT /api/v1/contact/` – Create or update contact/profile info
- `POST /api/v1/upload/` – Upload images (profile, project, blog, generic)

### Other

- `POST /api/v1/contact/send-message` – Send contact form message (rate-limited)
- `/uploads/` – Static file serving for images

---

## Database Models

- **User**: id, email, password (bcrypt), name, role
- **BlogPost**: id, title, slug, content, excerpt, featured_image, is_published, read_time, author_name, author_avatar, related_posts, created_at, updated_at, category_id, tags (many-to-many)
- **Project**: id, title, description, image_url, technologies (JSON), github_url, live_url, is_featured, created_at
- **Skill**: id, name, icon, color
- **Testimonial**: id, name, role, text, rating, verify_url, created_at
- **ContactInfo**: id, profile_image, contact_profile_image
- **Category**: id, name, slug, description, created_at
- **Tag**: id, name, slug, created_at

---

## Deployment

- **Frontend**: Deploy to Vercel, Netlify, or any static hosting.
- **Backend**: Deploy to any Python server (Heroku, Render, DigitalOcean, etc.).
- **Database**: Use SQLite for dev, Postgres (e.g., Supabase) for production.
- **Environment Variables**: Set API URLs, DB URLs, CORS origins, JWT secret, SMTP for contact form, etc.
- **Static Files**: Ensure `/uploads` is writable and served.

---

## Customization

- **Theme**: Edit `tailwind.config.js` for colors, fonts, etc.
- **Content**: Use the admin dashboard for all content management.
- **Images**: Upload via admin or place in `frontend/public/images/`.
- **Sections**: Add/remove sections by editing React components in `src/pages/` and `src/components/`.

---

## Contributing

1. Fork the repo and clone it.
2. Create a new branch for your feature/fix.
3. Make your changes and commit with clear messages.
4. Push to your fork and open a Pull Request.

---

## License

MIT

---

## Credits

- Built by Ritesh Lavti
- [LinkedIn: linkedin.com/in/riteshlavti](https://linkedin.com/in/riteshlavti)
- Inspired by modern portfolio and blog designs.

---

**For any questions or issues, please open an issue on GitHub or contact the maintainer.**
