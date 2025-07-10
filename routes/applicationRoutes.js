import express from "express";
import { getApplicationByJob, submitApplication } from "../controllers/applicationController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/submit", upload.single("resume") ,submitApplication)

router.get("/job:jobId", getApplicationByJob)


export default router
