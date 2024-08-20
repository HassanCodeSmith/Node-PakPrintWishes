const VendorCustomOrderModel = require("../models/vendor-custom-order.model");
const User = require("../models/user");
const Notification = require("../models/notification");
const CustomProductOrderModel = require("../models/order-custom-product.model");

/**
 * Create Vendor Custom Order
 */
exports.getAllVendorCustomOrders = async (req, res) => {
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

    const allVendorCustomOrders = await VendorCustomOrderModel.find({
      permanentDeleted: false,
    })
      .populate("vendorId", "first_name last_name email")
      .populate("customProduct.customProductId", "titles images sku");

    if (allVendorCustomOrders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Vendor Custom Orders Found",
      });
    }
    return res.status(200).json({
      success: true,
      data: allVendorCustomOrders,
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
 * Get All Pending Vendor Custom Orders
 */
exports.getAllPendingVendorCustomOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const pendingVendorCustomOrders = await VendorCustomOrderModel.find({
      permanentDeleted: false,
      status: "Pending",
    })
      .populate("vendorId", "first_name last_name email")
      .populate("customProduct.customProductId", "titles images sku");
    if (pendingVendorCustomOrders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Pending Vendor Custom Orders Found",
      });
    }
    return res.status(200).json({
      success: true,
      data: pendingVendorCustomOrders,
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
 * Get All Confirm Vendor Custom Orders
 */
exports.getAllConfirmVendorCustomOrders = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const confirmVendorCustomOrders = await VendorCustomOrderModel.find({
      permanentDeleted: false,
      status: "Confirm",
    })
      .populate("vendorId", "first_name last_name email")
      .populate("customProduct.customProductId", "titles images sku");
    if (confirmVendorCustomOrders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Confirm Vendor Custom Orders Found",
      });
    }
    return res.status(200).json({
      success: true,
      data: confirmVendorCustomOrders,
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
 * Get All Completed Vendor Custom Orders
 */
exports.getAllCompletedVendorCustomOrders = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const completedVendorCustomOrders = await VendorCustomOrderModel.find({
      permanentDeleted: false,
      status: "Completed",
    })
      .populate("vendorId", "first_name last_name email")
      .populate("customProduct.customProductId", "titles images sku");
    if (completedVendorCustomOrders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Completed Vendor Custom Orders Found",
      });
    }
    return res.status(200).json({
      success: true,
      data: completedVendorCustomOrders,
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
 * Get All Cancelled Vendor Custom Orders
 */
exports.getAllCancelledVendorCustomOrders = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const cancelledVendorCustomOrders = await VendorCustomOrderModel.find({
      permanentDeleted: false,
      status: "Cancelled",
    })
      .populate("vendorId", "first_name last_name email")
      .populate("customProduct.customProductId", "titles images sku");
    if (cancelledVendorCustomOrders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Cancelled Vendor Custom Orders Found",
      });
    }
    return res.status(200).json({
      success: true,
      data: cancelledVendorCustomOrders,
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
 * Get All Delivered Vendor Custom Orders
 */
exports.getAllDeliveredVendorCustomOrders = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const deliveredVendorCustomOrders = await VendorCustomOrderModel.find({
      permanentDeleted: false,
      status: "Delivered",
    })
      .populate("vendorId", "first_name last_name email")
      .populate("customProduct.customProductId", "titles images sku");
    if (deliveredVendorCustomOrders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Delivered Vendor Custom Orders Found",
      });
    }
    return res.status(200).json({
      success: true,
      data: deliveredVendorCustomOrders,
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
 * Change Vendor Custom Order Status
 */
exports.changeStatusVendorCustomOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide status",
      });
    }

    const vendorCustomOrder = await VendorCustomOrderModel.findOne({
      _id: id,
      permanentDeleted: false,
    }).populate("customProductOrderId");

    if (!vendorCustomOrder) {
      console.log("Order not found");
      return res.status(400).json({
        success: false,
        message: "Order not found",
      });
    }

    if (vendorCustomOrder.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This order is already cancelled",
      });
    }

    if (vendorCustomOrder.status === "Return") {
      return res
        .status(400)
        .json({ success: false, message: "Order is already returned" });
    }

    if (status === "Return") {
      const { disputeDescription } = req.body;
      if (!disputeDescription) {
        return res.status(400).json({
          success: false,
          message: "Please Provide Reason For Returning Order",
        });
      }

      const returnedOrder = await CustomProductOrderModel.findById(
        vendorCustomOrder.customProductOrderId._id
      );
      if (!returnedOrder) {
        return res
          .status(400)
          .json({ success: false, message: "No Order With This Id" });
      }

      const user = await User.findById(vendorCustomOrder.vendorId);

      const paymentPending =
        user.paymentPending - returnedOrder.total_shipping_fee;

      await User.findByIdAndUpdate(vendorCustomOrder.vendorId, {
        paymentPending,
      });

      await VendorCustomOrderModel.findOneAndUpdate(
        { _id: id },
        { disputeDescription, status }
      );

      return res
        .status(200)
        .json({ success: true, message: "Status Changed Successfully!" });
    }

    if (vendorCustomOrder.status === "Completed" && status == "Delivered") {
      await VendorCustomOrderModel.findOneAndUpdate({ _id: id }, { status });
      return res
        .status(200)
        .json({ success: true, message: "Order Status Updated Successfully" });
    }

    if (vendorCustomOrder.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "This order is already Completed",
      });
    }

    if (vendorCustomOrder.status === "Delivered") {
      if (status === "Disputed") {
        const { disputeDescription } = req.body;
        if (!disputeDescription) {
          return res.status(400).json({
            success: false,
            message: "Please Provide Reason For Dispute",
          });
        }
        await VendorCustomOrderModel.findOneAndUpdate(
          { _id: id },
          { status, disputeDescription }
        );
      }
      if (status === "Approved") {
        const user = await User.findById(vendorCustomOrder.vendorId);

        const paymentPending =
          user.paymentPending +
          vendorCustomOrder.customProductOrderId.customTotal;

        await User.findByIdAndUpdate(vendorCustomOrder.vendorId, {
          paymentPending,
        });
      }

      await VendorCustomOrderModel.findOneAndUpdate({ _id: id }, { status });
    }

    if (vendorCustomOrder.status === "Approved") {
      return res
        .status(400)
        .json({ success: false, message: "This order is already Approved" });
    }
    if (vendorCustomOrder.status === "Cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "This order is already Cancelled" });
    }

    await VendorCustomOrderModel.findOneAndUpdate({ _id: id }, { status });

    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await Notification.create({
        reciever: admin._id,
        title: "Order status updated",
        body: `Please review the Vendor order. Current order status is ${status}`,
        type: "customProductOrder",
        id,
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Vendor Custom Order By Id
 */
exports.getVendorCustomOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const vendorCustomOrder = await VendorCustomOrderModel.findOne({
      _id: id,
      permanentDeleted: false,
    });

    if (!vendorCustomOrder) {
      console.log("Invalid id");
      return res.status(200).json({
        success: false,
        message: "Invalid id",
      });
    }
    return res.status(200).json({
      success: true,
      data: vendorCustomOrder,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
