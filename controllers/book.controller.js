import Book from "../models/book.model.js";
import cloudinary from "../lib/cloud.js";

export const createBook = async (req, res) => {
  try {
    const { title, rating, caption, image } = req.body;
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ message: "not a valid user" });
    }

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "enter title" });
    }

    if (!caption || caption.trim() === "") {
      return res.status(400).json({ message: "enter caption" });
    }

    // upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    const newBook = new Book({
      title,
      rating,
      caption,
      image,
      user: userId,
    });

    await newBook.save();

    res.status(201).json({ message: newBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ message: "invalid user" });
    }

    const books = await Book.find({ user: userId })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    if (!books) {
      return res.status(400).json({ message: "books not found" });
    }

    const totalBooks = await Book.countDocuments();

    res.status(200).json({
      success: true,
      message: "these are the books",
      data: {
        currentPage: page,
        totalPages: Math.ceil(totalBooks / limit),
        totalBooks,
        books,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: "book not found" });
  }
};

export const getRecomendedBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    const book = await Book.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleBook = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "user not valid" });
    }
    if (!id) {
      return res.status(400).json({ message: "book is not valid" });
    }

    const book = await Book.findById(id);

    if (!book.user.equals(userId)) {
      return res.status(400).json({ message: "unauthorized user" });
    }

    res.status(200).json({ book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "user not valid" });
    }
    if (!id) {
      return res.status(400).json({ message: "book is not valid" });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res(404).json({ message: "book not found" });
    }

    if (!book.user.equals(userId)) {
      return res.status(400).json({ message: "unauthorized user" });
    }

    //delete image from clousinary

    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log(deleteError);
      }
    }
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res(401).json({ message: "unable to delete, book not found" });
    }
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};
