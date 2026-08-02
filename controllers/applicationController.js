import { Application } from "../models/applicationSchema.js";

export const submitApplication = async (req, res) => {
  try {
    const { fullName, mobile, email, experience, bio, jobId, applicantId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const application = new Application({
      fullName,
      mobile,
      email,
      experience: Number(experience) || 0,
      bio,
      jobId,
      applicantId: req.user?.id || applicantId || null,
      resume: req.file.path.replace(/\\/g, "/"),
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully", application, success: true });
  } catch (error) {
    console.error("Error submitting application: ", error);
    res.status(500).json({ error: "Server error", success: false });
  }
};

export const getApplicationByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ jobId })
      .populate("jobId", "jobTitle company location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications: applications || [],
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

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id).populate("jobId", "jobTitle company location salary role");
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getApplicationsByUser = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    const email = req.query.email;

    const query = {};
    if (userId) {
      query.$or = [{ applicantId: userId }, { email: email || "" }];
    } else if (email) {
      query.email = email;
    }

    const applications = await Application.find(query)
      .populate("jobId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Submitted", "Under Review", "Shortlisted", "Rejected", "Accepted"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.status(200).json({ success: true, message: `Application marked as ${status}`, application });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

