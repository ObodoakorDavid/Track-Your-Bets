// models/User.ts
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { JwtPayload } from "jsonwebtoken";

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  googleId: string;
  avatar: string;
  comparePassword(password: string): Promise<boolean>;
  generateAuthToken(): Promise<string>;
  verifyAuthToken(token: string): Promise<JwtPayload>;
}

const UserSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
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
    googleId: {
      type: String,
      required: false,
      default: "",
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/demmgc49v/image/upload/v1695969739/default-avatar_scnpps.jpg",
    },
  },
  { timestamps: true }
);

// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password for login
UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// Generate a JWT token for the user
UserSchema.methods.generateAuthToken = async function () {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ email: this.email, id: this._id })
    .setExpirationTime("1h")
    .sign(secret);
  return token;
};

// Verify the JWT token
UserSchema.methods.verifyAuthToken = async function (token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.log(error);
    throw new Error("Invalid or expired token");
  }
};

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
