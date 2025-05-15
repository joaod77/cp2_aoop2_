import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from '../services/axios';
import '../styles/MovieDetails.css';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const query = queryParams.get('query') || '';
  const page = queryParams.get('page') || 1;

  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ author: '', text: '' });
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const fetchMovieAndComments = async () => {
      try {
        const movieRes = await axios.get(`/api/movies/${id}`);
        setMovie(movieRes.data);

        const commentsRes = await axios.get(`/api/comments/${id}`);
        setComments(commentsRes.data);
      } catch (error) {
        console.error('Error fetching movie or comments:', error);
      }
    };

    fetchMovieAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.author || !newComment.text) return;

    try {
      await axios.post('/api/comments', { ...newComment, movieId: id });
      const updated = await axios.get(`/api/comments/${id}`);
      setComments(updated.data);
      setNewComment({ author: '', text: '' });
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleEdit = async (commentId) => {
    try {
      await axios.put(`/api/comments/${commentId}`, { text: editText });
      setEditingId(null);
      const updated = await axios.get(`/api/comments/${id}`);
      setComments(updated.data);
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      const updated = await axios.get(`/api/comments/${id}`);
      setComments(updated.data);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (!movie) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
        fontSize: '2rem',
        color: '#cae862',
        textAlign: 'center'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="details-container">
      <button
        onClick={() => navigate(`/?query=${query}&page=${page}`)}
        className="back-btn"
      >
        ← Back
      </button>

      <div className="movie-header">
        <img
          src={movie.poster}
          alt={movie.title}
        />

        <div>
          <h1>{movie.title} ({movie.year})</h1>
          <div className="movie-details">
            <p><strong>Genres:</strong> {movie.genres?.join(', ') || 'N/A'}</p>
            <p><strong>Cast:</strong> {movie.cast?.join(', ') || 'N/A'}</p>
            <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
            <p><strong>Languages:</strong> {movie.languages?.join(', ') || 'N/A'}</p>
            <p><strong>Released:</strong> {new Date(movie.released).toDateString()}</p>
            <p><strong>Director(s):</strong> {movie.directors?.join(', ') || 'N/A'}</p>
            <p><strong>Writers:</strong> {movie.writers?.join(', ') || 'N/A'}</p>
            <p><strong>Awards:</strong> {movie.awards?.text || 'N/A'}</p>
            <p><strong>IMDb:</strong> {movie.imdb?.rating} / 10 ({movie.imdb?.votes} votes)</p>
            <p><strong>Plot:</strong> {movie.fullplot || movie.plot || 'No plot available'}</p>
          </div>
        </div>
      </div>

      <div className="comment-section">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            placeholder="Your name"
            value={newComment.author}
            onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
          />
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment.text}
            onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
          />
          <button type="submit">Post</button>
        </form>

        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c._id}>
              <p><strong>{c.author}:</strong></p>
              {editingId === c._id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEdit(c._id);
                  }}
                  className="comment-form"
                >
                  <input
                    type="text"
                    placeholder="Edit your comment..."
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit">Save</button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p>{c.text}</p>
                  <div className="comment-actions">
                    <button onClick={() => { setEditingId(c._id); setEditText(c.text); }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(c._id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
