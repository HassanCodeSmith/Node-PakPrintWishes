const GetQuote = require("../models/get_quote");
const Notification = require("../models/notification");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/user");
const requestQuote = require("../templates/requestQuote");
const rateQuote = require("../templates/rateQuote");

exports.addGetQuote = async (req, res) => {
  try {
    const {
      colorOption,
      comment,
      email,
      height,
      width,
      length,
      name,
      phone,
      printingType,
      quantity_1,
      quantity_2,
      quantity_3,
      boxType,
      typeCard,
    } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const relativePath = req.file.location.replace(/.*\/uploads/, "/uploads");

    const attachFile = relativePath;

    const quote = await GetQuote.create({
      colorOption,
      comment,
      email,
      height,
      width,
      length,
      name,
      phone,
      printingType,
      quantity_1,
      quantity_2,
      quantity_3,
      boxType,
      typeCard,
      attachFile,
    });

    const admins = await User.find({ role: "admin" });
    admins.forEach(async (admin) => {
      // const requestQuoteTemplate = requestQuote(
      //   admin.first_name,
      //   name,
      //   email,
      //   phone,
      //   colorOption,
      //   comment,
      //   height,
      //   width,
      //   length,
      //   printingType,
      //   quantity_1,
      //   quantity_2,
      //   quantity_3,
      //   boxType,
      //   typeCard
      // );

      // sendEmail({
      //   to: admin.email,
      //   subject: "Request Quote",
      //   html: requestQuoteTemplate,
      // });

      await Notification.create({
        reciever: admin._id,
        title: "Request Quote",
        body: `${name} has requested a quote.`,
        type: "quote",
        id: quote._id,
      });
    });

    return res.status(200).json({ success: true, data: quote });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getQuote = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const quotes = await GetQuote.find({ isSoftDelete: { $ne: true } }).sort({
      updatedAt: -1,
    });
    return res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
exports.getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const quote = await GetQuote.findOne({
      _id: id,
    });
    return res.status(200).json({ success: true, data: quote });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.addRateToQuote = async (req, res, next) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { rate, quoteId } = req.body;
    const findQuote = await GetQuote.findById(quoteId);
    if (!findQuote) {
      return res
        .status(400)
        .json({ success: false, message: "Quote not found." });
    }
    const quote = await GetQuote.findByIdAndUpdate(
      quoteId,
      { rate },
      { new: true }
    );

    const rateQuoteTemplate = rateQuote(quote);

    sendEmail({
      to: quote.email,
      subject: "Rate Quote",
      html: rateQuoteTemplate,
    });

    return res.status(200).json({ success: true, data: quote });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getQuotePending = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const quotes = await GetQuote.find({
      isSoftDelete: { $ne: true },
      status: "Pending",
    }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getQuoteConfirm = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const quotes = await GetQuote.find({
      isSoftDelete: { $ne: true },
      status: "Confirm",
    }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getQuoteDeliver = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const quotes = await GetQuote.find({
      isSoftDelete: { $ne: true },
      status: "Deliver",
    }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { quoteId, status } = req.body;
    console.log(req.body);
    const quote = await GetQuote.findByIdAndUpdate(
      quoteId,
      {
        status,
      },
      { new: true, runValidators: true }
    );
    const rateQuoteTemplate = rateQuote(quote);

    sendEmail({
      to: quote.email,
      subject: "Rate Quote",
      html: rateQuoteTemplate,
    });
    return res.status(200).json({ success: true, data: quote });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.softDeleteQuote = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { quoteId } = req.params;
    await GetQuote.findByIdAndUpdate(quoteId, { isSoftDelete: true });

    return res
      .status(200)
      .json({ success: true, message: "Quote has been deleted successfully" });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

exports.softDeleteQuoteMultiple = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ids, status } = req.body;
    console.log(req.body);
    await GetQuote.updateMany({ _id: { $in: ids } }, { isSoftDelete: true });
    let query = { isSoftDelete: { $ne: true } };
    status === "Pending" ? (query.status = "Pending") : null;
    status === "Confirm" ? (query.status = "Confirm") : null;
    status === "Deliver" ? (query.status = "Deliver") : null;

    const quotes = await GetQuote.find(query);

    return res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.permanantDeleteQuoteMultiple = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ids } = req.body;
    await GetQuote.deleteMany({ _id: { $in: ids } });
    let query = { isSoftDelete: true };

    const quotes = await GetQuote.find(query);

    return res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllSoftDeleted = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }

    const quotes = await GetQuote.find({ isSoftDelete: true }).sort({
      updatedAt: -1,
    });

    return res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.permenantDelete = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { quoteId } = req.params;
    await GetQuote.findOneAndRemove({ _id: quoteId });

    return res
      .status(200)
      .json({ success: true, message: "Quote was successfully removed" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.restoreQuote = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { quoteId } = req.params;
    await GetQuote.findByIdAndUpdate(quoteId, { isSoftDelete: false });

    return res
      .status(200)
      .json({ success: true, message: "Quote restored successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
