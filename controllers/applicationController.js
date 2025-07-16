import { Application } from "../models/applicationSchema.js";

export const submitApplication = async (req, res) => {
  try {
    const { fullName, mobile, email, experience, bio, resume, jobId } =
      req.body;
    console.log("resume", resume);
    // console.log(req)
    console.log("request body ", req.body);
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const application = new Application({
      fullName,
      mobile,
      email,
      experience,
      bio,
      jobId,
      resume: req.file.path,
    });
    await application.save();
    res.status(201).json({ message: "Application submitted successfully", application });
    console.log("file fetch suceessfully ", req.file.path);
  } catch (error) {
    console.error("Error submitting application: ", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getApplicationByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ jobId }).sort({ createdAt: -1 });

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Candidate apply",
      });
    }

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching applications",
      error: error.message,
    });
  }
};

export const getApplicationById = async (req, res) =>{
  try {
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
}

