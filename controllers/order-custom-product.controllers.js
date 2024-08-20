const CustomProductOrderModel = require("../models/order-custom-product.model");
const NotificationModel = require("../models/notification");
const VendorCustomOrderModel = require("../models/vendor-custom-order.model");
const UserModel = require("../models/user");
const CustomProductModel = require("../models/custom-design.model");

const orderConfirm = require("../templates/orderConfirmation");
const updateOrderStatus = require("../templates/updateOrderStatus");
const assignOrderTemplate = require("../templates/assignOrder");

const sendEmail = require("../utils/sendEmail");
const sendNotification = require("../utils/sendNotificatoin");

/**
 * Get All Custom Product Orders
 */
exports.getAllCustomProductOrders = async (req, res) => {
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

    /** Find custom product orders */
    const customProductOrders = await CustomProductOrderModel.find({
      permanentDeleted: false,
      softDelete: false,
    });

    /** if customProductOrders list is empty */
    if (customProductOrders?.length === 0) {
      console.log("Custom product orders list is empty");
      return res.status(200).json({
        success: true,
        message: "Custom product orders list is empty",
      });
    }

    /** success message */
    return res.status(200).json({
      success: true,
      data: customProductOrders,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Custom Product Order using id
 */
exports.getCustomProductOrderById = async (req, res) => {
  try {
    /** Get product id from params */
    const { id } = req.params;

    /** Check user role - admin or not */
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    /** Find custom product order using id */
    const customProductOrder = await CustomProductOrderModel.findOne({
      _id: id,
      permanentDeleted: false,
      softDelete: false,
    })
      .populate(
        "createdBy",
        "first_name last_name email phone address country city state"
      )
      .populate("customProduct.customProductId", "titles images sku");

    /** If order not found */
    if (!customProductOrder) {
      console.log("Custom product order not found or may have been deleted.");
      return res.status(400).json({
        success: false,
        message: "Custom product order not found or may have been deleted.",
      });
    }

    /** success message */
    return res.status(200).json({
      success: true,
      data: customProductOrder,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Soft Delete Custom Product Order
 */
exports.softDeleteCustomProductOrder = async (req, res) => {
  try {
    /** Get product id from params */
    const { id } = req.params;

    /** Check user role - admin or not */
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    /** Find custom product order using id */
    const customProductOrder = await CustomProductOrderModel.findOne({
      _id: id,
      permanentDeleted: false,
      softDelete: false,
    });

    /** If order not found */
    if (!customProductOrder) {
      console.log(
        "Custom product order not found or may have already been deleted."
      );
      return res.status(400).json({
        success: false,
        message:
          "Custom product order not found or may have already been deleted.",
      });
    }

    /** if order found then delete it */
    await CustomProductOrderModel.findByIdAndUpdate(id, {
      softDelete: true,
    });

    console.log("Custom product order deleted successfully.");
    return res.status(200).json({
      success: true,
      message: "Custom product order deleted successfully.",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Restore Soft Delete Custom Product Order
 */
exports.restoreSoftDeleteCustomProductOrder = async (req, res) => {
  try {
    /** Get product id from params */
    const { id } = req.params;

    /** Check user role - admin or not */
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    /** Find custom product order using id */
    const customProductOrder = await CustomProductOrderModel.findOne({
      _id: id,
      permanentDeleted: false,
      softDelete: true,
    });

    /** If order not found */
    if (!customProductOrder) {
      console.log(
        "Custom product order not found or may have permanently deleted."
      );
      return res.status(400).json({
        success: false,
        message:
          "Custom product order not found or may have permanently been deleted.",
      });
    }

    /** if order found then restore it */
    await CustomProductOrderModel.findByIdAndUpdate(id, {
      softDelete: false,
    });

    console.log("Custom product order restored successfully.");
    return res.status(200).json({
      success: true,
      message: "Custom product order restored successfully.",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Custom Product Order Permanently
 */
exports.deletePermanentlyCustomProductOrder = async (req, res) => {
  try {
    /** Get product id from params */
    const { id } = req.params;

    /** Check user role - admin or not */
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    /** Find custom product order using id */
    const customProductOrder = await CustomProductOrderModel.findOne({
      _id: id,
      permanentDeleted: false,
      softDelete: true,
    });

    /** If order not found */
    if (!customProductOrder) {
      console.log(
        "Custom product order not found or may have already been deleted."
      );
      return res.status(400).json({
        success: false,
        message:
          "Custom product order not found or may have already been deleted.",
      });
    }

    /** if order found then delete it */
    await CustomProductOrderModel.findByIdAndUpdate(id, {
      permanentDeleted: true,
    });

    console.log("Custom product order permanently deleted successfully.");
    return res.status(200).json({
      success: true,
      message: "Custom product order permanently deleted successfully.",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Deleted Custom Product Orders
 */
exports.getAllDeletedCustomProductOrders = async (req, res) => {
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

    /** Find deleted custom product orders */
    const deletedCustomProductOrdersList = await CustomProductOrderModel.find({
      permanentDeleted: false,
      softDelete: true,
    });

    /** If list is empty */
    if (Object.keys(deletedCustomProductOrdersList).length === 0) {
      console.log("Deleted custom products order list is empty.");
      return res.status(200).json({
        success: true,
        message: "Deleted custom products order list is empty.",
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedCustomProductOrdersList,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Pending Orders
 */
exports.getAllPendingCustomProductOrders = async (req, res) => {
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

    /** Find pending custom product orders */
    const pendingCustomProductOrdersList = await CustomProductOrderModel.find({
      permanentDeleted: false,
      softDelete: false,
      status: "Pending",
    });

    /** If list is empty */
    if (Object.keys(pendingCustomProductOrdersList).length === 0) {
      console.log("Pending custom product order list is empty.");
      return res.status(200).json({
        success: true,
        message: "Pending custom product order list is empty.",
      });
    }

    return res.status(200).json({
      success: true,
      data: pendingCustomProductOrdersList,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Confirm Orders
 */
exports.getAllConfirmCustomProductOrders = async (req, res) => {
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

    /** Find confirm custom product orders */
    const confirmCustomProductOrdersList = await CustomProductOrderModel.find({
      permanentDeleted: false,
      softDelete: false,
      status: "Confirm",
    });

    /** If list is empty */
    if (Object.keys(confirmCustomProductOrdersList).length === 0) {
      console.log("Confirm Custom product order list is empty.");
      return res.status(200).json({
        success: true,
        message: "Confirm Custom product order list is empty.",
      });
    }

    return res.status(200).json({
      success: true,
      data: confirmCustomProductOrdersList,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Deliver Orders
 */
exports.getAllDeliverCustomProductOrders = async (req, res) => {
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

    /** Find deliver custom product orders */
    const deliverCustomProductOrdersList = await CustomProductOrderModel.find({
      permanentDeleted: false,
      softDelete: false,
      status: "Deliver",
    });

    /** If list is empty */
    if (Object.keys(deliverCustomProductOrdersList).length === 0) {
      console.log("Deliver Custom product order list is empty.");
      return res.status(200).json({
        success: true,
        message: "Deliver Custom product order list is empty.",
      });
    }

    return res.status(200).json({
      success: true,
      data: deliverCustomProductOrdersList,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Completed Orders
 */
exports.getAllCompletedCustomProductOrders = async (req, res) => {
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

    /** Find completed custom product orders */
    const completedCustomProductOrdersList = await CustomProductOrderModel.find(
      {
        permanentDeleted: false,
        softDelete: false,
        status: "Completed",
      }
    );

    /** If list is empty */
    if (Object.keys(completedCustomProductOrdersList).length === 0) {
      console.log("Completed Custom product order list is empty.");
      return res.status(200).json({
        success: true,
        message: "Completed Custom product order list is empty.",
      });
    }

    return res.status(200).json({
      success: true,
      data: completedCustomProductOrdersList,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Cancelled Orders
 */
exports.getAllCancelledCustomProductOrders = async (req, res) => {
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

    /** Find cancelled custom product orders */
    const cancelledCustomProductOrdersList = await CustomProductOrderModel.find(
      {
        permanentDeleted: false,
        softDelete: false,
        status: "Cancelled",
      }
    );

    /** If list is empty */
    if (Object.keys(cancelledCustomProductOrdersList).length === 0) {
      console.log("Cancelled Custom product order list is empty.");
      return res.status(200).json({
        success: true,
        message: "Cancelled Custom product order list is empty.",
      });
    }

    return res.status(200).json({
      success: true,
      data: cancelledCustomProductOrdersList,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Change Custom Product Order Status
 */
exports.changeCustomProductOrderStatus = async (req, res) => {
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
    const { status } = req.body;

    if (!status) {
      console.log("Status is required");
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const customProductOrder = await CustomProductOrderModel.findOne({
      _id: id,
      permanentDeleted: false,
      softDelete: false,
    }).populate("createdBy");

    if (!customProductOrder) {
      console.log("Order not found");
      return res.status(400).json({
        success: false,
        message: "Order not found",
      });
    }

    if (customProductOrder.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This order is already cancelled",
      });
    }

    if (status === "Confirm") {
      const { total_shipping_fee } = req.body;
      if (!total_shipping_fee) {
        return res
          .status(400)
          .json({ success: false, message: "Please enter shipping fee" });
      }
      const updateCustomProductOrder =
        await CustomProductOrderModel.findByIdAndUpdate(
          id,
          {
            total_shipping_fee,
            status,
          },
          { new: true }
        );

      const orderConfirmation = orderConfirm(
        customProductOrder.name,
        customProductOrder.delivery_address,
        customProductOrder.total_shipping_fee,
        customProductOrder.customTotal,
        Number(customProductOrder.customTotal) +
          Number(customProductOrder.total_shipping_fee)
      );

      sendEmail({
        to: customProductOrder.createdBy.email,
        subject: "Order Placed",
        html: orderConfirmation,
      });

      return res.status(200).json({
        success: true,
        data: updateCustomProductOrder,
      });
    }

    if (customProductOrder.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "This order is already completed",
      });
    }

    await CustomProductOrderModel.findByIdAndUpdate({ _id: id }, { status });

    const updateOrderTemplate = updateOrderStatus(
      customProductOrder._id,
      customProductOrder.createdBy.first_name,
      status
    );

    sendEmail({
      to: customProductOrder.createdBy.email,
      subject: "Order Status Change",
      html: updateOrderTemplate,
    });

    customProductOrder.createdBy.fcm_token.forEach((token) => {
      sendNotification({
        to: token,
        notification: {
          title: "PakPrintwishes",
          body: `Order status changed to ${status}`,
        },
      });
    });

    const notification = await NotificationModel.create({
      reciever: customProductOrder.createdBy,
      title: "Custom product order status changed.",
      body: `Custom product order status changed to ${status}`,
      type: "customProductOrder",
    });

    return res
      .status(200)
      .json({ success: true, message: "Successfully updated status" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Assign Complete Order - (Means custom product can be multiple products
 * that we can assign to a single vender to complete it )
 */
exports.assignCompleteCustomProductOrderToAsingleVendor = async (req, res) => {
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

    /** Get User ID of logged in user */
    const { userId } = req.user;

    /** Get CustomProductOrderID and VendorID */
    const { customProductOrderId, vendorId } = req.body;

    /** Check both ids not become null */
    if (!customProductOrderId || !vendorId) {
      console.log("Order id and vendor id must be provided");
      return res.status(400).json({
        success: false,
        message: "Order id and vendor id must be provided",
      });
    }

    /** Check Custom Prododuct Order exists or not */
    const customProductOrder = await CustomProductOrderModel.findOne({
      _id: customProductOrderId,
    });
    if (!customProductOrder) {
      console.log("Custom product order not found");
      return res.status(400).json({
        success: false,
        message: "Custom product order not found",
      });
    }

    /** Check Vendor is existing or not */
    const vendor = await UserModel.findOne({ _id: vendorId });
    if (!vendor) {
      console.log("Vendor not found");
      return res.status(400).json({
        success: false,
        message: "Vendor not found",
      });
    }

    /** Check vendor have any one product related to custom product if have then assign all product to it */
    const vendorCustomOrder = await VendorCustomOrderModel.findOne({
      vendorId,
      customProductOrderId,
    }).populate("customProductOrderId");

    if (vendorCustomOrder) {
      const updatedVendorOrder = await VendorCustomOrderModel.findOneAndUpdate(
        {
          _id: vendorCustomOrder._id,
        },
        { vendorId, customProductOrderId },
        { new: true }
      );

      for (const item of customProductOrder.customProduct) {
        await CustomProductOrderModel.findOneAndUpdate(
          {
            _id: customProductOrder._id,
            "customProduct.customProductId": item.customProductId,
          },
          {
            $set: {
              "customProduct.$.assignedVendor": vendorId,
              status: "Confirm",
            },
          }
        );
      }

      const findAdmin = await UserModel.findById(userId);

      const orderAssignedTemplate = assignOrderTemplate(
        vendorCustomOrder.customProductOrderId.customOrderCode,
        vendor.first_name,
        findAdmin.email
      );

      sendEmail({
        to: vendor.email,
        subject: "Custom Product Order has been assigned",
        html: orderAssignedTemplate,
      });

      vendor.fcm_token.forEach((token) => {
        sendNotification({
          to: token,
          notification: {
            title: "PakPrintwishes",
            body: "Custom Product Order has been assigned",
          },
        });
      });

      await NotificationModel.create({
        reciever: vendor._id,
        title: "Custom Product Order has been assigned",
        body: `Please review the order.`,
        type: "customProductOrder",
        id: vendorCustomOrder._id,
      });

      return res.status(200).json({
        success: true,
        message: "New Vendor Assigned",
        data: updatedVendorOrder,
      });
    }

    /** Create new Vendor Order */
    const newCustomVendorOrder = await VendorCustomOrderModel.create({
      customProductOrderId,
      vendorId,
      customProduct: customProductOrder.customProduct,
      type: "Complete",
    });

    for (const item of customProductOrder.customProduct) {
      await CustomProductOrderModel.findOneAndUpdate(
        {
          _id: customProductOrder._id,
          "customProduct.customProductId": item.customProductId,
        },
        {
          $set: {
            "customProduct.$.assignedVendor": vendorId,
            status: "Confirm",
          },
        }
      );
    }

    const findAdmin = await UserModel.findById(userId);

    const orderAssignedTemplate = assignOrderTemplate(
      newCustomVendorOrder.customProductOrderId.customOrderCode,
      vendor.first_name,
      findAdmin.email
    );

    sendEmail({
      to: vendor.email,
      subject: "Custom Product Order has been assigned",
      html: orderAssignedTemplate,
    });

    vendor.fcm_token.forEach((token) => {
      sendNotification({
        to: token,
        notification: {
          title: "PakPrintwishes",
          body: "Custom Product Order has been assigned",
        },
      });
    });

    await NotificationModel.create({
      reciever: vendor._id,
      title: "Custom Product Order has been assigned",
      body: `Please review the order.`,
      type: "customProductOrder",
      id: newCustomVendorOrder._id,
    });

    return res.status(200).json({
      success: true,
      message: "Custom Product Order completely assigned",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Assign Single Order - (Means custom product can be multiple products
 * that we can assign to a single vender to complete it )
 */
exports.assignSingleCustomProductOrderToAsingleVendor = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { userId } = req.user;

    const { customProductId, customProductOrderId, vendorId } = req.body;

    if (!customProductId || !customProductOrderId || !vendorId) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide Custom-product-id, Custom-product-order-id, and Vendor-id",
      });
    }

    const customProductOrder = await CustomProductOrderModel.findById(
      customProductOrderId
    );

    if (!customProductOrder) {
      return res.status(404).json({
        success: false,
        message: "Custom product order not found",
      });
    }

    const vendor = await UserModel.findById(vendorId);

    if (!vendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const findProductInCustomProductOrder =
      customProductOrder.customProduct.find(
        (item) => item.customProductId.toString() === customProductId.toString()
      );

    if (!findProductInCustomProductOrder) {
      return res.status(400).json({
        success: false,
        message: "Custom Product not found in Custom Product Order",
      });
    }

    const customProduct = await CustomProductModel.findById(customProductId);

    if (!customProduct) {
      return res.status(404).json({
        success: false,
        message: "Custom Product not found",
      });
    }

    const findVendorCustomOrder = await VendorCustomOrderModel.findOne({
      customProductOrderId,
    }).populate("customProductOrderId");

    console.log(
      "findVendorCustomOrderrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
      findVendorCustomOrder
    );
    if (findVendorCustomOrder) {
      const findAssignedProduct = findVendorCustomOrder.customProduct.find(
        (item) => item.customProductId.toString() === customProductId.toString()
      );

      if (findAssignedProduct) {
        const updatedVendorCustomOrder =
          await VendorCustomOrderModel.findOneAndUpdate(
            { _id: findVendorCustomOrder._id },
            { vendorId, customProductOrderId },
            { new: true }
          );
        console.log(
          "updatedVendorCustomOrderrddddddddddddddddddd",
          updatedVendorCustomOrder
        );
        await CustomProductOrderModel.findOneAndUpdate(
          {
            _id: customProductOrder._id,
            "customProduct.customProductId": customProductId,
          },
          {
            $set: {
              "customProduct.$.assignedVendor": vendorId,
              status: "Confirm",
            },
          }
        );

        return res.status(200).json({
          success: true,
          message: "New Vendor Assigned",
          data: updatedVendorCustomOrder,
        });
      }

      await VendorCustomOrderModel.findOneAndUpdate(
        { _id: findVendorCustomOrder._id },
        { $addToSet: { customProduct: findProductInCustomProductOrder } }
      );

      const updatedCustomProductOrder =
        await CustomProductOrderModel.findOneAndUpdate(
          {
            _id: customProductOrder._id,
            "customProduct.customProductId": customProductId,
          },
          { $set: { "customProduct.$.assigned": true, status: "Confirm" } },
          { new: true }
        );

      const findAdmin = await User.findById(userId);

      const orderAssignedTemplate = assignOrderTemplate(
        findVendorCustomOrder.customProductOrderId.customOrderCode,
        vendor.first_name,
        findAdmin.email
      );

      sendEmail({
        to: vendor.email,
        subject: "Custom Product Order has been assigned",
        html: orderAssignedTemplate,
      });

      vendor.fcm_token.forEach((token) => {
        sendNotification({
          to: token,
          notification: {
            title: "PakPrintwishes",
            body: "Order has been assigned",
          },
        });
      });

      const notification = await NotificationModel.create({
        receiver: vendor._id,
        title: "Custom Product Order has been assigned",
        body: "Please review the order.",
        type: "customProductOrder",
        id: updatedCustomProductOrder._id,
      });

      return res.status(200).json({
        success: true,
        message: "Custom Product assigned to vendor successfully",
      });
    }

    console.log("I am hereeeeeeeeeeeeeeeeeeeeeeee");

    const newVendorCustomOrder = await VendorCustomOrderModel.create({
      customProduct: [findProductInCustomProductOrder],
      vendorId,
      customProductOrderId,
      type: "Partial",
    });

    await CustomProductOrderModel.findOneAndUpdate(
      {
        _id: customProductOrder._id,
        "customProduct.customProductId": customProductId,
      },
      { $set: { "customProduct.$.assigned": true, status: "Confirm" } }
    );

    await CustomProductOrderModel.findOneAndUpdate(
      { _id: customProductOrder._id },
      { completeAsign: true, status: "Confirm" }
    );

    const findAdmin = await UserModel.findById(userId);

    const orderAssignedTemplate = assignOrderTemplate(
      newVendorCustomOrder.customProductOrderId.customOrderCode,
      vendor.first_name,
      findAdmin.email
    );

    sendEmail({
      to: vendor.email,
      subject: "Order has been assigned",
      html: orderAssignedTemplate,
    });

    vendor.fcm_token.forEach((token) => {
      sendNotification({
        to: token,
        notification: {
          title: "PakPrintwishes",
          body: "Order has been assigned",
        },
      });
    });

    const notification = await Notification.create({
      receiver: findVendor._id,
      title: "Custom Product Order has been assigned",
      body: "Please review the order.",
      type: "customProductOrder",
      id: newVendorCustomOrder._id,
    });

    return res.status(200).json({
      success: true,
      message: "Custom Product assigned to vendor successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error });
  }
};
