import express from "express";
import { getApplicationById, getApplicationByJob, submitApplication } from "../controllers/applicationController.js";
import { getMulterUpload }  from "../middleware/multer.js";

const router = express.Router();

const uploadResumePDF = getMulterUpload("resumes", ["application/pdf"], 2 * 1024 * 1024 * 1024 );

router.post("/submit", uploadResumePDF.single("resume") ,submitApplication)

router.get("/job/:jobId", getApplicationByJob)

router.get("/applicant/:id", getApplicationById)


export default router
