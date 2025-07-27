import mongoose from "mongoose";
import User from "./user.model.js";

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "set a title"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    caption: {
      type: String,
      required: [true, "provide a caption"],
    },
    image: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("book", bookSchema);

export default Book;
