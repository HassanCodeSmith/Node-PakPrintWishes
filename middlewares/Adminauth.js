const User = require("../models/user");

const adminAuth = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const user = await User.findOne({
      _id: userId,
      blocked: false,
      softDeleted: false,
      permanentDeleted: false,
    });

    if (user.role === "admin") {
      req.role = user.role;
      next();
      return;
    }
    if (user.role === "vendor") {
      req.role = user.role;
      next();
      return;
    }
    return res
      .status(400)
      .json({ success: false, message: "Authentication Invalid" });
  } catch (error) {
    console.log("Admin auth error: ", error);
    return res
      .status(400)
      .json({ status: false, message: "Authentication Invalid" });
  }
};

module.exports = adminAuth;
