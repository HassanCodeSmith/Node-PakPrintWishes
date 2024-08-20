const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const VendorOrders = require("../models/vendorOrder");
const orderPlaced = require("../templates/orderPlaced");
const adminOrderPlaced = require("../templates/adminOrderPlaced");
const Notification = require("../models/notification");
const sendEmail = require("../utils/sendEmail");
const updateOrderStatus = require("../templates/updateOrderStatus");
const orderConfirm = require("../templates/orderConfirmation");
const sendNotification = require("../utils/sendNotificatoin");
const CustomProductOrderModel = require("../models/order-custom-product.model");

/**
 * Create Order (Product && Custom-Product)
 */
exports.createOrder = async (req, res) => {
  try {
    /** Check - User is valid or not */
    const { userId } = req.user;
    const findUser = await User.findById(userId);
    if (!findUser) {
      console.log("__User not found");
      return res.status(404).json({ error: "User not found" });
    }

    /** Get data from body */
    const {
      name,
      phone,
      delivery_address,
      payment_method,
      sub_total,
      all_totals,
      customTotal,
      customQuantity,
    } = req.body;

    /** Convert products and custom products JSON to Object */
    const parsedProducts = JSON.parse(req?.body?.products);
    const parsedCustomProduct = JSON.parse(req?.body?.customProduct);

    /** Check if both product and custom product not provided or may be empty */
    if (!(parsedProducts || parsedCustomProduct)) {
      consoel.log("__Please add at least one product");
      return res.status(400).json({ error: "Please add at least one product" });
    } else if (
      parsedProducts.length === 0 &&
      parsedCustomProduct.length === 0
    ) {
      consoel.log("__Please add at least one product");
      return res.status(400).json({ error: "Please add at least one product" });
    }

    /** Check common fields of product and custom product are provided or not */
    if (!(delivery_address?.trim() && name?.trim() && phone?.trim())) {
      console.log(
        "__Name, Phone-Number, and Delivery-Address are required fields"
      );
      return res.status(400).json({
        success: false,
        error: "Name, Phone-Number, and Delivery-Address are required fields",
      });
    }

    /** Check all_totals and sub_totals - if product provided */
    if (parsedProducts.length !== 0) {
      if (!(all_totals && sub_total)) {
        console.log("__Product's total and sub-total are required fields");
        return res.status(400).json({
          success: false,
          error: "Product's total and sub-total are required fields",
        });
      }
    }

    /** Check customTotal and customQuantity - if customProduct provided */
    if (parsedCustomProduct.length !== 0) {
      if (!(req.body.customTotal && req.body.customQuantity)) {
        console.log(
          "__Custom-Product's custom-total and custom-quantity are required fields"
        );
        return res.status(400).json({
          success: false,
          error:
            "Custom-Product's custom-total and custom-quantity are required fields",
        });
      }
    }

    //** Generate orderId ==> Basically it is (orderCode) */
    let orderId;
    if (parsedProducts?.length !== 0) {
      const currentYear = new Date().getFullYear().toString();
      const latestOrder = await Order.findOne(
        {},
        {},
        { sort: { orderId: -1 } }
      );
      let orderNumber = 1;
      if (latestOrder && latestOrder.orderId) {
        const latestOrderNumber = latestOrder.orderId.split("-")[2];
        orderNumber = parseInt(latestOrderNumber, 10) + 1;
      }
      const formattedOrderNumber = orderNumber.toString().padStart(8, "0");

      orderId = `${currentYear}-OC-${Number(formattedOrderNumber)}`;
    }

    /** Generate customOrderCode */
    let customOrderCode;
    if (parsedCustomProduct?.length !== 0) {
      const currentYear = new Date().getFullYear().toString();
      const latestOrder = await CustomProductOrderModel.findOne(
        {},
        {},
        { sort: { customOrderCode: -1 } }
      );
      let orderNumber = 1;
      if (latestOrder && latestOrder.customOrderCode) {
        const latestOrderNumber = latestOrder.customOrderCode.split("-")[2];
        orderNumber = parseInt(latestOrderNumber, 10) + 1;
      }
      const formattedOrderNumber = orderNumber.toString().padStart(8, "0");

      customOrderCode = `${currentYear}-COC-${formattedOrderNumber}`;
    }

    let order;
    let customOrder;

    /** Store product order and custom product when both are provided */
    if (parsedProducts?.length !== 0 && parsedCustomProduct?.length !== 0) {
      const updatedParsedProducts = parsedProducts.map((product) => ({
        ...product,
        orderId: orderId,
      }));
      console.log("__Update Parsend Products:", updatedParsedProducts);
      /** Store Product Order */
      order = await Order.create({
        orderId /** orderId is basically "orderCode" */,
        user_id: userId,
        name,
        phone,
        delivery_address,
        sub_total,
        all_totals,
        total_shipping_fee: 0,
        products: updatedParsedProducts,
        payment_method,
      });

      const updatedParsedCustomProduct = parsedCustomProduct.map(
        (customProduct) => ({
          ...customProduct,
          customOrderCode: orderId,
        })
      );

      console.log(
        "__Update Parsend Custom Products:",
        updatedParsedCustomProduct
      );
      /** Store Custom Product order */
      customOrder = await CustomProductOrderModel.create({
        customOrderCode: orderId,
        name,
        phone,
        delivery_address,
        payment_method,
        customTotal,
        customQuantity,
        customProduct: updatedParsedCustomProduct,
        createdBy: userId,
      });
    }

    /** Store product order if custom product is not provided */
    if (parsedProducts.length !== 0 && parsedCustomProduct?.length === 0) {
      const updatedParsedProducts = parsedProducts.map((product) => ({
        ...product,
        orderId: orderId,
      }));

      console.log("__Update Parsend Products:", updatedParsedProducts);

      order = await Order.create({
        orderId,
        user_id: userId,
        name,
        phone,
        delivery_address,
        sub_total,
        total_shipping_fee: 0,
        all_totals,
        products: updatedParsedProducts,
        payment_method,
      });
    }

    console.log("");

    /** Store custom product order if product is not provided */
    if (parsedProducts.length === 0 && parsedCustomProduct?.length !== 0) {
      const updatedParsedCustomProduct = parsedCustomProduct.map(
        (customProduct) => ({
          ...customProduct,
          customOrderCode: customOrderCode,
        })
      );
      console.log(
        "__Update Parsend Custom Products:",
        updatedParsedCustomProduct
      );
      /** Store custom product order if product is not provided */
      customOrder = await CustomProductOrderModel.create({
        customOrderCode,
        name,
        phone,
        delivery_address,
        payment_method,
        customTotal,
        customQuantity,
        customProduct: updatedParsedCustomProduct,
        createdBy: userId,
      });
    }

    /** Generate orderTemplate if we have order and not custom order or if both are provided  */
    let orderTemplate;
    if ((order && !customOrder) || (order && customOrder)) {
      orderTemplate = orderPlaced(
        findUser.first_name,
        order.orderId,
        delivery_address
      );
    }

    /** Generate orderTemplate if just customOrder provided */
    if (!order && customOrder) {
      orderTemplate = orderPlaced(
        findUser.first_name,
        customOrder.customOrderCode,
        delivery_address
      );
    }

    /** Send email to user */
    sendEmail({
      to: findUser.email,
      subject: "Order successfully placed.",
      html: orderTemplate,
    });

    /** Find all admins */
    const admins = await User.find({ role: "admin" });

    admins.forEach(async (admin) => {
      let adminTemplate;

      /** Generate adminTemplate if we have order and not custom order or if both are provided  */
      if ((order && !customOrder) || (order && customOrder)) {
        adminTemplate = adminOrderPlaced(
          admin.first_name,
          order.orderId,
          delivery_address,
          new Date(order.createdAt).toDateString(),
          findUser.email,
          findUser.phone
        );
      }

      /** Generate adminTemplate if just customOrder provided */
      if (!order && customOrder) {
        adminTemplate = adminOrderPlaced(
          admin.first_name,
          customOrder.customOrderCode,
          delivery_address,
          new Date(customOrder.createdAt).toDateString(),
          findUser.email,
          findUser.phone
        );
      }
      sendEmail({
        to: admin.email,
        subject: `${findUser.first_name} has placed the order. Please review the order.`,
        html: adminTemplate,
      });

      if (order && !customOrder) {
        await Notification.create({
          reciever: admin._id,
          title: "Order has been placed",
          body: `${findUser.first_name} has placed the order. Please review the order.`,
          type: "order",
        });
      }

      if (!order && customOrder) {
        await Notification.create({
          reciever: admin._id,
          title: "Custom product order has been placed",
          body: `${findUser.first_name} has placed the order. Please review the order.`,
          type: "customProductOrder",
        });
      }

      if (order && customOrder) {
        await Notification.create({
          reciever: admin._id,
          title: "Order has been placed",
          body: `${findUser.first_name} has placed the order. Please review the order.`,
          type: "order",
        });

        await Notification.create({
          reciever: admin._id,
          title: "Custom product order has been placed",
          body: `${findUser.first_name} has placed the order. Please review the order.`,
          type: "customProductOrder",
        });
      }
    });

    if (order && !customOrder) {
      return res.status(200).json({ success: true, data: order });
    }

    if (!order && customOrder) {
      return res.status(200).json({ success: true, data: customOrder });
    }

    if (order && customOrder) {
      return res.status(200).json({
        success: true,
        data: {
          _id: order._id,
          customOrderId: customOrder._id,
          name,
          phone,
          delivery_address,
          payment_method,
          all_totals,
          sub_total,
          orderId,
          products: order.products,
          customOrderCode: customOrder.customOrderCode,
          customTotal,
          customQuantity,
          customProduct: customOrder.customProduct,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Choose Payment Method
 */
exports.choosePaymentMethod = async (req, res) => {
  try {
    const { userId } = req.user;
    let { payment_method, orderId, customOrderId } = req.body;

    if (!(payment_method || (orderId && customOrderId))) {
      return res.status(404).json({
        success: false,
        error:
          "Payment Method or One of order id and custom order id must be provided",
      });
    }

    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(404).json({
        success: false,
        error: "Invalid authentication",
      });
    }

    let findProductOrder;
    if (orderId) {
      findProductOrder = await Order.findById(orderId);
      if (!findProductOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (findProductOrder.user_id.toString() !== userId.toString()) {
        return res.status(403).json({
          error: "Invaid user - You can not able to choose payment method",
        });
      }
    }

    let findCustomProductOrder;
    if (customOrderId) {
      findCustomProductOrder = await CustomProductOrderModel.findById(
        customOrderId
      );
      if (!findCustomProductOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (findCustomProductOrder.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({
          error: "Invaid user - You can not able to choose payment method",
        });
      }
    }

    // if (!payment_method) {
    //   return res.status(400).json({ error: "Please choose a payment method" });
    // }

    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        payment_method,
      },
      { new: true }
    );

    const customOrder = await CustomProductOrderModel.findOneAndUpdate(
      { _id: customOrderId },
      {
        payment_method,
      },
      { new: true }
    );

    /** Generate orderTemplate if we have order and not custom order or if both are provided  */
    let orderTemplate;
    if ((order && !customOrder) || (order && customOrder)) {
      orderTemplate = orderPlaced(
        findUser.first_name,
        order.orderId,
        order.delivery_address
      );
    }

    /** Generate orderTemplate if just customOrder provided */
    if (!order && customOrder) {
      orderTemplate = orderPlaced(
        findUser.first_name,
        customOrder.customOrderCode,
        customOrder.delivery_address
      );
    }

    /** Send email to user */
    sendEmail({
      to: findUser.email,
      subject: "Order successfully placed.",
      html: orderTemplate,
    });

    findUser.fcm_token.forEach((token) => {
      sendNotification({
        to: token,
        notification: {
          title: "PakPrintwishes",
          body: "Order successfully placed",
        },
      });
    });

    /** Find all admins */
    const admins = await User.find({ role: "admin" });

    admins.forEach(async (admin) => {
      let adminTemplate;

      /** Generate adminTemplate if we have order and not custom order or if both are provided  */
      if ((order && !customOrder) || (order && customOrder)) {
        adminTemplate = adminOrderPlaced(
          admin.first_name,
          order.orderId,
          order.delivery_address,
          new Date(order.createdAt).toDateString(),
          findUser.email,
          findUser.phone
        );
      }

      /** Generate adminTemplate if just customOrder provided */
      if (!order && customOrder) {
        adminTemplate = adminOrderPlaced(
          admin.first_name,
          customOrder.customOrderCode,
          customOrder.delivery_address,
          new Date(customOrder.createdAt).toDateString(),
          findUser.email,
          findUser.phone
        );
      }
      sendEmail({
        to: admin.email,
        subject: `${findUser.first_name} has placed the order. Please review the order.`,
        html: adminTemplate,
      });
      const notification = await Notification.create({
        reciever: admin._id,
        title: "Order has been placed",
        body: `${findUser.first_name} has placed the order. Please review the order.`,
        type: "order",
      });
    });

    if (order && !customOrder) {
      return res.status(200).json({ success: true, data: order });
    }

    if (!order && customOrder) {
      return res.status(200).json({ success: true, data: customOrder });
    }

    if (order && customOrder) {
      return res.status(200).json({
        success: true,
        data: {
          _id: order._id,
          customOrderId: customOrder._id,
          name: order.name,
          phone: order.phone,
          delivery_address: order.delivery_address,
          payment_method: order.payment_method,
          all_totals: order.all_totals,
          sub_total: order.sub_total,
          orderId: order.orderId,
          products: order.products,
          customOrderCode: customOrder.customOrderCode,
          customTotal: customOrder.customTotal,
          customQuantity: customOrder.customQuantity,
          customProduct: customOrder.customProduct,
        },
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get Oreder Details based on order code for both smiple product and custom product
 */
exports.getOrderDetailsByOrderCode = async (req, res) => {
  try {
    const { userId } = req.user;
    const { orderCode } = req.params;

    const userInOrderTable = await Order.findOne({
      user_id: userId,
      orderId: orderCode,
      permanentDeleted: false,
    })
      .populate("products.product_id", "product_title images")
      .populate("user_id", "first_name last_name email");

    const userInCustomOrderTable = await CustomProductOrderModel.findOne({
      createdBy: userId,
      customOrderCode: orderCode,
      permanentDeleted: false,
    })
      .populate("customProduct.customProductId", "titles images")
      .populate("createdBy", "first_name last_name email");

    if (!userInOrderTable && !userInCustomOrderTable) {
      return res.status(400).json({
        success: false,
        message: "No data found",
      });
    }

    if (userInOrderTable && userInCustomOrderTable) {
      return res.status(200).json({
        success: true,
        data: {
          user_id: userInOrderTable.user_id,
          name: userInOrderTable.name,
          phone: userInOrderTable.phone,
          delivery_address: userInOrderTable.delivery_address,
          sub_total: userInOrderTable.sub_total,
          total_shipping_fee: userInOrderTable.total_shipping_fee,
          all_totals: userInOrderTable.all_totals,
          products: userInOrderTable.products,
          orderId: userInOrderTable.orderId,
          completeAsign: userInOrderTable.completeAsign,
          status: userInOrderTable.status,
          payment_method: userInOrderTable.payment_method,
          customOrderCode: userInCustomOrderTable.customOrderCode,
          customTotal: userInCustomOrderTable.customTotal,
          customQuantity: userInCustomOrderTable.customQuantity,
          customProduct: userInCustomOrderTable.customProduct,
        },
      });
    }

    if (userInOrderTable && !userInCustomOrderTable) {
      return res.status(200).json({
        success: true,
        data: userInOrderTable,
      });
    }

    if (!userInOrderTable && userInCustomOrderTable) {
      return res.status(200).json({
        success: true,
        data: userInCustomOrderTable,
      });
    }
  } catch (error) {
    console.log(`getOrderDetailsByOrderCode - catch - ${error.message}`);
    return res.status(500).json({
      success: false,
      error: `getOrderDetailsByOrderCode - catch - ${error.message}`,
    });
  }
};

exports.getOderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const findOrder = await Order.findById(orderId).populate(
      "products.product_id"
    );
    if (!findOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.status(200).json({ success: true, data: findOrder });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.user;

    const orders = await Order.find({
      user_id: userId,
      permanentDeleted: false,
      softDelete: false,
    })
      .sort({ updatedAt: -1 })
      .populate("products.product_id");

    const customProductOrders = await CustomProductOrderModel.find({
      createdBy: userId,
      permanentDeleted: false,
      softDelete: false,
    })
      .sort({ updatedAt: -1 })
      .populate("customProduct.customProductId");

    const filteredCustomProductOrders = customProductOrders.filter(
      (customProductOrder) => {
        return !orders.some(
          (order) => order.orderId === customProductOrder.customOrderCode
        );
      }
    );
    return res.status(200).json({
      success: true,
      orders,
      customProductOrders: filteredCustomProductOrders,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

///////////////////////////////////////////////////////////////////////
//////////////////////////// Admin Function  //////////////////////////
///////////////////////////////////////////////////////////////////////

// exports.getAllOrders = async (req, res) => {
//   try {
//     if (req.role !== "admin") {
//       return res
//         .status(403)
//         .json({ error: "You are not authorized to view this page" });
//     }

//     const orders = await Order.find({
//       softDelete: { $ne: true },
//       permanentDeleted: false,
//     })
//       .sort({ createdAt: -1 })
//       .populate({
//         path: "user_id",
//         select:
//           "-password -forgotPasswordOtp -resetPasswordToken -setNewPwd -verified -softDeleted -forgotPasswordOtpExpire -resetPasswordTokenExpire ",
//       })
//       .populate("products.product_id");

//     return res.status(200).json({ success: true, data: orders });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };

exports.getAllOrders = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this page" });
    }

    // const customOrders = await CustomDesignModel.find({
    //   permanentDelete: false,
    // });
    const orders = await Order.find({
      softDelete: { $ne: true },
      permanentDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user_id",
        select:
          "-password -forgotPasswordOtp -resetPasswordToken -setNewPwd -verified -softDeleted -forgotPasswordOtpExpire -resetPasswordTokenExpire",
      })
      .populate({
        path: "products.product_id",
      });

    const vendorOrders = await Promise.all(
      orders.map(async (order) => {
        const productPromises = order.products.map(async (product) => {
          const vendorOrder = await VendorOrders.findOne({
            order: order._id,
            "products.product_id": product.product_id,
            "products.assignedVendor": product.product_id,
            softDelete: { $ne: true },
          }).populate("vendor");

          const combinedProduct = {
            product_id: product.product_id,
            orderId: product.orderId,
            qusantity: product.quantity,
            new_price: product.new_price,
            old_price: product.old_price,
            discount: product.discount,
            assigned: product.assigned,
            assignedVendor: !product?.assignedVendor
              ? ""
              : product?.assignedVendor,
          };
          return combinedProduct;
        });

        const productsWithVendors = await Promise.all(productPromises);

        const combinedOrder = {
          _id: order._id,
          name: order.name,
          phone: order.phone,
          user_id: order.user_id,
          delivery_address: order.delivery_address,
          sub_total: order.sub_total,
          total_shipping_fee: order.total_shipping_fee,
          all_totals: order.all_totals,
          products: productsWithVendors,
          customProduct: !order.customProduct ? [] : order.customProduct,
          payment_method: order.payment_method,
          orderId: order.orderId,
          softDelete: order.softDelete,
          completeAsign: order.completeAsign,
          status: order.status,
          permanentDeleted: order.permanentDeleted,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          assignedVendor:
            !productsWithVendors ||
            productsWithVendors.length === 0 ||
            productsWithVendors[0].assignedVendor
              ? ""
              : productsWithVendors[0].assignedVendor,
        };
        return combinedOrder;
      })
    );

    return res.status(200).json({ success: true, data: vendorOrders });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getPendingOrders = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this page" });
    }

    const orders = await Order.find({
      softDelete: { $ne: true },
      status: "Pending",
      permanentDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user_id",
        select:
          "-password -forgotPasswordOtp -resetPasswordToken -setNewPwd -verified -softDeleted -forgotPasswordOtpExpire -resetPasswordTokenExpire ",
      })
      .populate("products.product_id");

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getDeliveredOrders = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this page" });
    }

    const orders = await Order.find({
      softDelete: { $ne: true },
      status: "Deliver",
      permanentDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user_id",
        select:
          "-password -forgotPasswordOtp -resetPasswordToken -setNewPwd -verified -softDeleted -forgotPasswordOtpExpire -resetPasswordTokenExpire ",
      })
      .populate("products.product_id");

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getCompletedOrders = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this page" });
    }

    const orders = await Order.find({
      softDelete: { $ne: true },
      status: "Completed",
      permanentDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user_id",
        select:
          "-password -forgotPasswordOtp -resetPasswordToken -setNewPwd -verified -softDeleted -forgotPasswordOtpExpire -resetPasswordTokenExpire ",
      })
      .populate("products.product_id");

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getCancelledOrders = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this page" });
    }

    const orders = await Order.find({
      softDelete: { $ne: true },
      status: "Cancelled",
      permanentDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user_id",
        select:
          "-password -forgotPasswordOtp -resetPasswordToken -setNewPwd -verified -softDeleted -forgotPasswordOtpExpire -resetPasswordTokenExpire ",
      })
      .populate("products.product_id");

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getConfirmedOrders = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this page" });
    }

    const orders = await Order.find({
      softDelete: { $ne: true },
      status: "Confirm",
      permanentDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user_id",
        select:
          "-password -forgotPasswordOtp -resetPasswordToken -setNewPwd -verified -softDeleted -forgotPasswordOtpExpire -resetPasswordTokenExpire ",
      })
      .populate("products.product_id");

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this page" });
    }
    const { orderId } = req.params;
    const { status } = req.body;
    // console.log(status, orderId);
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const order = await Order.findById(orderId).populate("user_id");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This order is already cancelled",
      });
    }
    if (status === "Confirm") {
      const { total_shipping_fee } = req.body;
      console.log("total_shipping_fee:", total_shipping_fee);
      if (!total_shipping_fee) {
        return res
          .status(400)
          .json({ success: false, message: "Please Enter Shipping Fee" });
      }
      const all_totals = order.sub_total + parseInt(total_shipping_fee);
      console.log("order.sub_total:", order.sub_total);
      console.log("total_shipping_fee:", total_shipping_fee);
      console.log("all_totals:", all_totals);

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          total_shipping_fee,
          all_totals,
          status,
        },
        { new: true }
      );

      const orderConfirmation = orderConfirm(
        order.name,
        order.delivery_address,
        total_shipping_fee,
        order.sub_total,
        all_totals
      );

      sendEmail({
        to: order.user_id.email,
        subject: "Order Placed!",
        html: orderConfirmation,
      });

      return res.status(200).json({ success: true, data: updatedOrder });
    }
    if (order.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "This order is already Completed",
      });
    }
    await Order.findOneAndUpdate({ _id: orderId }, { status });

    const updateOrderTemplate = updateOrderStatus(
      order._id,
      order.user_id.first_name,
      status
    );

    sendEmail({
      to: order.user_id.email,
      subject: "Order Status Change",
      html: updateOrderTemplate,
    });

    order.user_id.fcm_token.forEach((token) => {
      sendNotification({
        to: token,
        notification: {
          title: "PakPrintwishes",
          body: `Order Status Changed to ${status}`,
        },
      });
    });

    const notification = await Notification.create({
      reciever: order.user_id,
      title: "Order Status Changed.",
      body: `Order Status Changed to ${status}`,
      type: "order",
    });

    return res
      .status(200)
      .json({ success: true, message: "Successfully updated status" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllSoftDeletedOrder = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this page" });
    }

    const orders = await Order.find({
      softDelete: true,
      permanentDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user_id",
        select:
          "-password -forgotPasswordOtp -resetPasswordToken -setNewPwd -verified -softDeleted -forgotPasswordOtpExpire -resetPasswordTokenExpire -role",
      })
      .populate("products.product_id");

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.softDeleteByUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const { orderId } = req.params;
    const softDelete = await Order.findOneAndUpdate(
      { _id: orderId, user_id: userId, status: "Completed" },
      { softDelete: true }
    );

    if (!softDelete) {
      return res
        .status(400)
        .json({ success: false, message: "You Can Not Delete This Order!" });
    }

    // await VendorOrders.updateMany({ order: orderId }, { softDelete: true });

    return res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.allSoftDeleteByUser = async (req, res) => {
  try {
    const { userId } = req.user;
    // const { orderId } = req.params;
    const softDelete = await Order.updateMany(
      { user_id: userId, status: "Completed" },
      { softDelete: true }
    );

    if (!softDelete) {
      return res
        .status(400)
        .json({ success: false, message: "You Can Not Delete This Order!" });
    }

    // await VendorOrders.updateMany({ order: orderId }, { softDelete: true });

    return res
      .status(200)
      .json({ success: true, message: "Orders deleted successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.softDelete = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this page" });
    }

    const { orderId } = req.params;

    await Order.findOneAndUpdate({ _id: orderId }, { softDelete: true });

    // await VendorOrders.updateMany({ order: orderId }, { softDelete: true });

    return res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.restoreSoftDeleted = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this page" });
    }

    const { orderId } = req.params;

    await Order.findOneAndUpdate({ _id: orderId }, { softDelete: false });

    // await VendorOrders.updateMany({ order: orderId }, { softDelete: false });

    return res
      .status(200)
      .json({ success: true, message: "Order restore successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.MultipleSoftDelete = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this page" });
    }
    const { ids } = req.body;

    await Order.updateMany({ _id: { $in: ids } }, { softDelete: true });

    // await VendorOrders.updateMany(
    //   { order: { $in: ids } },
    //   { softDelete: true }
    // );

    return res
      .status(200)
      .json({ success: true, message: "Orders deleted successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.permanentDelete = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this page" });
    }
    const { orderId } = req.params;
    await Order.findOneAndUpdate({ _id: orderId }, { permanentDeleted: true });

    // await VendorOrders.deleteMany({ order: orderId });

    return res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.permanentMultipleDelete = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this page" });
    }
    const { ids } = req.body;
    await Order.updateMany(
      { _id: { $in: ids } },
      { $set: { permanentDeleted: true } }
    );

    // await VendorOrders.deleteMany({ order: { $in: ids } });

    const remaining = await Order.find({
      softDelete: true,
      permanentDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user_id",
        select:
          "-password -forgotPasswordOtp -resetPasswordToken -setNewPwd -verified -softDeleted -forgotPasswordOtpExpire -resetPasswordTokenExpire -role",
      })
      .populate("products.product_id");
    return res.status(200).json({
      success: true,
      message: "Orders deleted successfully",
      data: remaining,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.changeStatusByUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const { orderId } = req.params;
    const { status } = req.body;
    // console.log(status, orderId);
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const order = await Order.findById(orderId).populate("user_id");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    // console.log(order.user_id._id);
    // console.log(userId);
    if (!order.user_id.equals(userId)) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to change status of this order",
      });
    }
    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This order is already cancelled",
      });
    }
    if (order.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "This order is already Completed",
      });
    }
    await Order.findOneAndUpdate({ _id: orderId }, { status });

    const updateOrderTemplate = updateOrderStatus(
      order._id,
      order.user_id.first_name,
      status
    );

    sendEmail({
      to: order.user_id.email,
      subject: "Order Status Change",
      html: updateOrderTemplate,
    });

    order.user_id.fcm_token.forEach((token) => {
      sendNotification({
        to: token,
        notification: {
          title: "PakPrintwishes",
          body: `Order Status Changed to ${status}`,
        },
      });
    });

    const notification = await Notification.create({
      reciever: order.user_id,
      title: "Order Status Changed.",
      body: `Order Status Changed to ${status}`,
      type: "order",
    });

    return res
      .status(200)
      .json({ success: true, message: "Your Order is Cancelled!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
