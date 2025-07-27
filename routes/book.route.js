import express from "express";
import { Router } from "express";
import {
  createBook,
  deleteBook,
  getBooks,
  getRecomendedBooks,
  getSingleBook,
} from "../controllers/book.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-book", protect, createBook);
router.get("/get-books", protect, getBooks);
router.get("/get-book/:id", protect, getSingleBook);
router.get("/get-recomendation", protect, getRecomendedBooks);
router.delete("/delete-book/:id", protect, deleteBook);

export default router;
