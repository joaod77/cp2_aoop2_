import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '';
  const initialPage = parseInt(queryParams.get('page')) || 1;
  const [loading, setLoading] = useState(true);


  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/movies?page=${currentPage}&search=${query}`)
      .then(res => {
        setMovies(res.data.movies);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.error('Error fetching movies:', err))
      .finally(() => setLoading(false));
  }, [currentPage, query]);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    navigate(`/?query=${query}&page=${page}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    setCurrentPage(1);
    navigate(`/?query=${search}&page=1`);
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
                  to={`/movie/${movie._id}`}
                  key={movie._id}
                  className="card"
                  state={{ page: currentPage, query }}
                >
                  <img src={movie.poster} alt={movie.title} />
                  <h2>{movie.title}</h2>
                </Link>
              ))}
            </div>

            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, currentPage - 3), currentPage + 2)
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={page === currentPage ? 'active' : ''}
                  >
                    {page}
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
