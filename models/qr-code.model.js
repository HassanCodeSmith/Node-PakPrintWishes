const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema(
  {
    groomName: {
      type: String,
      require: true,
      trim: true,
    },
    brideName: {
      type: String,
      require: true,
      trim: true,
    },
    pdffile: {
      type: String,
      require: true,
      trim: true,
    },
    time: {
      type: String,
      require: true,
      trim: true,
    },
    dholki: {
      time: {
        type: String,
        require: true,
        trim: true,
      },
      date: {
        type: String,
        require: true,
        trim: true,
      },
      program: {
        gatheringTime: {
          type: String,
          require: true,
          trim: true,
        },
        dinnerTime: {
          type: String,
          require: true,
          trim: true,
        },
      },
    },
    wedding: {
      date: {
        type: String,
        require: true,
        trim: true,
      },
      program: {
        gatheringTime: {
          type: String,
          require: true,
          trim: true,
        },
        dinnerTime: {
          type: String,
          require: true,
          trim: true,
        },
      },
      venue: {
        type: String,
        require: true,
        trim: true,
      },
      mapLink: {
        type: String,
        require: true,
        trim: true,
      },
    },
    reception: {
      date: {
        type: String,
        require: true,
        trim: true,
      },
      program: {
        gatheringTime: {
          type: String,
          require: true,
          trim: true,
        },
        dinnerTime: {
          type: String,
          require: true,
          trim: true,
        },
      },
      venue: {
        type: String,
        require: true,
        trim: true,
      },
      mapLink: {
        type: String,
        require: true,
        trim: true,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const QRCode = mongoose.model("QRCode", qrCodeSchema);

module.exports = QRCode;
