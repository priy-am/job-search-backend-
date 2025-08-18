import { JobPost } from "../models/jobpostSchema.js";
import { Category } from "../models/categorySchema.js";

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

  const category = await Category.findById(categoryId);
  console.log(category);

  if (!category) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  const image = req.file

  if(!image){
    return res.status(400).json({message: "Image is required."})
  }

  try {
    const newJobPost = new JobPost({
      description,
      skills,
      salary,
      role,
      experience,
      image: `/uploads/${image.filename}`,
      location,
      duration,
      company,
      recruiterId,
      jobTitle: category.category,
      categoryId: category._id,
    });
    await newJobPost.save();
    res.status(201).json(newJobPost);
  } catch (error) {
    console.error("Error creating job post:", error);
    res.status(500).json({ message: "Error creating job post", error });
  }
};

export const getAllJobPosts = async (req, res) => {
  try {
    const jobPosts = await JobPost.find()
      .populate("categoryId", "category")
      .sort({ createdAt: -1 });

    // group job posts by every category
    const grouped = {};

    for (const post of jobPosts) {
      const categoryName = post.categoryId?.category || "Unknown";

      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }

      grouped[categoryName].push(post);
    }
    const response = { jobPosts: jobPosts, grouped: grouped };
    // return grouped;

    // res.status(200).json(jobPosts);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job posts", error });
  }
};

export const getAllJobPostsGrouped = async (req, res) => {
  try {
    const grouped = await JobPost.aggregate([
      {
        $lookup: {
          from: "categories", // collection name
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
          image: { $first: "$categoryInfo.image" }, // Get the category image
          color: { $first: "$categoryInfo.color" }, // Get the category color
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
    res.status(500).json({ message: "Error grouping job posts", error });
  }
};

export const getJobPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const jobPosts = await JobPost.findById(id);
    if (!jobPosts) {
      return res.status(404).json({
        message: "Job post not found",
      });
    }
    res.status(200).json(jobPosts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job post", error });
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
    const updatedJobPost = await JobPost.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true }
    );

    if (!updatedJobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    res.status(200).json(updatedJobPost);
  } catch (error) {
    res.status(500).json({ message: "Error updating job post", error });
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
    res.status(500).json({ message: "Error deleting job post", error });
  }
};

export const searchFilter = async (req, res) => {
  const { industry, location, keyword } = req.query;
  const filter = {};

  // Map 'industry' to 'jobTitle'
  if (industry) {
    filter.jobTitle = { $regex: industry, $options: "i" }; // Case-insensitive partial match
  }

  if (location) {
    filter.location = location;
  }

  // Match keyword across multiple fields: jobTitle, description, or skills
  if (keyword) {
    filter.$or = [
      { jobTitle: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { skills: { $in: [new RegExp(keyword, "i")] } }, // Case-insensitive match in skills array
    ];
  }

  // const orConditions = [];

  // if (industry) orConditions.push({ industry });
  // if (location) orConditions.push({ location });
  // if (keyword) orConditions.push({ title: { $regex: keyword, $options: "i" } });

  // const filter = orConditions.length ? { $or: orConditions } : {};

  try {
    const jobs = await JobPost.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (error) {
    console.log("server error", error);
    res.status(500).json({ message: "Error fetching jobs", error });
  }
};

export const getJobCreatedByMe = async (req, res) => {
  const { id } = req.params;
  try {
    // const jobPosts = await JobPost.findById(recruiterId: id);
    const jobPosts = await JobPost.find({ recruiterId: id }).sort({ createdAt: -1 });

    if (jobPosts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No job posts found for this recruiter",
      });
    }

    res.status(200).json({
      success: true,
      jobs: jobPosts,
    });
  } catch (error) {
    console.log("fetching job created by me error:- ", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server error", error });
  }
};
