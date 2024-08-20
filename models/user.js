const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    name: String,
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    forgotPasswordOtp: { type: String },
    forgotPasswordOtpExpire: {
      type: Date,
      default: "",
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    resetPasswordTokenExpire: {
      type: Date,
      default: "",
    },
    address: String,
    country: String,
    state: String,
    city: String,
    user_type: {
      type: String,
    },
    companyName: String,
    bank_name: String,
    bank_account_number: String,
    cnic: String,
    image: String,
    header: String,
    role: {
      type: String,
      enum: ["admin", "user", "vendor", "freelancer"],
      default: "user",
    },
    isFreelancerVerified: {
      type: String,
      enum: ["pending", "approved", "rejected", ""],
      default: "",
    },
    isVendorVerified: {
      type: String,
      enum: ["pending", "approved", "rejected", ""],
      default: "",
    },
    OTPStatus: {
      type: String,
      enum: ["pending", "requested", "approved"],
      default: "pending",
    },

    paymentRecieved: {
      type: Number,
      default: 0,
    },
    paymentPending: {
      type: Number,
      default: 0,
    },

    // is_admin: Boolean,
    status: Boolean,
    setNewPwd: Boolean,
    verified: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    isSocialLogin: {
      type: Boolean,
      default: false,
    },
    profileImg: {
      type: String,
      default: null,
    },
    experience: {
      title: {
        type: String,
        trim: true,
        // required: true,
      },
      companyName: {
        type: String,
        trim: true,
        // required: true,
      },
      companyAddress: {
        type: String,
        trim: true,
        // required: true,
      },
      experienceLevel: {
        type: String,
        enum: ["Basic", "Intermediate", "Expert"],
      },

      experienceStartDate: {
        type: String,
        trim: true,
        // required: true,
      },
      experienceEndDate: {
        type: String,
        trim: true,
      },
      isCurrentStatus: {
        type: Boolean,
        default: false,
      },
    },

    softDeleted: {
      type: Boolean,
      default: false,
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
    fcm_token: [{ type: String, default: [] }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log(
    "__Candidate Password:",
    candidatePassword,
    "\n__Type of Candidate Password:",
    typeof candidatePassword
  );
  const isCorrect = await bcrypt.compare(candidatePassword, this.password);
  // console.log(candidatePassword, this.password);
  return isCorrect;
};
userSchema.methods.campareForgotPasswordOtp = async function (
  forgotPasswordOtp
) {
  const isMatch = await bcrypt.compare(
    forgotPasswordOtp,
    this.forgotPasswordOtp
  );
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
