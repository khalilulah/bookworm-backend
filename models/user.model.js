import mongoose, { Mongoose } from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "enter a name"],
      minLength: 2,
    },
    email: {
      type: String,
      required: [true, " enter an email"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "please fill avalid email address"],
    },
    password: {
      type: String,
      required: [true, "enter a password"],
      minLength: 6,
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("bookUser", userSchema);

export default User;
