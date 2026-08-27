# SIH 2026 - Capacity Connect 🚀

Project repository for Smart India Hackathon (SIH 2026).

---

## 📁 Repository Structure

```
SIH 2026/
├── backend/          # Node.js / Express backend API
│   ├── src/
│   │   ├── config/       # Database & service configurations
│   │   ├── controllers/  # Route controller logic
│   │   ├── middlewares/  # Auth, role validation & error handlers
│   │   ├── models/       # Mongoose data schemas
│   │   ├── routes/       # API endpoints definition
│   │   ├── utils/        # Helper utilities & tokens
│   │   ├── app.js        # Express app initialization
│   │   └── server.js     # Entry point
│   ├── .env.example      # Sample environment variables
│   └── package.json
├── frontend/         # (Future Frontend client application)
└── .gitignore
```

---

## 👥 Git Collaboration & Branching Strategy

To make sure no team member overwrites or breaks another member's code, follow this workflow:

### 1. Main Branches
- **`main`**: The primary stable production-ready branch. **Do not commit directly to `main`!**
- **`backend`**: The primary integration branch for all backend developments.

---

### 2. How to Work on Your Own Feature / Task

#### Step 1: Clone the repository (if not already cloned)
```bash
git clone <REMOTE_REPO_URL>
cd "SIH 2026"
```

#### Step 2: Ensure you have the latest updates
```bash
git checkout backend
git pull origin backend
```

#### Step 3: Create your own isolated branch
Name your branch clearly with your name or feature description:
```bash
# Examples:
git checkout -b feature/auth-jwt
# or
git checkout -b manan/course-controller
# or
git checkout -b backend/assessment-module
```

#### Step 4: Make your changes and commit
```bash
git status
git add .
git commit -m "feat(auth): add JWT login and signup validation"
```

#### Step 5: Push your branch to GitHub
```bash
git push -u origin <your-branch-name>
```

#### Step 6: Create a Pull Request (PR)
1. Go to GitHub and open a **Pull Request** from your branch into `backend` (or `main`).
2. Have a teammate review or verify the code before merging.

---

## ⚙️ Backend Setup Guide

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your `MONGO_URI`, `PORT`, and `SESSION_SECRET`
4. Run the development server:
   ```bash
   npm run start
   ```
