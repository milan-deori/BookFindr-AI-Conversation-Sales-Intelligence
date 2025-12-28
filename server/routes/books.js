const express = require('express');
const Book = require('../models/sell');
const upload = require('../utils/upload');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create book
router.post("/", authMiddleware, upload.array('images', 3), async (req, res) => {
  const { title, author, category, description, price, phone, state, city, pincode } = req.body;

  if (!title || !description || !price || !phone || !state || !city || !pincode || !author || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "At least one image is required" });
  }

  try {
    const imageUrls = req.files.map(file => file.path);
    const newBook = new Book({
      title, author, category, description, price, phone,
      state, city, pincode, images: imageUrls, user: req.user.id, dateAdded: Date.now()
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error saving book:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().populate("user", "name email");
    if (!books || books.length === 0) return res.status(404).json({ message: "No books found" });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("user");
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: "Book not found" });
  }
});

// Delete book
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const book = await Book.findById(id);
  if (!book) return res.status(404).json({ error: "Book not found" });

  await Book.findByIdAndDelete(id);
  res.status(200).json({ message: 'Book deleted successfully' });
});

// Update book
router.put("/:id", authMiddleware, upload.array('images', 3), async (req, res) => {
  const { id } = req.params;
  const { title, description, price, phone, state, city, pincode } = req.body;

  if (!title || !description || !price || !phone || !state || !city || !pincode) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    book.title = title;
    book.description = description;
    book.price = price;
    book.phone = phone;
    book.state = state;
    book.city = city;
    book.pincode = pincode;

    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.path);
      book.images = imageUrls;
    }

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
// Get books by category
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const books = await Book.find({ category });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommended books' });
  }
});

// Add view
router.post('/:id/view', async (req, res) => {
  const userId = req.body.userId;
  const bookId = req.params.id;
  try {
    const book = await Book.findById(bookId);
    if (!book.viewedBy.includes(userId)) {
      book.views += 1;
      book.viewedBy.push(userId);
      await book.save();
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error viewing book" });
  }
});

router.put("/:id/sold", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    book.isSold = true;
    await book.save();
    res.status(200).json({ message: "Book marked as sold" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
);

module.exports = router;
