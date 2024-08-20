const Notification = require("../models/notification");

exports.getNotification = async (req, res) => {
  try {
    const { userId } = req.user;
    const notifications = await Notification.find({ reciever: userId })
      // .populate({ path: "userId", select: "image" })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    return res.status(200).json({ success: false, message: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.user;
    await Notification.updateMany({ reciever: userId }, { isRead: true });

    return res
      .status(200)
      .json({ success: true, message: "Marked all as read" });
  } catch (error) {
    return res.status(200).json({ success: false, message: error.message });
  }
};

exports.markOneAsRead = async (req, res) => {
  try {
    const { userId } = req.user;
    const { notificationId } = req.params;

    const findNotification = await Notification.findById(notificationId);

    if (!findNotification) {
      return res
        .status(200)
        .json({ success: false, message: "Notification not found" });
    }
    if (findNotification.reciever.toString() !== userId.toString()) {
      return res.status(200).json({
        success: false,
        message: "You are not the notification's reciever",
      });
    }

    await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        reciever: userId,
      },
      { isRead: true }
    );

    return res
      .status(200)
      .json({ success: true, message: "Marked all as read" });
  } catch (error) {
    return res.status(200).json({ success: false, message: error.message });
  }
};
