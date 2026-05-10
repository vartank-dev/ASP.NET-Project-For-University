import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function MoviesByCategory() {
  const { id } = useParams(); // categoryId
  const [movies, setMovies] = useState([]);
  const [ratings, setRatings] = useState({}); // ⭐ movieId -> stars

  useEffect(() => {
    const loadMoviesByCategory = async () => {
      const res = await api.get(`/movies/category/${id}`);
      setMovies(res.data);

      // ⭐ зареждаме рейтинги
      const ratingsObj = {};

      for (let movie of res.data) {
        const likesRes = await api.get(`/likes/${movie.id}/count`);
        const stars = Math.min(likesRes.data, 5);
        ratingsObj[movie.id] =
          "★".repeat(stars) + "☆".repeat(5 - stars);
      }

      setRatings(ratingsObj);
    };

    loadMoviesByCategory();
  }, [id]);

  return (
    <div>
      <h2 className="fuilmihed">Филми в категория</h2>

      <div className="moviues-grid">
        {movies.map(movie => (
          <div className="movie-box" key={movie.id}>
            <h3 className="movie-title">{movie.title}</h3>

            <img
              className="movie-photo"
              src={movie.imageUrl}
              width="200"
              alt=""
            />

            <p className="movie-descripton2">Описание:</p>
            <p className="movie-descripton">{movie.description}</p>

            <p className="movie-rating2">
              {ratings[movie.id] || "☆☆☆☆☆"}
            </p>

            <Link className="movie-bnt" to={`/movies/${movie.id}`}>
              Повече информация
            </Link>
          </div>
        ))}
      </div>

      {movies.length === 0 && (
        <p className="fimlnotfound">Няма намерени филми</p>
      )}
    </div>
  );
}
