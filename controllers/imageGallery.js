const ImageGallery = require("../models/imageGallery");
const path = require("path");

const parent_category = require("../models/parent_category");

exports.addImgInGlry = async (req, res) => {
  try {
    const { userId } = req.user;
    const { folderId } = req.body;

    if (!folderId) {
      return res
        .status(400)
        .json({ success: false, message: "Select a Folder" });
    }

    if (!req.files) {
      return res
        .status(400)
        .json({ success: false, message: "Upload An Image" });
    }

    req.files.map(async (file) => {
      const relativePath = file.location.replace(/.*\/uploads/, "/uploads");

      const newGallery = await ImageGallery.create({
        imgUrl: relativePath,
        createdBy: userId,
        folderId,
      });

      console.log(file);
      console.log(newGallery.imgUrl);
    });

    return res.status(200).json({ success: true, message: "Images Added" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getImag = async (req, res) => {
  try {
    const { userId } = req.user;
    const { folderId } = req.params;
    console.log("userIddddddddddddddd: ", userId);
    console.log("folderIddddddddddddd: ", folderId);
    if (!folderId) {
      return res
        .status(200)
        .json({ success: false, message: "You did not Select the folder" });
    }

    console.log("rolllllllllllllllll: ", req.role);
    if (req.role === "admin") {
      const data = await ImageGallery.find({
        isDeletedBy: false,
        folderId,
      });

      console.log("dataaaaaaaaaaaaaaaaaa: ", data);

      return res.status(200).json({ success: true, data });
    }
    const data = await ImageGallery.find({
      folderId,
      softDelete: false,
      createdBy: userId,
    });
    console.log("RESPOnSE_____", data);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { userId } = req.user;

    const { imgId } = req.params;
    if (req.role === "vendor") {
      const deleteimg = await ImageGallery.findOneAndUpdate(
        { _id: imgId, createdBy: userId },
        { softDelete: true },
        { new: true }
      );
      return res
        .status(200)
        .json({ success: true, message: "Image Has Been Deleted" });
    }
    if (req.role === "admin") {
      const deleteimg = await ImageGallery.findOneAndUpdate(
        { _id: imgId },
        { softDelete: true, isDeletedBy: true },
        { new: true }
      );
      return res
        .status(200)
        .json({ success: true, message: "Image Has Been Deleted" });
    }
  } catch (error) {
    return res.status(40).json({ success: false, message: error.message });
  }
};

exports.getFolder = async (req, res) => {
  try {
    const folder = await parent_category.find({
      status: { $ne: false },
      permanentDeleted: false,
    });
    return res.status(StatusCodes.OK).json({ success: true, data: folder });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// exports.getImag = async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const { folderId, type } = req.body;
//     if (type === "access") {
//       const findFolder = await parent_category.findOne({ type });
//       if (findFolder) {
//         let params = {
//           softDelete: false,
//           folderId: findFolder._id,
//         };
//         if (req.role !== "admin") {
//           params.createdBy = userId;
//         }
//         const data = await ImageGallery.find(params);
//         return res.status(200).json({ success: true, data });
//       } else {
//         return res
//           .status(400)
//           .json({ success: true, message: "No accessory folder found." });
//       }
//     } else {
//       if (req.role === "admin") {
//         const data = await ImageGallery.find({
//           softDelete: false,
//           folderId,
//         });
//         return res.status(200).json({ success: true, data });
//       }
//     }
//     const data = await ImageGallery.find({
//       folderId,
//       softDelete: false,
//       createdBy: userId,
//     });
//     return res.status(200).json({ success: true, data });
//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };
