import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  author: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Comment', commentSchema);
