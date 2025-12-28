const express = require('express');
const User = require('../models/user');

const router = express.Router();

// Add to wishlist
router.post("/add", async (req, res) => {
  const { userId, bookId } = req.body;
  if (!userId || !bookId) return res.status(400).json({ error: "Missing userId or bookId" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!Array.isArray(user.wishlist)) user.wishlist = [];
    if (!user.wishlist.includes(bookId)) {
      user.wishlist.push(bookId);
      await user.save();
    }

    res.json({ success: true, message: "Book added to wishlist" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Remove from wishlist
router.post("/remove", async (req, res) => {
  const { userId, bookId } = req.body;

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: bookId },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
});

// Get user's wishlist
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('wishlist');
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

