import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories")
      .then(res => setCategories(res.data));
  }, []);

  return (
    <div className="categories-list">
      <h2 className="create-movie-name">Категории</h2>

      {categories.map(category => (
        <div key={category.id}>
          <Link className="cagroty_hypr-button" to={`/categories/${category.id}`}>
            {category.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
