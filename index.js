import express from 'express'
import dotenv from "dotenv";
import connectDB from './config/database.js';
import categoryRoutes from './routes/categoryRoutes.js';
import jobPostRoutes from './routes/jobpostRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express()
const port = 3000

dotenv.config()
connectDB()


app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3001', // Allow all origins, you can specify a specific origin if needed  
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true // Allow credentials if needed
}));



app.get('/', (req, res) => {
  res.send('Hello guys!')
})


// end pont of category
app.use('/api/categories', categoryRoutes);
// end point of job post
app.use('/api/jobposts', jobPostRoutes);

app.use("/api/auth", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
