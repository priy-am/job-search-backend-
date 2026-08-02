import express from "express";
import {
  getApplicationById,
  getApplicationByJob,
  submitApplication,
  getApplicationsByUser,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { getMulterUpload } from "../middleware/multer.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();

const uploadResumePDF = getMulterUpload("resumes", ["application/pdf"], 2 * 1024 * 1024 * 1024);

router.post("/submit", uploadResumePDF.single("resume"), submitApplication);
router.get("/job/:jobId", getApplicationByJob);
router.get("/applicant/:id", getApplicationById);
router.get("/user/me", isAuthenticated, getApplicationsByUser);
router.put("/status/:id", isAuthenticated, updateApplicationStatus);

export default router;
