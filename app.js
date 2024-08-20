"use-strict";
require("dotenv").config();

const express = require("express");
// const { upload } = require("./utils/upload");
const cron = require("node-cron");

const morgan = require("morgan");
const fs = require("fs");
const connectDB = require("./config/db.config");
const cors = require("cors");
require("express-async-errors");
const https = require("https");
const http = require("http");

const { Server } = require("socket.io");
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(upload.none());

const notFoundMiddleware = require("./middlewares/notFound");
//Routes
const Auth = require("./routes/auth");
const BrandRouter = require("./routes/brand");
const ParentCategory = require("./routes/parent_Cat");
const JobRouter = require("./routes/job");
const ProductRouter = require("./routes/product");
const UserRouter = require("./routes/user");
const subCategoryRouter = require("./routes/subCategory");
const sliderRoutes = require("./routes/slider");
const ServiceRouter = require("./routes/services");
const partnerRouter = require("./routes/partner");
const ApplyNowRouter = require("./routes/apply_now");
const GetQuoteRouter = require("./routes/get_quote");
const reviewRouter = require("./routes/review");
const orderRouter = require("./routes/order");
const FavtProduct = require("./routes/favt_product");
const contactRouter = require("./routes/contact_us");
const commentRouter = require("./routes/comment");
const vendorOrderRouter = require("./routes/vendorOrder");
const WalletRouter = require("./routes/wallet");
const walletHistoryRouter = require("./routes/walletHistory");
const notificationRouter = require("./routes/notification");
const ImageGallery = require("./routes/imageGallery");
const SeoRouter = require("./routes/forSeo");
const paymentRouter = require("./routes/payment");
const ParentCatSeoRouter = require("./routes/parentCategorySeo");
const ChildCatSeoRouter = require("./routes/childCategorySeo");
const AccessoriesRouter = require("./routes/accessories");
const customParentCategoryRouter = require("./routes/custom-parent-category.routes");
const customChildCategoryRouter = require("./routes/custom-child-category.routes");
const customParentSeoCategoryRouter = require("./routes/custom-parent-seo-category.routes");
const customChildSeoCategoryRouter = require("./routes/custom-child-seo-category.routes");
const customCategoriesNavigationBarRouter = require("./routes/custom-categrories-navigation-bar.routes");
const customDesignRouter = require("./routes/custom-design.routes");
const customDesignSeoRouter = require("./routes/custom-design-seo.routes");
const InquiryFormRouter = require("./routes/inquiry-form.routes");
const blogRouter = require("./routes/blog.routes");
const customProductOrderRouter = require("./routes/order-custom-product.routes");
const vendorCustomOrderRouter = require("./routes/vendor-custom-order.routes");
const jobProviderAndConsumerRouter = require("./routes/job_provider_and_consumer.routes");
const freelancingJobRouter = require("./routes/freelancing-job.routes");
const qrCodeRouter = require("./routes/qr-code.routes");

// Cron jobs
const computeAmountJob = require("./cron/computeAmount");
const backupJob = require("./cron/backupJob");
const uploadToS3 = require("./utils/backupUpload");

app.get("/", (req, res) => {
  res.send(
    "<h1 style='display: flex; justify-content: center;  align-items: center; height: 200px'>Hello </h1>"
  );
});

//Points
app.use("/api/v2", Auth);
app.use("/api/v2", ParentCategory);
app.use("/api/v2", BrandRouter);
app.use("/api/v2", JobRouter);
app.use("/api/v2", ProductRouter);
app.use("/api/v2", UserRouter);
app.use("/api/v2", subCategoryRouter);
app.use("/api/v2", sliderRoutes);
app.use("/api/v2", ServiceRouter);
app.use("/api/v2", partnerRouter);
app.use("/api/v2", ApplyNowRouter);
app.use("/api/v2", GetQuoteRouter);
app.use("/api/v2", reviewRouter);
app.use("/api/v2", orderRouter);
app.use("/api/v2", FavtProduct);
app.use("/api/v2", contactRouter);
app.use("/api/v2", commentRouter);
app.use("/api/v2", vendorOrderRouter);
app.use("/api/v2", WalletRouter);
app.use("/api/v2", walletHistoryRouter);
app.use("/api/v2", notificationRouter);
app.use("/api/v2", ImageGallery);
app.use("/api/v2", SeoRouter);
app.use("/api/v2", paymentRouter);
app.use("/api/v2", ParentCatSeoRouter);
app.use("/api/v2", ChildCatSeoRouter);
app.use("/api/v2", AccessoriesRouter);
app.use("/api/v2", customParentCategoryRouter);
app.use("/api/v2", customChildCategoryRouter);
app.use("/api/v2", customParentSeoCategoryRouter);
app.use("/api/v2", customChildSeoCategoryRouter);
app.use("/api/v2", customCategoriesNavigationBarRouter);
app.use("/api/v2", customDesignRouter);
app.use("/api/v2", customDesignSeoRouter);
app.use("/api/v2", InquiryFormRouter);
app.use("/api/v2", blogRouter);
app.use("/api/v2", customProductOrderRouter);
app.use("/api/v2", vendorCustomOrderRouter);
app.use("/api/v2/jobPortal", jobProviderAndConsumerRouter);
app.use("/api/v2/freelaningJob", freelancingJobRouter);
app.use("/api/v2/qrCode", qrCodeRouter);

app.use((req, res, next) => {
  res.header("X-Robots-Tag", "noindex, nofollow");
  next();
});

app.use(notFoundMiddleware);

let server = app;

if (process.env.NODE_ENV === "production") {
  const options = {
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/pakprintwishes.com/fullchain.pem"
    ),
    key: fs.readFileSync(
      "/etc/letsencrypt/live/pakprintwishes.com/privkey.pem"
    ),
    rejectUnauthorized: false,
  };
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const setupSocket = require("./socket");

setupSocket(server);

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    const connectionInstance = await connectDB(process.env.DB_Url);
    console.log(
      `DB Connected || DB Host ${connectionInstance.connection.host}`
    );

    server.listen(PORT, function () {
      console.log("Server listening on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
computeAmountJob.start();
backupJob.start();
cron.schedule("15 0 * * *", () => {
  console.log("Cron job started at", new Date().toISOString());
  uploadToS3
    .uploadImagesToS3()
    .then(() => console.log("Cron job completed successfully"))
    .catch((error) => console.error("Cron job failed:", error));
});
