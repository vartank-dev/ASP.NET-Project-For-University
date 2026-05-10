import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateMovie() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState("");

    useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data));
    }, []);

  const navigate = useNavigate();

  const create = async () => {
    try {
      setError("");

      if (title.trim() === "" || description.trim() === "" || imageUrl.trim() === "" || categoryId.trim() === "") {
        setError("Моля, попълнете всички полета");
        return;
      }

await api.post("/movies", {
  title,
  description,
  imageUrl,
  categoryId
});

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Грешка при създаване на филм");
    }
  };

  return (
    <div className="create-movie-container">
      <h2 className="create-movie-name">Създаване на филм</h2>

      <input
        placeholder="Име"
        className="create-movie-title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        className="create-movie-image-url"
        placeholder="Снимка URL"
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
      />

      <textarea
        className="create-movie-description"
        placeholder="Описание"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

            <select className="create-movie-category" onChange={e => setCategoryId(e.target.value)}>
  <option value="">Избери категория</option>
  {categories.map(c => (
    <option key={c.id} value={c.id}>{c.name}</option>
  ))}
</select>

      <button className="create-movie-create" onClick={create}>Създай</button>

            {error && <p className="create-movie-error">{error}</p>}

    </div>
  );
}
