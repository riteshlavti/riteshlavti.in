# Portfolio Site – Documentation

## Overview

**portfolio-site** is a full-stack personal portfolio web application. It allows you to showcase your projects, blog posts, skills, and contact information, with a modern, responsive UI and a robust backend for content management.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technologies Used](#technologies-used)
3. [Frontend](#frontend)
    - [Features](#frontend-features)
    - [Key Components](#frontend-key-components)
    - [Theming & Styling](#theming--styling)
    - [Running the Frontend](#running-the-frontend)
4. [Backend](#backend)
    - [Features](#backend-features)
    - [Database Models](#database-models)
    - [API Endpoints](#api-endpoints)
    - [Running the Backend](#running-the-backend)
5. [Deployment](#deployment)
6. [Customization](#customization)
7. [Contributing](#contributing)
8. [License](#license)

---

## Project Structure

```
portfolio-site/
│
├── backend/
│   ├── app/
│   │   ├── api/           # FastAPI endpoints
│   │   ├── core/          # Configurations
│   │   ├── db/            # Database setup
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── routes/        # (Optional) Additional routes
│   │   ├── scripts/       # Utility scripts
│   │   ├── uploads/       # Uploaded images/files
│   │   ├── requirements.txt   # Python dependencies
│   │   ├── setup.py           # Backend setup
│   │   └── portfolio.db       # SQLite database
│   │
│   ├── frontend/
│   │   ├── public/            # Static assets (images, favicon, etc.)
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   ├── context/       # React context providers
│   │   │   ├── data/          # Static data (e.g., blogData.ts)
│   │   │   ├── pages/         # Page components (Blog, Admin, etc.)
│   │   │   └── package.json       # Frontend dependencies
│   │   │   └── tailwind.config.js # Tailwind CSS config
│   │   │   └── tsconfig.json      # TypeScript config
│   │   └── README.md              # Project documentation
│   └── README.md              # Project documentation
```

---

## Technologies Used

### Frontend

- **React** (TypeScript)
- **Tailwind CSS** (with custom dark mode palette)
- **React Router** (routing)
- **React Context** (global state, e.g., Toasts)
- **React-Quill** (rich text editor for admin)
- **Other**: Icons (react-icons), custom hooks, etc.

### Backend

- **FastAPI** (Python)
- **SQLAlchemy** (ORM)
- **SQLite** (default DB, can be swapped)
- **Pydantic** (data validation)
- **CORS** (for frontend-backend communication)
- **Static file serving** (for uploads)

---

## Frontend

### Frontend Features

- **Homepage**: Introduction, navigation, and highlights.
- **Projects**: Showcase of portfolio projects, with images, tech stack, and links.
- **Blog**: List and detail pages for blog posts, with comments and sharing.
- **Skills**: Visual display of skills with icons and colors.
- **Testimonials**: Carousel/slider for client or peer testimonials.
- **Contact**: Contact form and social links.
- **Admin Panel**: Manage blog posts and projects (create, edit, delete).
- **Dark Mode**: Customizable, professional palette.
- **Responsive Design**: Fully mobile-friendly.

### Key Components

- `components/`: Buttons, Inputs, Forms, Toasts, Modals, etc.
- `pages/`: Each main route (Home, Blog, BlogPost, Projects, Admin, etc.)
- `data/`: Static blog data (used as fallback or for static posts).
- `context/ToastContext.tsx`: Global toast notifications.
- `pages/admin/BlogManagement.tsx`: Blog CRUD for admins.
- `pages/admin/ProjectManagement.tsx`: Project CRUD for admins.

### Theming & Styling

- **Tailwind CSS**: Utility-first styling.
- **Custom Colors**: Professional blue/slate palette, with dark mode support.
- **Consistent Section Titles**: Centered, subtle, and matching the theme.
- **Minimalist, Modern UI**: Clean layouts, subtle shadows, and spacing.

### Running the Frontend

```bash
cd frontend
npm install
npm start
```
- Runs on [http://localhost:3000](http://localhost:3000) by default.

---

## Backend

### Backend Features

- **RESTful API**: For blog, projects, skills, contact, uploads, and authentication.
- **Image Uploads**: Handles file uploads for blog/project images.
- **Database Models**: For users, blog posts, projects, skills, contact info, etc.
- **CORS**: Allows frontend to communicate with backend.
- **Static File Serving**: For uploaded images.

### Database Models

Located in `backend/app/models/`:

- **User**: `id`, `email`, `password`, `name`, `role`
- **BlogPost**: `id`, `title`, `slug`, `content`, `excerpt`, `featured_image`, `is_published`, `read_time`, `author_name`, `author_avatar`, `related_posts`, `created_at`, `updated_at`, `category_id`
- **Category**: `id`, `name`, `slug`, `description`, `created_at`
- **Tag**: `id`, `name`, `slug`, `created_at`
- **Comment**: `id`, `content`, `author_name`, `author_email`, `created_at`, `post_id`, `parent_id`
- **Project**: `id`, `title`, `description`, `image_url`, `technologies` (JSON), `github_url`, `live_url`, `is_featured`, `created_at`
- **Skill**: `id`, `name`, `icon`, `color`
- **ContactInfo**: `id`, `email`, `phone`, `location`, `social_links` (JSON), `profile_image`

### API Endpoints

- `/api/v1/blog/` – Blog CRUD
- `/api/v1/projects/` – Project CRUD
- `/api/v1/skills/` – Skills
- `/api/v1/contact/` – Contact info
- `/api/v1/upload/` – Image/file uploads
- `/api/v1/auth/` – Authentication (login, register)
- `/uploads/` – Static file serving for images

### Running the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python scripts/create_admin_sqlalchemy.py # to save admin credentials in DB [one time process]
uvicorn app.main:app --reload
```
- Runs on [http://localhost:8000](http://localhost:8000) by default.

---

## Deployment

- **Frontend**: Can be deployed to Vercel, Netlify, or any static hosting.
- **Backend**: Can be deployed to Heroku, Render, DigitalOcean, or any server supporting Python.
- **Database**: Uses [Supabase](https://supabase.com/) (hosted Postgres) for production database storage.
- **Environment Variables**: Set up for production (e.g., DB URL, CORS origins).
- **Static Files**: Ensure `/uploads` is writable and served.

---

## Customization

- **Theme**: Edit `tailwind.config.js` for colors, fonts, etc.
- **Content**: Use the admin panel or edit static data in `frontend/src/data/`.
- **Images**: Place in `frontend/public/images/` or upload via admin.
- **Sections**: Add/remove sections by editing React components in `src/pages/` and `src/components/`.

---

## Contributing

1. Fork the repo and clone it.
2. Create a new branch for your feature/fix.
3. Make your changes and commit with clear messages.
4. Push to your fork and open a Pull Request.

---

## License

This project is licensed under the MIT License.

---

## Credits

- Built by Ritesh Lavti
- [LinkedIn: linkedin.com/in/riteshlavti](https://linkedin.com/in/riteshlavti)
- Inspired by modern portfolio and blog designs.

---

**For any questions or issues, please open an issue on GitHub or contact the maintainer.**
