import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken?: string;
  accessToken?: string;
  _id: mongoose.Types.ObjectId;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  isPasswodCorrect: (password: string) => boolean;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
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
    avatar: {
      type: String, //URL
      required: true,
    },
    refreshToken: {
      type: String,
    },
    accessToken: {
      type: String,
    },
  },
  {
    timestamps: true, // will auto added create date and update date
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } catch (err) {
      next();
    }
  } else {
    next();
  }
});

userSchema.methods.isPasswodCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    "shhhhh", //TODO: .env
    { expiresIn: "1h" } //TODO: .env
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    "shhhhh", //TODO: .env
    { expiresIn: "1d" } //TODO: .env
  );
};

export const User = mongoose.model<IUser>("User", userSchema);
