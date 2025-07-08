import { JobPost } from "../models/jobpostSchema.js";
import { Category } from "../models/categorySchema.js";

export const createJobPost = async (req, res) => {
  const {
    description,
    skills,
    role,
    experience,
    image,
    salary,
    location,
    duration,
    company,
    categoryId,
  } = req.body;

  const category = await Category.findById(categoryId);
  console.log(category);

  if (!category) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    const newJobPost = new JobPost({
      description,
      skills,
      salary,
      role,
      experience,
      image,
      location,
      duration,
      company,
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
