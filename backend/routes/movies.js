import express from 'express';
import Movie from '../models/Movie.js';

const router = express.Router();

// GET /api/movies?page=1
router.get('/api/movies', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 40;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
  
    const filter = search
      ? { title: { $regex: new RegExp(search, 'i') } }
      : {};
  
    try {
      const total = await Movie.countDocuments(filter);
      const movies = await Movie.find(filter, { title: 1, poster: 1 })
        .skip(skip)
        .limit(limit);
      const totalPages = Math.ceil(total / limit);
  
      res.json({
        movies,
        totalPages,
        currentPage: page,
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching movies' });
    }
  });
  

// GET /api/movies/:id
router.get('/api/movies/:id', async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
      res.json(movie);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching the movie' });
    }
  });
  
export default router;
