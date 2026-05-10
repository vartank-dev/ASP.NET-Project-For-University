import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateCategory() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

    const navigator = useNavigate();


  const create = async () => {
          setError("");

      if (name.trim() === "") {
        setError("Моля, попълнете всички полета");
        return;
      }

    await api.post("/categories", { name });
    setName("");
      navigator("/");
};

  return (
    <div className="create-movie-container">
      <h2 className="create-movie-name">Създай категория</h2>
      <input
      className="create-movie-title"
        placeholder="Име на категория"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button className="create-movie-create" onClick={create}>Създай</button>
                  {error && <p className="create-movie-error">{error}</p>}

    </div>
  );
}
