const VendorOrder = require("../models/vendorOrder");
const paymentHistory = require("../models/paymentHistory");
const User = require("../models/user");
const Order = require("../models/order");
// const paymentHistory = require("../models/paymentHistory");

// exports.payment = async (req, res) => {
//   try {
//     const { vendorId } = req.params;
//     const { ids } = req.body;

//     const find = await VendorOrder.find({
//       _id: { $in: ids },
//       vendor: vendorId,
//       status: "Approved",
//       paid: false,
//     });

//     if (!find) {
//       return res.status(400).json({
//         success: false,
//         message: "No Payments Pending For This Vendor",
//       });
//     }

//     const { TID } = req.body;
//     if (!TID) {
//       return res.status(400).json({
//         success: false,
//         message: "Please Provide Transaction ID",
//       });
//     }
//     const { payPrice } = req.body;
//     if (!payPrice) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Add Price" });
//     }
//     const totalNewPrice = find.reduce(async (totalPromise, vendorOrder) => {
//       const order = await Order.findById(vendorOrder.order);

//       if (!order) {
//         throw new Error(
//           `Order not found for vendor order with ID ${vendorOrder._id}`
//         );
//       }

//       return totalPromise + order.sub_total;
//     }, 0);

//     if (payPrice > totalNewPrice) {
//       return res.status(400).json({
//         success: false,
//         message: "You are paying more then actual price",
//       });
//     }

//     const user = await User.findById(vendorId);
//     const payPriceNumber = parseInt(payPrice, 10);

//     if (isNaN(payPriceNumber)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid payPrice. Please provide a valid number.",
//       });
//     }

//     const paymentPending = user.paymentPending - payPriceNumber;
//     const paymentRecieved = user.paymentRecieved + payPriceNumber;

//     await User.findByIdAndUpdate(vendorId, {
//       paymentPending,
//       paymentRecieved,
//     });

//     await paymentHistory.create({
//       TID,
//       vendorId: find.vendor,
//       orderId: find._id,
//       payPrice,
//     });

//     const paidStatus = await VendorOrder.updateMany(
//       { _id: { $in: find.map((order) => order._id) } },
//       {
//         $set: {
//           paid: true,
//         },
//       }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Paid Successfully",
//     });
//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };
exports.payment = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { ids, TID } = req.body;

    const find = await VendorOrder.find({
      _id: { $in: ids },
      vendor: vendorId,
      status: "Approved",
      paid: false,
    });

    if (!find || find.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Payments Pending For This Vendor",
      });
    }

    const totalNewPrice = await Promise.all(
      find.map(async (vendorOrder) => {
        const order = await Order.findById(vendorOrder.order);

        if (!order) {
          throw new Error(
            `Order not found for vendor order with ID ${vendorOrder._id}`
          );
        }

        return order.sub_total;
      })
    );

    const payPrice = totalNewPrice.reduce((total, price) => total + price, 0);

    const user = await User.findById(vendorId);
    // const payPriceNumber = parseInt(payPrice, 10);

    // if (isNaN(payPriceNumber)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid payPrice. Please provide a valid number.",
    //   });
    // }

    const paymentPending = user.paymentPending - payPrice;
    if (paymentPending < 0) {
      return res.status(400).json({
        success: false,
        message: "You are paying more then the actual pending payment!",
      });
    }
    const paymentRecieved = user.paymentRecieved + payPrice;
    const paymentTotal = paymentPending + paymentRecieved;

    await User.findByIdAndUpdate(vendorId, {
      paymentPending,
      paymentRecieved,
    });

    await paymentHistory.create({
      TID,
      vendorId: find[0].vendor,
      orderId: find.map((order) => order._id),
      payPrice,
      paymentPending,
      paymentRecieved,
      paymentTotal,
    });

    const paidStatus = await VendorOrder.updateMany(
      { _id: { $in: find.map((order) => order._id) } },
      {
        $set: {
          paid: true,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Paid Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getApprovedOrders = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const find = await VendorOrder.find({
      vendor: vendorId,
      status: "Approved",
      paid: false,
    })
      .populate("order")
      .sort({ updatedAt: -1 });

    if (!find) {
      return res.status(400).json({
        success: false,
        message: "No Payments Pending For This Vendor",
      });
    }
    // if (req.query.amount === "pending") {
    //   const paymentPending = user.paymentPending;
    //   return res.status(200).json({ success: true, data: paymentPending });
    // } else if (req.query.amount === "recieved") {
    //   const paymentRecieved = user.paymentRecieved;
    //   return res.status(200).json({ success: true, data: paymentRecieved });
    // }
    return res.status(200).json({ success: true, data: find });
    // return res.status(200).json({ success: true, Earning: totalPayment });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const getHistory = await paymentHistory
      .find({ vendorId: userId })
      .populate({ path: "orderId", populate: { path: "order" } })
      .sort({ updatedAt: -1 });
    if (!getHistory) {
      return res
        .status(400)
        .json({ success: false, message: "No Payments Yet!" });
    }
    return res.status(200).json({ success: true, data: getHistory });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
