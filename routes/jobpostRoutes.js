import express from "express";
import {
  getAllJobPosts,
  createJobPost,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
  getAllJobPostsGrouped,
  searchFilter,
} from "../controllers/jobpostController.js";

const router = express.Router();

// Route to get all job posts
router.get("/getJobPosts", getAllJobPostsGrouped);

router.get("/searchJobs", searchFilter)

router.get("/getAllJobPosts", getAllJobPosts);
// Route to create a new job post
router.post("/createPost", createJobPost);
// Route to get a job post by ID
router.get("/getJobById/:id", getJobPostById);
// Route to update a job post
router.put("/updateJobPost/:id", updateJobPost);
// Route to delete a job post
router.delete("/deleteJobPost/:id", deleteJobPost);

export default router;