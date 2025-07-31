import express from "express";
import {
  getAllJobPosts,
  createJobPost,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
  getAllJobPostsGrouped,
  searchFilter,
  getJobCreatedByMe,
} from "../controllers/jobpostController.js";
import isAuthenticated from "../config/auth.js";
import { getMulterUpload } from "../middleware/multer.js";

const router = express.Router();
const uploadImage = getMulterUpload("uploads", ["image/"], 2 * 1024 * 1024); 

// Route to get all job posts
router.get("/getJobPosts", getAllJobPostsGrouped);

router.get("/searchJobs", searchFilter)

router.get("/getAllJobPosts", getAllJobPosts);
// Route to create a new job post
router.post("/createPost", isAuthenticated , uploadImage.single("image") , createJobPost);
// Route to get a job post by ID
router.get("/getJobById/:id", getJobPostById);
// Route to update a job post
router.put("/updateJobPost/:id", updateJobPost);
// Route to delete a job post
router.delete("/deleteJobPost/:id", deleteJobPost);

router.get("/getMYJob/:id", isAuthenticated ,getJobCreatedByMe)

export default router;