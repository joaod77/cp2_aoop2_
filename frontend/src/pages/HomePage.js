import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const page = parseInt(queryParams.get('page')) || 1;

  const [search, setSearch] = useState(query);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearch(query);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/movies?page=${page}&search=${query}`)
      .then(res => {
        setMovies(res.data.movies);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.error('Error fetching movies:', err))
      .finally(() => setLoading(false));
  }, [page, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?query=${search}&page=1`);
  };

  const handlePageClick = (p) => {
    navigate(`/?query=${query}&page=${p}`);
  };

  return (
    <>
      <div className="header">
        <h1>Movies</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="container">
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
            fontSize: '2rem',
            color: '#cae862'
          }}>
            Loading...
          </div>
        ) : (
          <>
            <div className="grid">
              {movies.map((movie) => (
                <Link
                  to={`/movie/${movie._id}?query=${query}&page=${page}`}
                  key={movie._id}
                  className="card"
                >
                  <img src={movie.poster} alt={movie.title} />
                  <h2>{movie.title}</h2>
                </Link>
              ))}
            </div>

            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, page - 3), page + 2)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageClick(p)}
                    className={p === page ? 'active' : ''}
                  >
                    {p}
                  </button>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default HomePage;
