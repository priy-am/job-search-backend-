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

export const getApplicationByJob = async (req, res)=>{
    try {
        const {jobId} = req.params;
        const applications = await Application.find({jobId});
        res.status(200).json(applications)
    } catch (error) {
        res.status(500).json({error: "server error"});
    }
}
