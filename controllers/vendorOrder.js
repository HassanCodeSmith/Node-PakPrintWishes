const VendorOrder = require("../models/vendorOrder");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const Notification = require("../models/notification");
const sendEmail = require("../utils/sendEmail");
const assignOrderTemplate = require("../templates/assignOrder");
const sendNotification = require("../utils/sendNotificatoin");

/**
 * Assign Complete Order
 */
exports.assignCompeleteOrder = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { userId } = req.user;
    const { order, vendor } = req.body;
    console.log(req.body);
    if (!order || !vendor) {
      return res.status(400).json({
        success: false,
        message: "Please provide order and vender",
      });
    }
    const findOrder = await Order.findById(order);
    if (!findOrder) {
      return res.status(400).json({
        success: false,
        message: "Order not found",
      });
    }
    const findVendor = await User.findById(vendor);
    if (!findVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor not found",
      });
    }
    const findVendorOrder = await VendorOrder.findOne({
      vendor,
      order,
    }).populate("order");

    if (findVendorOrder) {
      const updatedVendorOrder = await VendorOrder.findOneAndUpdate(
        { _id: findVendorOrder._id },
        { vendor, order },
        { new: true }
      );

      for (const item of findOrder.products) {
        const updateOrder = await Order.findOneAndUpdate(
          { _id: findOrder._id, "products.product_id": item.product_id },
          { $set: { "products.$.assignedVendor": vendor, status: "Confirm" } }
        );
        console.log(updateOrder);
      }
      const findAdmin = await User.findById(userId);

      const orderAssignedTemplate = assignOrderTemplate(
        findVendorOrder.order.orderId,
        findVendor.first_name,
        findAdmin.email
      );

      console.log("qwertyu", findVendorOrder.order.orderId);

      sendEmail({
        to: findVendor.email,
        subject: "Order has been assigned",
        html: orderAssignedTemplate,
      });
      console.log(sendEmail);
      findVendor.fcm_token.forEach((token) => {
        sendNotification({
          to: token,
          notification: {
            title: "PakPrintwishes",
            body: "Order has been assigned",
          },
        });
      });

      const notification = await Notification.create({
        reciever: findVendor._id,
        title: "Order has been assigned",
        body: `Please review the order.`,
        type: "order",
        id: findVendorOrder._id,
      });
      console.log(">>>>>>>>>>", notification);
      return res.status(200).json({
        success: true,
        message: "New Vendor Assigned",
        data: updatedVendorOrder,
      });
    }

    const vendorOrder = await VendorOrder.create({
      order,
      vendor,
      products: findOrder.products,
      type: "Complete",
    });

    const newFindVendorOrder = await VendorOrder.findOne({
      vendor,
      order,
    }).populate("order");

    for (const item of findOrder.products) {
      await Order.findOneAndUpdate(
        { _id: findOrder._id, "products.product_id": item.product_id },
        { $set: { "products.$.assignedVendor": vendor, status: "Confirm" } }
      );
    }

    const findAdmin = await User.findById(userId);

    const orderAssignedTemplate = assignOrderTemplate(
      newFindVendorOrder.order.orderId,
      findVendor.first_name,
      findAdmin.email
    );

    sendEmail({
      to: findVendor.email,
      subject: "Order has been assigned",
      html: orderAssignedTemplate,
    });
    console.log(sendEmail);
    findVendor.fcm_token.forEach((token) => {
      sendNotification({
        to: token,
        notification: {
          title: "PakPrintwishes",
          body: "Order has been assigned",
        },
      });
    });

    const notification = await Notification.create({
      reciever: findVendor._id,
      title: "Order has been assigned",
      body: `Please review the order.`,
      type: "order",
      id: vendorOrder._id,
    });

    return res
      .status(200)
      .json({ success: true, message: "Order completely assigned " });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error });
  }
};

/**
 * Assign Single Product from order to vendor
 */
