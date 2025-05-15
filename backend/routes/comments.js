import express from 'express';
import Comment from '../models/Comment.js';

const router = express.Router();

// GET comments by movie
router.get('/:movieId', async (req, res) => {
  try {
    const comments = await Comment.find({ movieId: req.params.movieId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

// POST new comment
router.post('/', async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const saved = await newComment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Error saving comment' });
  }
});

// PUT update comment
router.put('/:id', async (req, res) => {
  try {
    const updated = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Error updating comment' });
  }
});

// DELETE comment
router.delete('/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting comment' });
  }
});

export default router;
