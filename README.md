# Job Search Platform - Backend API Engine

The high-performance REST API backend for the Job Search Platform built with **Node.js**, **Express.js**, **Mongoose ORM**, and **MongoDB Atlas**.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (v5)
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JSON Web Token (JWT) with HTTP-Only Cookies & Bearer Token fallback
- **File Processing**: Multer (Disk storage for company logos & candidate PDF resumes)
- **Security & Performance**: Trust Proxy for Cloud Reverse Proxies, `.lean()` query optimizations, NoSQL regex sanitization, and Cross-Origin Resource Sharing (CORS)

---

## ⚡ Key Architectural Features & Performance

1. **Mongoose `.lean()` High-Speed Queries**: Read operations (`getAllJobPosts`, `getJobPostById`, `searchFilter`, `getJobCreatedByMe`) execute with `.lean()` to bypass Mongoose document hydration, boosting JSON API throughput by up to 5x.
2. **MongoDB Database Indexing**:
   - Compound indexes: `{ categoryId: 1, createdAt: -1 }`, `{ recruiterId: 1, createdAt: -1 }`
   - Text search indexes: `{ jobTitle: "text", description: "text", location: "text" }`
3. **Cross-Site Cookie Handling (Render & Vercel)**:
   - Configured `app.set("trust proxy", 1)` for Render reverse proxy support.
   - Dynamic `getCookieOptions()` helper using `sameSite: "none"` and `secure: true` in production environments.
4. **Dual Authentication Fallback**:
   - Checks `req.cookies.token` first, then falls back to `req.headers.authorization` (`Bearer <token>`), guaranteeing seamless sessions on iOS Safari and browsers with third-party cookie blocking.

---

## 📡 REST API Endpoint Documentation

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user (`jobseeker` or `recruiter`) | No |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token | No |
| `POST` | `/api/auth/logout` | Clear session cookies | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `GET` | `/api/refresh` | Refresh JWT session token | Yes |

### 💼 Job Postings (`/api/jobposts`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobposts/getAllJobPosts` | Fetch all active job listings | No |
| `GET` | `/api/jobposts/getJobPosts` | Fetch job listings grouped by industry category | No |
| `GET` | `/api/jobposts/searchJobs` | Filter jobs by `industry`, `location`, or `keyword` | No |
| `GET` | `/api/jobposts/getJobById/:id` | Fetch single job post details | No |
| `GET` | `/api/jobposts/getMYJob/:id` | Fetch job postings created by logged-in recruiter | Yes |
| `POST` | `/api/jobposts/createPost` | Publish a new job post with company logo upload | Yes |
| `PUT` | `/api/jobposts/updateJobPost/:id` | Update an existing job post | Yes |
| `DELETE` | `/api/jobposts/deleteJobPost/:id` | Delete a job post | Yes |

### 📂 Industry Categories (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories/getCategory` | List all job categories | No |
| `POST` | `/api/categories/create` | Create a new job category | Yes |
| `PUT` | `/api/categories/update/:id` | Update a category | Yes |
| `DELETE` | `/api/categories/delete/:id` | Delete a category | Yes |

### 📄 Job Applications (`/api/application`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/application/submit` | Submit job application with PDF resume upload | Yes |
| `GET` | `/api/application/job/:jobId` | Fetch candidates who applied for a job | Yes (Recruiter) |
| `GET` | `/api/application/user/me` | Fetch applications submitted by logged-in candidate | Yes (Candidate) |
| `PUT` | `/api/application/status/:id` | Update candidate status (`Submitted`, `Under Review`, `Shortlisted`, `Rejected`, `Accepted`) | Yes (Recruiter) |

### 📝 Blogs & Newsletter (`/api/blogs` & `/api/subscribe`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/blogs/allBlogs` | List published blog posts | No |
| `GET` | `/api/blogs/blogBy/:id` | Get single blog article | No |
| `POST` | `/api/blogs/createBlog` | Publish blog article with cover image | Yes (Recruiter) |
| `POST` | `/api/subscribe` | Subscribe email to job alert newsletter | No |

---

## 🔑 Environment Variables (`.env`)

Create a `.env` file in the `Backend` directory:

```env
PORT=5000
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/jobsearch
JWT_SECRET=your_secure_jwt_secret_key_2026
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

---

## 🚀 Local Development Setup

```bash
# 1. Navigate to Backend directory
cd Backend

# 2. Install dependencies
npm install

# 3. Start development server with Nodemon
npm run dev

# 4. Start production server
npm start
```
Server runs on `http://localhost:5000`.
