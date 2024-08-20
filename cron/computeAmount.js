const { CronJob } = require("cron");
const VendorOrder = require("../models/vendorOrder");
const User = require("../models/user");
const Wallet = require("../models/wallet");

const computeAmountJob = new CronJob({
  // cronTime: "*/15 * * * * *", // every 15 seconds
  cronTime: "0 10 * * 6", // every saturday 10:00 AM
  onTick: async () => {
    try {
      const currentDate = new Date();
      const sevenDaysAgo = new Date(
        currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
      );

      // Get the vendors
      const vendors = await User.find({ role: "vendor" });

      // console.log("vendors", vendors.length);

      const vendorAmounts = await Promise.all(
        vendors.map(async (vendor) => {
          const vendorOrders = await VendorOrder.find({
            $and: [
              { vendor: { $eq: vendor._id } },
              { status: { $eq: "Completed" } },
              { updatedAt: { $lt: currentDate } },
              { updatedAt: { $gte: sevenDaysAgo } },
              { paid: { $ne: true } },
            ],
          });
          // console.log("vendor order", vendorOrders);
          const totalAmount = vendorOrders.reduce((acc, order) => {
            return (
              acc +
              order.products.reduce((accumulator, product) => {
                return accumulator + product.quantity * product.new_price;
              }, 0)
            );
          }, 0);

          const wallet = await Wallet.findOne({ vendor: vendor._id });
          const oldRemainingAmount = wallet.remainingBalance;
          const newTotalAmount = oldRemainingAmount + totalAmount;

          await Wallet.findOneAndUpdate(
            { _id: wallet._id },
            { currentBalance: totalAmount, total: newTotalAmount }
          );

          const orderIds = vendorOrders.map((order) => order._id);
          console.log(orderIds);
          await VendorOrder.updateMany(
            { _id: { $in: orderIds } },
            { paid: true }
          );
        })
      );
    } catch (error) {
      console.log(error);
    }
  },
  start: false,
});

module.exports = computeAmountJob;
