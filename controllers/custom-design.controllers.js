const CustomDesignFileModel = require("../models/custom-design-file.model");
const CustomDesignModel = require("../models/custom-design.model");
const InquiryFormModel = require("../models/inquiry-form.model");

/**
 * create custom design
 */
exports.createCustomDesign = async (req, res) => {
  try {
    const { userId } = req.user;
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    // check images are set or not
    if (req.files.length !== 0) {
      // Custom Parent Category Ids Check --- start
      console.log("type: ", typeof customParentCategoryIds);
      if (!req.body.customParentCategoryIds) {
        console.log("Custom parent category must be provided");
        return res.status(400).json({
          success: false,
          message: "Custom parent category must be provided",
        });
      }
      //  --- end

      // product titles Check --- start
      if (!req.body.titles) {
        console.log("titles must be provided");
        return res.status(400).json({
          success: false,
          message: "titles must be provided",
        });
      }
      //  --- end

      // custom fields checks --- start
      let filteredCustomFields = {};
      const { customFields } = req.body;

      for (let key in req.body.customFields) {
        if (req.body.customFields[key].status == "true") {
          let fieldsData = req.body.customFields[key].fields;

          // Check if any titles are empty in the fields array
          if (fieldsData.some((field) => field.title === "")) {
            console.log(`Empty titles found in fields for - ${key}`);
            return res.status(400).json({
              success: false,
              message: `Empty titles found in fields for - ${key}`,
            });
          } else {
            // Proceed with storing data in the database or whatever is needed
            filteredCustomFields[key] = req.body.customFields[key];
          }
        }
      }

      // Convert status to boolean for specific fields
      convertStatusToBoolean(filteredCustomFields);
      // custom fields checks --- end

      // string fields checks --- start
      const { stringFields } = req.body;
      console.log("stringFields", stringFields.description);
      let filteredStringFields = {};
      for (let key in stringFields) {
        stringFields[key];
        if (
          stringFields[key].status == "true" &&
          (stringFields[key].value = stringFields[key].value.trim())
        ) {
          filteredStringFields[key] = stringFields[key];
        } else if (
          stringFields[key].status == "true" &&
          !(stringFields[key].value = stringFields[key].value.trim())
        ) {
          console.log(`Empty value property found in - ${key}`);
          return res.status(400).json({
            success: false,
            message: `Empty value property found in - ${key}`,
          });
        }
      }

      /**
       * Object Fields Working
       */
      let filteredObjectFields = {};
      const { objectFields } = req.body;

      for (let key in objectFields) {
        if (objectFields[key].status == "true") {
          filteredObjectFields[key] = objectFields[key];
        }
      }

      convertStatusToBoolean(filteredObjectFields);
      /**
       * Images Working
       */
      const images = req.files.map((image) =>
        image?.location?.replace(/.*\/uploads/, "/uploads")
      );

      const newCustomProduct = await CustomDesignModel.create({
        ...req.body,
        customFields: filteredCustomFields,
        stringFields: filteredStringFields,
        objectFields: filteredObjectFields,
        images,
        createdBy: userId,
      });
      console.log("Custom product added successfully.");
      return res.status(200).json({
        success: true,
        message: "Custom product added successfully.",
        data: newCustomProduct,
      });
    } else {
      console.log("Product images/image must be provided");
      return res.status(400).json({
        success: false,
        message: "Product images/image must be provided",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * auth api get all custom designs
 */
exports.authApiGetAllCustomDesigns = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    const allCustomDesigns = await CustomDesignModel.find({
      permanentDeleted: false,
    })
      .populate("customParentCategoryIds", "_id title")
      .populate("customChildCategoryIds", "_id, title");
    // .select("customParentCategoryIds customChildCategoryIds");

    if (!allCustomDesigns || allCustomDesigns.length === 0) {
      console.log("Custom designs list is empty");
      return res.status(200).json({
        success: true,
        data: allCustomDesigns,
      });
    }
    //
    return res.status(200).json({
      success: true,
      data: allCustomDesigns,
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
 * auth api get custom design by id
 */
exports.authApiGetCustomDesignById = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    const customDesign = await CustomDesignModel.findOne({
      _id: req.params.id,
      permanentDeleted: false,
    })
      .populate("customParentCategoryIds", "_id title")
      .populate("customChildCategoryIds", "_id, title");

    if (!customDesign) {
      console.log("Invalid id");
      return res.status(400).json({
        success: false,
        data: customDesign,
      });
    }

    return res.status(200).json({
      success: true,
      data: customDesign,
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
 * public api get all custom designs
 */
exports.publicApiGetAllCustomDesigns = async (req, res) => {
  try {
    const allCustomDesigns = await CustomDesignModel.find({
      permanentDeleted: false,
      status: true,
    })
      .populate("customParentCategoryIds", "_id title")
      .populate("customChildCategoryIds", "_id, title")
      .select(
        "_id images prices titles customParentCategoryIds customChildCategoryIds"
      );

    if (!allCustomDesigns || allCustomDesigns.length === 0) {
      console.log("Custom designs list is empty");
      return res.status(200).json({
        success: true,
        data: allCustomDesigns,
      });
    }

    return res.status(200).json({
      success: true,
      data: allCustomDesigns,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * public api get custom designs by parent id
 */
exports.publicApiGetCustomDesignsByCustomParentId = async (req, res) => {
  try {
    const { customParentCategoryId } = req.params;
    console.log(typeof customParentCategoryId);
    const allCustomDesigns = await CustomDesignModel.find({
      customParentCategoryIds: { $in: [customParentCategoryId] },
      permanentDeleted: false,
      status: true,
    })
      .populate("customParentCategoryIds", "_id title")
      .populate("customChildCategoryIds", "_id title")
      .select(
        "_id images prices titles customParentCategoryIds customChildCategoryIds"
      );

    if (!allCustomDesigns || allCustomDesigns.length === 0) {
      console.log("Custom designs list is empty");
      return res.status(200).json({
        success: true,
        data: allCustomDesigns,
      });
    }

    return res.status(200).json({
      success: true,
      data: allCustomDesigns,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * public api get custom designs by child id
 */
exports.publicApiGetCustomDesignsByCustomChildId = async (req, res) => {
  try {
    const { customChildCategoryId } = req.params;
    const allCustomDesigns = await CustomDesignModel.find({
      customChildCategoryIds: { $in: [customChildCategoryId] },
      permanentDeleted: false,
      status: true,
    })
      .populate("customParentCategoryIds", "_id title")
      .populate("customChildCategoryIds", "_id title")
      .select(
        "_id images prices titles customParentCategoryIds customChildCategoryIds"
      );

    if (!allCustomDesigns || allCustomDesigns.length === 0) {
      console.log("Custom designs list is empty");
      return res.status(200).json({
        success: true,
        data: allCustomDesigns,
      });
    }

    return res.status(200).json({
      success: true,
      data: allCustomDesigns,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * public api get custom designs by product id
 */
exports.publicApiGetCustomDesignsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log("productId: ", productId);
    const allCustomDesigns = await CustomDesignModel.find({
      _id: productId,
      permanentDeleted: false,
      status: true,
    })
      .populate("customParentCategoryIds", "_id title")
      .populate("customChildCategoryIds", "_id title");

    if (!allCustomDesigns || allCustomDesigns.length === 0) {
      console.log("Custom designs list is empty");
      return res.status(200).json({
        success: true,
        data: allCustomDesigns,
      });
    }

    return res.status(200).json({
      success: true,
      data: allCustomDesigns,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * change status of custom product
 */
exports.changeCustomDesignStatus = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { customDesignId } = req.params;

    const customDesign = await CustomDesignModel.findById(customDesignId);

    if (!customDesign) {
      console.log("Invalid custom design id");
      return res.status(400).json({
        success: false,
        message: "Invalid custom design id",
      });
    }

    if (customDesign.permanentDeleted === true) {
      console.log(
        "Can't able change status becasue this custom design is delted"
      );
      return res.status(400).json({
        success: false,
        message:
          "Can't able change status becasue this custom design is delted",
      });
    }

    let customDesignStatus;

    if (customDesign.status === true) {
      customDesignStatus = false;
    } else {
      customDesignStatus = true;
    }

    await CustomDesignModel.findByIdAndUpdate(customDesignId, {
      status: customDesignStatus,
    });

    console.log("Custom design status update successfully.");
    return res.status(200).json({
      success: true,
      message: "Custom design status update successfully.",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * delete custom design
 */
exports.deleteCustomDesign = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { customDesignId } = req.params;

    const customDesign = await CustomDesignModel.findById(customDesignId);

    if (!customDesign) {
      console.log("Invalid custom design id");
      return res.status(400).json({
        success: false,
        message: "Invalid custom design id",
      });
    }

    if (customDesign.permanentDeleted === true) {
      console.log("Custom design already has been deleted");
      return res.status(400).json({
        success: false,
        message: "Custom design already has been deleted",
      });
    }

    await CustomDesignModel.findByIdAndUpdate(customDesignId, {
      permanentDeleted: true,
    });

    console.log("Custom design deleted successfully.");
    return res.status(200).json({
      success: true,
      message: "Custom design deleted successfully.",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * update custom design
 */
exports.updateCustomDesign = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { customDesignId } = req.params;

    const customDesign = await CustomDesignModel.findById(customDesignId);

    if (!customDesign) {
      console.log("Invalid custom design id");
      return res.status(400).json({
        success: false,
        message: "Invalid custom design id",
      });
    }

    if (customDesign.permanentDeleted === true) {
      console.log("Custom design already has been deleted");
      return res.status(400).json({
        success: false,
        message: "Custom design already has been deleted",
      });
    }

    const updateFields = {};

    if (req.body.customParentCategoryIds) {
      updateFields.customParentCategoryIds = req.body.customParentCategoryIds;
    } else {
      updateFields.customParentCategoryIds =
        customDesign.customParentCategoryIds;
    }

    if (req.body.customChildCategoryIds) {
      updateFields.customChildCategoryIds = req.body.customChildCategoryIds;
    } else {
      updateFields.customChildCategoryIds = customDesign.customChildCategoryIds;
    }

    if (req.files.length !== 0) {
      const images = req.files.map((image) =>
        image?.location?.replace(/.*\/uploads/, "/uploads")
      );
      updateFields.images = images;
    } else {
      updateFields.images = customDesign.images;
    }

    if (req.body.titles) {
      updateFields.titles = req.body.titles;
    } else {
      updateFields.titles = customDesign.titles;
    }

    if (req.body.customChildCategoryIds) {
      updateFields.customChildCategoryIds = req.body.customChildCategoryIds;
    } else {
      updateFields.customChildCategoryIds = customDesign.customChildCategoryIds;
    }

    if (req.body.customFields) {
      let filteredCustomFields = {};
      const { customFields } = req.body;

      for (let key in customFields) {
        if (customFields[key].status === "true") {
          let fieldsData = customFields[key].fields;

          // Check if any titles is empty in the fields array
          if (fieldsData.some((field) => field.titles === "")) {
            console.log(`Empty titles found in fields for - ${key}`);
            return res.status(400).json({
              success: false,
              message: `Empty titles found in fields for - ${key}`,
            });
          } else {
            filteredCustomFields[key] = customFields[key];
          }
        }
      }
      convertStatusToBoolean(filteredCustomFields);
      updateFields.customFields = filteredCustomFields;
    } else {
      updateFields.customFields = customDesign.customFields;
    }

    if (req.body.stringFields) {
      let filteredStringFields = {};
      const { stringFields } = req.body;

      for (let key in stringFields) {
        if (
          stringFields[key].status === "true" &&
          (stringFields[key].value = stringFields[key].value.trim())
        ) {
          filteredStringFields[key] = stringFields[key];
        } else if (
          stringFields[key].status === "true" &&
          !(stringFields[key].value = stringFields[key].value.trim())
        ) {
          console.log(`Empty value property found in - ${key}`);
          return res.status(400).json({
            success: false,
            message: `Empty value property found in - ${key}`,
          });
        }
      }
      updateFields.stringFields = filteredStringFields;
    } else {
      updateFields.stringFields = customDesign.stringFields;
    }

    if (req.body.objectFields) {
      let filteredObjectFields = {};
      const { objectFields } = req.body;

      for (let key in objectFields) {
        if (objectFields[key].status == "true") {
          filteredObjectFields[key] = objectFields[key];
        }
      }

      convertStatusToBoolean(filteredObjectFields);
      updateFields.objectFields = filteredObjectFields;
    } else {
      updateFields.objectFields = customDesign.objectFields;
    }

    if (req.body.sku) {
      updateFields.sku = req.body.sku;
    } else {
      updateFields.sku = customDesign.sku;
    }

    if (req.body.booleanFields) {
      updateFields.booleanFields = req.body.booleanFields;
    } else {
      updateFields.booleanFields = customDesign.booleanFields;
    }

    if (req.body.prices) {
      updateFields.prices = req.body.prices;
    } else {
      updateFields.prices = customDesign.prices;
    }
    console.log("==> updateFields: ", updateFields);
    await CustomDesignModel.findByIdAndUpdate(customDesignId, updateFields);
    return res.status(200).json({
      success: true,
      message: "Custom design updated successfully",
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
 * Upload Image
 */
exports.uploadCustomDesignFile = async (req, res) => {
  try {
    if (req.file) {
      const file = req?.file?.location?.replace(/.*\/uploads/, "/uploads");
      const newCustomDesignFile = await CustomDesignFileModel.create({ file });
      console.log("Custom design file added successfully");
      return res.status(200).json({
        success: true,
        message: "Custom design file added successfully",
        data: newCustomDesignFile,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Custom design file required",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Function to recursively convert status to boolean for specific fields
function convertStatusToBoolean(obj) {
  if (typeof obj !== "object" || obj === null) {
    return; // If obj is not an object, return
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === "object" && value !== null) {
        convertStatusToBoolean(value); // Recursively call for nested objects
      } else if (key === "status") {
        obj[key] = value === "true"; // Convert status to boolean
      }
    }
  }
}
