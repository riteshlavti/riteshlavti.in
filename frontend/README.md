# Portfolio Site (Full Stack)

A modern, full-stack personal portfolio and blog site with:
- **Frontend:** React (TypeScript, Tailwind CSS)
- **Backend:** FastAPI (Python), SQLAlchemy ORM, SQLite
- **Features:** Blog, Projects, Image Uploads, Admin Dashboard, Theming, Responsive Design

---

## Features
- **Blog:** CRUD, tags, related posts, excerpts, read time, rich text, image uploads
- **Projects:** CRUD, technologies, GitHub/Live URLs, featured projects
- **Admin Dashboard:** Manage blogs/projects with rich forms and image upload
- **Image Uploads:** Images stored on backend, URLs returned and used in frontend
- **Modern UI:** Blue + slate/gray palette, responsive, dark mode
- **Share Links:** Blog posts have real share links (X, LinkedIn, WhatsApp)
- **No Comments:** Comments are disabled for simplicity and security

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- Python 3.9+

### Backend Setup (FastAPI)
1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. **Run the backend server:**
   ```bash
   uvicorn app.main:app --reload
   ```
   - The API will be available at `http://localhost:8000/api/v1/`
   - Images are served from `http://localhost:8000/uploads/`
3. **Database:**
   - Uses SQLite by default (`backend/portfolio.db`).
   - Auto-creates tables on first run.

### Frontend Setup (React)
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Run the frontend dev server:**
   ```bash
   npm start
   ```
   - The app runs at `http://localhost:3000`
   - The frontend fetches data from the backend API.

---

## Integration Notes
- **Image URLs:** The backend returns full URLs for images (e.g., `http://localhost:8000/uploads/...`). The frontend uses these directly.
- **CORS:** The backend allows requests from `localhost:3000`.
- **Static + Dynamic Blog Data:** The frontend merges static blog posts with dynamic posts from the backend.
- **Rich Text:** Blog and project content use ReactQuill for editing and rendering.

---

## Folder Structure
- `frontend/` — React app (src/components, src/pages, etc.)
- `backend/` — FastAPI app (app/api, app/models, app/schemas, etc.)
- `backend/uploads/` — Uploaded images (served by FastAPI)

---

## Deployment
- For production, build the frontend (`npm run build`) and serve it with a production server.
- Configure the backend to serve static files and set correct CORS/allowed hosts.

---

## Author
- Ritesh Lavti

---

## License
MIT (or specify your license)
