import express from 'express'
import dotenv from "dotenv";
import connectDB from './config/database.js';
import categoryRoutes from './routes/categoryRoutes.js';
import jobPostRoutes from './routes/jobpostRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import applicationRoutes from './routes/applicationRoutes.js'
import subscribeRoute from './routes/subscribeRoute.js'
import blogRoutes from './routes/blogRoutes.js'
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { verifyAndRefreshToken } from './config/auth.js';


dotenv.config()
const app = express()
const port = 3000


// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Static route to serve resumes
app.use('/resumes', express.static(path.join(__dirname, 'resumes')));
// app.use(cors())



app.use(cors({
  origin: 'http://localhost:3001', // Allow all origins, you can specify a specific origin if needed  
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
}));

connectDB()
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Hello guys!')
})

//for refresh the token
app.get("/api/refresh", verifyAndRefreshToken, (req, res) => {
  res.status(200).json({ message: "Session refreshed" });
});


// end pont of category
app.use('/api/categories', categoryRoutes);
// end point of job post
app.use('/api/jobposts', jobPostRoutes);

app.use("/api/auth", userRoutes); 
app.use("/api/application", applicationRoutes);
app.use("/api", subscribeRoute)
app.use("/api/blogs", blogRoutes )


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
