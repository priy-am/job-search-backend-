import { JobPost } from "../models/jobpostSchema.js";
import { Category } from "../models/categorySchema.js";

const normalizeSkills = (skillsInput) => {
  if (Array.isArray(skillsInput)) return skillsInput.map(s => String(s).trim()).filter(Boolean);
  if (typeof skillsInput === "string") return skillsInput.split(",").map(s => s.trim()).filter(Boolean);
  return [];
};

const escapeRegex = (text = "") => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

export const createJobPost = async (req, res) => {
  const {
    description,
    skills,
    role,
    experience,
    salary,
    location,
    duration,
    company,
    categoryId,
    recruiterId,
  } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const image = req.file;
    if (!image) {
      return res.status(400).json({ message: "Image is required." });
    }

    const finalRecruiterId = req.user?.id || recruiterId;

    const newJobPost = new JobPost({
      description,
      skills: normalizeSkills(skills),
      salary: Number(salary) || 0,
      role,
      experience: Number(experience) || 0,
      image: `/uploads/${image.filename}`,
      location,
      duration,
      company,
      recruiterId: finalRecruiterId,
      jobTitle: category.category,
      categoryId: category._id,
    });
    await newJobPost.save();
    res.status(201).json(newJobPost);
  } catch (error) {
    console.error("Error creating job post:", error);
    res.status(500).json({ message: "Error creating job post", error: error.message });
  }
};

export const getAllJobPosts = async (req, res) => {
  try {
    const jobPosts = await JobPost.find()
      .populate("categoryId", "category")
      .sort({ createdAt: -1 })
      .lean();

    const grouped = {};
    for (const post of jobPosts) {
      const categoryName = post.categoryId?.category || "Other";
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(post);
    }

    res.status(200).json({ jobPosts, grouped });
  } catch (error) {
    res.status(500).json({ message: "Error fetching job posts", error: error.message });
  }
};

export const getAllJobPostsGrouped = async (req, res) => {
  try {
    const grouped = await JobPost.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $group: {
          _id: "$categoryInfo.category",
          image: { $first: "$categoryInfo.image" },
          color: { $first: "$categoryInfo.color" },
          count: { $sum: 1 },
          posts: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          image: 1,
          color: 1,
          count: 1,
          posts: 1,
        },
      },
    ]);

    res.status(200).json({ grouped });
  } catch (error) {
    res.status(500).json({ message: "Error grouping job posts", error: error.message });
  }
};

export const getJobPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const jobPost = await JobPost.findById(id).populate("categoryId").lean();
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }
    res.status(200).json(jobPost);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job post", error: error.message });
  }
};

export const updateJobPost = async (req, res) => {
  const { id } = req.params;
  const {
    description,
    skills,
    salary,
    role,
    experience,
    image,
    location,
    duration,
    company,
    recruiterId,
    categoryId,
  } = req.body;

  try {
    const updateData = {};
    if (description) updateData.description = description;
    if (skills) updateData.skills = normalizeSkills(skills);
    if (salary !== undefined) updateData.salary = Number(salary);
    if (role) updateData.role = role;
    if (experience !== undefined) updateData.experience = Number(experience);
    if (image) updateData.image = image;
    if (location) updateData.location = location;
    if (duration) updateData.duration = duration;
    if (company) updateData.company = company;
    if (categoryId) updateData.categoryId = categoryId;

    const updatedJobPost = await JobPost.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean();

    if (!updatedJobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    res.status(200).json(updatedJobPost);
  } catch (error) {
    res.status(500).json({ message: "Error updating job post", error: error.message });
  }
};

export const deleteJobPost = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJobPost = await JobPost.findByIdAndDelete(id);
    if (!deletedJobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    res.status(200).json({ message: "Job post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job post", error: error.message });
  }
};

export const searchFilter = async (req, res) => {
  const { industry, location, keyword } = req.query;
  const filter = {};

  if (industry) {
    const safeIndustry = escapeRegex(industry);
    filter.jobTitle = { $regex: safeIndustry, $options: "i" };
  }

  if (location) {
    const safeLocation = escapeRegex(location);
    filter.location = { $regex: safeLocation, $options: "i" };
  }

  if (keyword) {
    const safeKeyword = escapeRegex(keyword);
    filter.$or = [
      { jobTitle: { $regex: safeKeyword, $options: "i" } },
      { description: { $regex: safeKeyword, $options: "i" } },
      { role: { $regex: safeKeyword, $options: "i" } },
      { company: { $regex: safeKeyword, $options: "i" } },
      { skills: { $in: [new RegExp(safeKeyword, "i")] } },
    ];
  }

  try {
    const jobs = await JobPost.find(filter).sort({ createdAt: -1 }).lean();
    res.status(200).json({ jobs: jobs || [] });
  } catch (error) {
    console.error("searchFilter error:", error);
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
};

export const getJobCreatedByMe = async (req, res) => {
  const recruiterId = req.user?.id || req.params.id;
  try {
    const jobPosts = await JobPost.find({ recruiterId }).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      jobs: jobPosts || [],
    });
  } catch (error) {
    console.error("fetching job created by me error: ", error);
    res.status(500).json({ success: false, message: "Internal Server error", error: error.message });
  }
};
