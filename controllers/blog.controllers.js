const BlogModel = require("../models/blog.model");

/**********************
 * Blog Private APIs
 **********************
/**
 * Create Blog
 */
exports.createBlog = async (req, res) => {
  try {
    /** Check user role - admin or not */
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { userId } = req.user;
    const { title, introduction, description } = req.body;
    const image = req.file.location.replace(/.*\/uploads/, "/uploads");

    /** Check - blog title, introduction, description or image provided or not */
    if (
      !(
        title?.trim() &&
        introduction?.trim() &&
        description?.trim() &&
        req.file
      )
    ) {
      console.log(
        "Blog title, introduction, description and image must be provided"
      );
      return res.status(400).json({
        success: false,
        message:
          "Blog title, introduction, description and image must be provided",
      });
    }

    /** Create blog */
    await BlogModel.create({ ...req.body, image, createdBy: userId });

    /** Success message */
    console.log("Blog created successfully.");
    return res.status(200).json({
      success: true,
      message: "Blog created successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Read All Blog
 */
exports.getAllBlogs = async (req, res) => {
  try {
    /** Check user role - admin or not */
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    /** Get all blogs */
    const blogList = await BlogModel.find({ permanentDeleted: false }).sort({
      updatedAt: -1,
    });

    /** If blog collection is empty */
    if (blogList.length === 0) {
      console.log("Blog collection is empty");
      return res.status(200).json({
        success: true,
        message: "Blog collection is empty",
      });
    }

    /** Success message */
    return res.status(200).json({
      success: true,
      data: blogList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Read Blog By Id
 */
exports.getBlogById = async (req, res) => {
  try {
    /** Check user role - admin or not */
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { id } = req.params;

    /** Get blog using id */
    const blog = await BlogModel.findOne({
      _id: id,
      permanentDeleted: false,
    }).populate("createdBy", "first_name last_name email");

    /** If blog not found */
    if (!blog) {
      console.log("Blog not found or already deleted.");
      return res.status(400).json({
        success: false,
        message: "Blog not found or already deleted.",
      });
    }

    /** Success message */
    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Blog By Id
 */
exports.updateBlogById = async (req, res) => {
  try {
    /** Check user role - admin or not */
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    const { id } = req.params;

    /** Get blog using id */
    const blog = await BlogModel.findById(id, { permanentDeleted: false });

    /** If blog not found */
    if (!blog) {
      console.log("Blog not found or already deleted.");
      return res.status(400).json({
        success: false,
        message: "Blog not found or already deleted.",
      });
    }

    const updateFields = {};

    /** For blog image updation */
    if (req.file) {
      const image = req.file.location.replace(/.*\/uploads/, "/uploads");
      updateFields.image = image;
    } else {
      updateFields.image = blog.image;
    }

    /** For blog title updation */
    if (req.body.title) {
      updateFields.title = req.body.title;
    } else {
      updateFields.title = blog.title;
    }

    /** For blog introduction updation */
    if (req.body.introduction) {
      updateFields.introduction = req.body.introduction;
    } else {
      updateFields.introduction = blog.introduction;
    }

    /** For blog description updation */
    if (req.body.description) {
      updateFields.description = req.body.description;
    } else {
      updateFields.description = blog.description;
    }

    /** For blog isSlider updation */
    if (req.body.isSlider) {
      updateFields.isSlider = req.body.isSlider;
    } else {
      updateFields.isSlider = blog.isSlider;
    }

    /** Update Blog */
    await BlogModel.findByIdAndUpdate(id, updateFields);

    /** Success message */
    console.log("Blog updated successfully");
    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Blog Status By Id
 */
exports.updateBlogStatusById = async (req, res) => {
  try {
    /** Check user role - admin or not */
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    const { id } = req.params;

    /** Get blog using id */
    const blog = await BlogModel.findById(id, { permanentDeleted: false });

    /** If blog not found */
    if (!blog) {
      console.log("Blog not found or already deleted.");
      return res.status(400).json({
        success: false,
        message: "Blog not found or already deleted.",
      });
    }

    /** Find blog status */
    let blogStatus;
    if (blog.status === true) {
      blogStatus = false;
    } else {
      blogStatus = true;
    }

    /** Update blog status */
    await BlogModel.findByIdAndUpdate(id, { status: blogStatus });

    /** Success message */
    console.log("Blog updated successfully.");
    return res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Blog By Id
 */
exports.deleteBlogById = async (req, res) => {
  try {
    /** Check user role - admin or not */
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    const { id } = req.params;

    /** Get blog using id */
    const blog = await BlogModel.findOne({ _id: id, permanentDeleted: false });

    /** If blog not found */
    if (!blog) {
      console.log("Blog not found or already deleted.");
      return res.status(400).json({
        success: false,
        message: "Blog not found or already deleted.",
      });
    }

    /** Delete blog */
    await BlogModel.findByIdAndUpdate(id, { permanentDeleted: true });

    /** Success message */
    console.log("Blog deleted successfully.");
    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Is Slider
 */
exports.getBlogSlider = async (req, res) => {
  try {
    /** Get blog using id */
    const blogSliders = await BlogModel.find({
      isSlider: true,
      permanentDeleted: false,
    });

    /** If blog not found */
    if (blogSliders.length === 0) {
      console.log("Blog Slider list is empty");
      return res.status(200).json({
        success: true,
        message: "Blog Slider list is empty",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: blogSliders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**********************
 * Blog Public APIs
 **********************/

/**
 * Read All Blog Publically
 */
exports.getAllBlogsPublic = async (req, res) => {
  try {
    /** Get all blogs */
    const blogList = await BlogModel.find({ permanentDeleted: false }).sort({
      updatedAt: -1,
    });

    /** If blog collection is empty */
    if (blogList.length === 0) {
      console.log("Blog collection is empty");
      return res.status(200).json({
        success: true,
        message: "Blog collection is empty",
      });
    }

    /** Success message */
    return res.status(200).json({
      success: true,
      data: blogList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Read Blog By Id Publically
 */
exports.getBlogByIdPublic = async (req, res) => {
  try {
    const { id } = req.params;

    /** Get blog using id */
    const blog = await BlogModel.findById(id, {
      permanentDeleted: false,
    }).populate("createdBy", "first_name last_name email");

    /** If blog not found */
    if (!blog) {
      console.log("Blog not found or already deleted.");
      return res.status(400).json({
        success: false,
        message: "Blog not found or already deleted.",
      });
    }

    /** Success message */
    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
