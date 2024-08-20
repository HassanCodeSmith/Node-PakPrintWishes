const Comment = require("../models/user_comments");
const Product = require("../models/product");
const User = require("../models/user");
const Notification = require("../models/notification");
const sendNotification = require("../utils/sendNotificatoin");

exports.addComment = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { productId, message } = req.body;
    if (!productId || !message) {
      return res.status(400).json({
        message: "Please provide and message",
        success: false,
      });
    }
    const product = await Product.findById(productId).select("vendor");
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }
    const { vendor } = product;
    const newComment = new Comment({
      userId,
      productId,
      message,
      vendor,
    });
    await newComment.save();
    const findVendor = await User.findById(vendor);
    findVendor.fcm_token.forEach((token) => {
      sendNotification({
        to: token,
        notification: {
          title: "PakPrintwishes",
          body: "Someone Comment",
        },
      });
    });

    const notification = await Notification.create({
      reciever: findVendor._id,
      title: "you Recieve a Comment",
      body: `Please review the Comment.`,
      type: "chat",
      id: productId,
      userId,
    });
    return res.status(201).json({
      message: "Comment added successfully",
      success: true,
      data: newComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.user;
    const comments = await Comment.find({
      productId,
      userId,
      permanentDeleted: false,
    });

    return res.status(200).json({
      message: "Comments fetched successfully",
      success: true,
      data: comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

exports.getAllCommentsRecord = async (req, res) => {
  try {
    const { userId } = req.user;
    let query = { permanentDeleted: false };

    req.role === "vendor" ? (query.vendor = userId) : null;

    console.log(query);
    // const comments = await Comment.find(query);

    const comments = await Comment.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            productId: "$productId",
          },
          data: { $first: "$$ROOT" },
          chatCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          data: 1,
          chatCount: 1,
        },
      },
    ]);

    const commentIds = comments.map((comment) => comment.data._id);

    const conversations = await Comment.find({ _id: { $in: commentIds } })
      .populate({
        path: "userId",
        select: "first_name last_name",
      })
      .populate({ path: "productId", select: "product_title images" })
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      message: "Comments fetched successfully",
      success: true,
      data: conversations,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

exports.getCommentsByUserandProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({
        message: "Please provide userId and productId",
        success: false,
      });
    }
    const comments = await Comment.find({
      userId,
      productId,
      permanentDeleted: false,
    })
      .populate({
        path: "userId",
        select: "first_name last_name",
      })
      .populate({ path: "productId", select: "product_title images" });

    return res.status(200).json({ success: true, data: comments });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

exports.replyComment = async (req, res) => {
  try {
    // console.log(req.body);
    const { userId, message, productId } = req.body;

    if (!userId || !message || !productId) {
      return res.status(400).json({
        message: "Please provide userId, message and productId",
        success: false,
      });
    }
    const adminId = req.user.userId;
    const comment = await Comment.create({
      userId,
      message,
      productId,
      adminId,
    });
    const findVendor = await User.findById(userId);
    findVendor.fcm_token.forEach((token) => {
      sendNotification({
        to: token,
        notification: {
          title: "PakPrintwishes",
          body: "Admin Reply your Comment",
        },
      });
    });

    return res.status(201).json({
      message: "Comment added successfully",
      success: true,
      data: comment,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

exports.deleteCommentById = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }

    const { productId, usersId } = req.body;

    const comment = await Comment.updateMany(
      {
        productId,
        userId: usersId,
      },
      {
        $set: { permanentDeleted: true },
      }
    );

    if (comment.nModified === 0) {
      return res
        .status(404) // Not Found
        .json({ success: false, message: "No comments found for deletion." });
    }

    return res.status(200).json({
      success: true,
      message: "Marked as permanently deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteComments = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }

    const criteria = req.body.criteria;
    // console.log(req.body);

    if (!Array.isArray(criteria)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid criteria format." });
    }

    const deletionPromises = criteria.map(async (criterion) => {
      const { productId, userId } = criterion;
      const updateResult = await Comment.updateMany(
        {
          productId,
          userId,
          permanentDeleted: false,
        },
        {
          $set: { permanentDeleted: true },
        }
      );
      return updateResult.nModified;
    });

    const updatedCounts = await Promise.all(deletionPromises);

    const totalUpdated = updatedCounts.reduce((acc, count) => acc + count, 0);

    if (totalUpdated === 0) {
      return res.status(404).json({
        success: false,
        message: "No comments found for marking as permanently deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Marked as deleted successfully",
      totalUpdated,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
