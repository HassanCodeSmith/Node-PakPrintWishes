const blogRouter = require("express").Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlogStatusById,
  updateBlogById,
  deleteBlogById,
  getAllBlogsPublic,
  getBlogByIdPublic,
  getBlogSlider,
} = require("../controllers/blog.controllers");

const { upload } = require("../utils/upload");
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");

/** create blog */
blogRouter.post(
  "/createBlog",
  userAuth,
  adminAuth,
  upload.single("image"),
  createBlog
);

/** read all blogs */
blogRouter.get("/getAllBlogs", userAuth, adminAuth, getAllBlogs);

/** read blog by id */
blogRouter.get("/getBlogById/:id", userAuth, adminAuth, getBlogById);

/** update blog by id */
blogRouter.patch(
  "/updateBlogById/:id",
  userAuth,
  adminAuth,
  upload.single("image"),
  updateBlogById
);

/** update blog status by id */
blogRouter.patch(
  "/updateBlogStatusById/:id",
  userAuth,
  adminAuth,
  upload.none(),
  updateBlogStatusById
);

/** delete blog by id */
blogRouter.patch("/deleteBlogById/:id", userAuth, adminAuth, deleteBlogById);

/** is slider */
blogRouter.get("/getBlogSlider", getBlogSlider);

/** read all blogs publically */
blogRouter.get("/getAllBlogsPublic", getAllBlogsPublic);

/** read blog by id publically */
blogRouter.get("/getBlogByIdPublic/:id", getBlogByIdPublic);

module.exports = blogRouter;