exports.assignOrderedProduct = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { userId } = req.user;

    const { order, product, vendor } = req.body;

    if (!order || !product || !vendor) {
      return res.status(400).json({
        success: false,
        message: "Please provide order, product, and vendor",
      });
    }

    const findOrder = await Order.findById(order);
    console.log(
      "findOrderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
      findOrder
    );
    if (!findOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const findVendor = await User.findById(vendor);

    if (!findVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const findProductInOrder = findOrder.products.find(
      (item) => item.product_id.toString() === product.toString()
    );
    console.log(
      "findProductInOrderrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
      findProductInOrder
    );

    if (!findProductInOrder) {
      console.log("__Product not found in the order");
      return res.status(400).json({
        success: false,
        message: "Product not found in the order",
      });
    }

    const findProduct = await Product.findById(product);

    if (!findProduct) {
      console.log("__Product not found");
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const findVendorOrder = await VendorOrder.findOne({ order }).populate(
      "order"
    );
    // __________________________________________________________________
    if (findVendorOrder) {
      const findAssignedProduct = findVendorOrder.products.find(
        (item) => item.product_id.toString() === product.toString()
      );
      //*************************************************************
      if (findAssignedProduct) {
        await VendorOrder.findOneAndUpdate(
          { _id: findVendorOrder._id },
          { vendor, order },
          { new: true }
        );

        await Order.findOneAndUpdate(
          { _id: findOrder._id, "products.product_id": product },
          { $set: { "products.$.assignedVendor": vendor, status: "Confirm" } }
        );

        const findAdmin = await User.findById(userId);

        const orderAssignedTemplate = assignOrderTemplate(
          findVendorOrder.order.orderId,
          findVendor.first_name,
          findAdmin.email
        );

        sendEmail({
          to: findVendor.email,
          subject: "Order has been assigned",
          html: orderAssignedTemplate,
        });

        findVendor.fcm_token.forEach((token) => {
          sendNotification({
            to: token,
            notification: {
              title: "PakPrintwishes",
              body: "Order has been assigned",
            },
          });
        });

        await Notification.create({
          receiver: findVendor._id,
          title: "Order has been assigned",
          body: "Please review the order.",
          type: "order",
          id: updatedOrder._id,
        });

        return res.status(200).json({
          success: true,
          message: "Product assigned to new vendor successfully",
        });

        // return res.status(200).json({
        //   success: true,
        //   message: "New Vendor Assigned",
        //   data: updatedVendorOrder,
        // });
      }
      //*************************************************************

      // await VendorOrder.findOneAndUpdate(
      //   { _id: findVendorOrder._id },
      //   { $addToSet: { products: findProductInOrder } }
      // );

      // const updatedOrder = await Order.findOneAndUpdate(
      //   { _id: findOrder._id, "products.product_id": product },
      //   {
      //     $set: {
      //       "products.$.assigned": true,
      //       status: "Confirm",
      //       "products.$.assignedVendor": vendor,
      //     },
      //   },
      //   { new: true }
      // );

      // console.log("=====> updatedOrderrrrrrrrrrrrrrrrrrrrrrrrrrrr", updatedOrder);
    }
    // __________________________________________________________________
    const newVendorProduct = await VendorOrder.create({
      products: [findProductInOrder],
      vendor,
      order,
      type: "Partial",
    });
    console.log(
      "newVendorProductttttttttttttttttttttttttttt",
      newVendorProduct
    );
    await Order.findOneAndUpdate(
      { _id: findOrder._id, "products.product_id": product },
      {
        $set: {
          "products.$.assigned": true,
          status: "Confirm",
          "products.$.assignedVendor": vendor,
        },
      }
    );

    await Order.findOneAndUpdate(
      { _id: findOrder._id },
      { completeAsign: true, status: "Confirm" }
    );

    const findAdmin = await User.findById(userId);

    const orderAssignedTemplate = assignOrderTemplate(
      newVendorProduct.order.orderId,
      findVendor.first_name,
      findAdmin.email
    );

    sendEmail({
      to: findVendor.email,
      subject: "Order has been assigned",
      html: orderAssignedTemplate,
    });

    findVendor.fcm_token.forEach((token) => {
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
      title: "Order has been assigned",
      body: "Please review the order.",
      type: "order",
      id: newVendorProduct._id,
    });

    return res.status(200).json({
      success: true,
      message: "Product assigned to vendor successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllVendorOrders = async (req, res) => {
  try {
    // if (req.role !== "admin") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Unauthorized",
    //   });
    // }
    const { url } = req;

    const { userId } = req.user;

    console.log("url==>>", url, userId);
    let query = { softDelete: { $ne: true } };

    req.role === "vendor" ? (query.vendor = userId) : null;

    url === "/getAllVendorOrdersPending"
      ? (query.status = "Pending")
      : "Pending";
    url === "/getAllVendorOrdersDeliverd"
      ? (query.status = "Delivered")
      : "Delivered";

    url === "/getAllVendorOrdersConfirm"
      ? (query.status = "Confirm")
      : "Confirm";

    url === "/getAllVendorOrdersCancelled"
      ? (query.status = "Cancelled")
      : "Cancelled";

    url === "/getAllVendorOrdersCompleted"
      ? (query.status = "Completed")
      : "Completed";
    // console.log(query);
    const orders = await VendorOrder.find(query)
      .sort({
        createdAt: -1,
      })
      .populate("products.product_id")
      .populate({
        path: "vendor",
        select: "first_name last_name email",
      });
    console.log("ordersssssssssssssssssssssssssssssssssssssssssss", orders);
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide status",
      });
    }
    const order = await VendorOrder.findById(id).populate("order");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    console.log(order.products[0].new_price);
    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This order is already cancelled",
      });
    }
    if (order.status === "Return") {
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
      const returnedOrder = await Order.findById(order.order._id);
      if (!returnedOrder) {
        return res
          .status(400)
          .json({ success: false, message: "No Order With This Id" });
      }
      const user = await User.findById(order.vendor);
      // console.log("User:", user);

      const paymentPending =
        user.paymentPending - returnedOrder.total_shipping_fee;
      // console.log("Pending:", user.paymentPending);
      // console.log("shipping:", returnedOrder.total_shipping_fee);
      // console.log("total pending::", paymentPending);

      await User.findByIdAndUpdate(order.vendor, {
        paymentPending,
      });
      await VendorOrder.findOneAndUpdate(
        { _id: id },
        { disputeDescription, status }
      );
      return res
        .status(200)
        .json({ success: true, message: "Status Changed Successfully!" });
    }
    if (order.status === "Completed" && status == "Delivered") {
      await VendorOrder.findOneAndUpdate({ _id: id }, { status });
      return res
        .status(200)
        .json({ success: true, message: "Order Status Updated Successfully" });
    }
    if (order.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "This order is already Completed",
      });
    }
    if (order.status === "Delivered") {
      if (status === "Disputed") {
        const { disputeDescription } = req.body;
        if (!disputeDescription) {
          return res.status(400).json({
            success: false,
            message: "Please Provide Reason For Dispute",
          });
        }
        await VendorOrder.findOneAndUpdate(
          { _id: id },
          { status, disputeDescription }
        );
      }
      if (status === "Approved") {
        const user = await User.findById(order.vendor);
        console.log("User:", user);

        const paymentPending = user.paymentPending + order.order.sub_total;
        console.log("New Payment Pending:", paymentPending);

        await User.findByIdAndUpdate(order.vendor, {
          paymentPending,
        });
      }

      const deliveryStatus = await VendorOrder.findOneAndUpdate(
        { _id: id },
        { status }
      );
    }
    if (order.status === "Approved") {
      return res
        .status(400)
        .json({ success: false, message: "This order is already Approved" });
    }
    if (order.status === "Cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "This order is already Cancelled" });
    }

    await VendorOrder.findOneAndUpdate({ _id: id }, { status });

    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await Notification.create({
        reciever: admin._id,
        title: "Order status updated",
        body: `Please review the Vendor order. Current order status is ${status}`,
        type: "order",
        id,
      });
      console.log("notification received");
    }
    return res
      .status(200)
      .json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getVendorOrderbyId = async (req, res) => {
  try {
    const { id } = req.params;

    const venderId = await VendorOrder.findById(id)
      .populate({
        path: "vendor",
        select: "first_name last_name email",
      })
      .populate({ path: "products.product_id", select: "" });
    return res.status(200).json({ success: true, data: venderId });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deliveryOrderStatus = async (req, res) => {
  try {
    const { vendorOrderId } = req.params;
    const find = await VendorOrder.findById(vendorOrderId);

    if (!find) {
      return res
        .status(400)
        .json({ success: false, message: "No Vendor Order With This Id" });
    }

    if (find.status !== "Delivered") {
      return res
        .status(400)
        .json({ success: false, message: "Not Delivered Yet" });
    }

    if (find.status === "Delivered") {
      if (find.deliveryOrderStatus === "approved") {
        return res.status(400).json({
          success: false,
          message: "Delivery Status Is Approved & Can't Be Changed",
        });
      }
      if (find.deliveryOrderStatus === "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Delivery Status Is Cancelled & Can't Be Changed",
        });
      }
      const { deliveryOrderStatus } = req.body;

      if (!deliveryOrderStatus) {
        return res.status(400).json({
          success: false,
          message: "Please Provide Delivery Order Status!",
        });
      }

      if (deliveryOrderStatus === "approved") {
        await VendorOrder.findByIdAndUpdate(vendorOrderId, {
          deliveryOrderStatus: { type: "approved" },
        });
        return res
          .status(200)
          .json({ success: true, message: "Delivery Order Status Updated!" });
      } else if (deliveryOrderStatus === "disputed") {
        const { description } = req.body;

        if (!description) {
          return res
            .status(400)
            .json({ success: false, message: "Please Provide Reason!" });
        }

        await VendorOrder.findByIdAndUpdate(vendorOrderId, {
          deliveryOrderStatus: { type: "disputed", description: description },
        });

        return res
          .status(200)
          .json({ success: true, message: "Delivery Order Status Updated!" });
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid Value For Delivery Order Status",
        });
      }
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
