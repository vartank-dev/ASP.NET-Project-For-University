import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    title: "",
    description: "",
    imageUrl: "",
    categoryId: ""
  });

  const [categories, setCategories] = useState([]);

  // 🔹 зареждаме филма
  useEffect(() => {
    api.get(`/movies/${id}`).then(res => {
      setMovie({
        title: res.data.title,
        description: res.data.description,
        imageUrl: res.data.imageUrl,
        categoryId: res.data.categoryId
      });
    });
  }, [id]);

  // 🔹 зареждаме категориите
  useEffect(() => {
    api.get("/categories").then(res => {
      setCategories(res.data);
    });
  }, []);

  const update = async () => {
    await api.put(`/movies/${id}`, movie);
    navigate(`/movies/${id}`);
  };

  return (
    <div className="create-movie-container">
      <h2 className="create-movie-name">Промени филм</h2>

      <input
        className="create-movie-title"
        value={movie.title}
        onChange={e => setMovie({ ...movie, title: e.target.value })}
        placeholder="Име"
      />

      <input
        className="create-movie-image-url"
        value={movie.imageUrl}
        onChange={e => setMovie({ ...movie, imageUrl: e.target.value })}
        placeholder="Снимка URL"
      />

      {/* ✅ SELECT категория */}
      <select
        className="create-movie-category"
        value={movie.categoryId}
        onChange={e => setMovie({ ...movie, categoryId: e.target.value })}
      >
        <option value="">Избери категория</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <textarea
        className="create-movie-description"
        value={movie.description}
        onChange={e => setMovie({ ...movie, description: e.target.value })}
        placeholder="Описание"
      />

      <button className="create-movie-create" onClick={update}>
        Запази
      </button>
    </div>
  );
}
