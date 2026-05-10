import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function MovieDetails() {
  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
const [categoryName, setCategoryName] = useState("");

  // 🎬 movie
  const loadMovie = async () => {
    const res = await api.get(`/movies/${movieId}`);
    setMovie(res.data);
      loadCategory(res.data.categoryId);
  };

  // 💬 comments
  const loadComments = async () => {
    const res = await api.get(`/comments/${movieId}`);
    setComments(res.data);
  };

  // ❤️ likes count
  const loadLikes = async () => {
    const res = await api.get(`/likes/${movieId}/count`);
    setLikes(res.data);
  };

  const loadViews = async () => {
  const res = await api.get(`/movies/view/${movieId}`);
  setViews(res.data);
};

const loadCategory = async (categoryId) => {
  if (!categoryId) return;

  const res = await api.get(`/categories/${categoryId}`);
  setCategoryName(res.data.name);
};

  useEffect(() => {
    loadMovie();
    loadComments();
    loadLikes();
  loadViews();

    // 👁 view count
    api.post(`/movies/view/${movieId}`).catch(() => {});
  }, [movieId]);

  // 🗑 delete (owner only)
  const deleteMovie = async () => {
    if (!window.confirm("Сигурен ли си?")) return;
    await api.delete(`/movies/${movieId}`);
    navigate("/");
  };

  // ✍️ comment (само логнат)
  const addComment = async () => {
    if (!text.trim()) return;

    await api.post("/comments", {
      movieId,
      text
    });

    setText("");
    loadComments();
  };

  // ❤️ like (само логнат)
  const likeMovie = async () => {
    await api.post(`/likes/${movieId}`);
    loadLikes();
  };

  const stars = Math.min(likes, 5);


  if (!movie) return <p>Зареждане...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h2 className="detmov-title">{movie.title}</h2>
      <img className="detmov-photo" src={movie.imageUrl} width="300" alt="" />
      <p className="detmov-descripton">Описание: {movie.description}</p>
      <p className="detmov-category"><b>Категория:</b> {categoryName || "—"}</p>

      {/* ❤️ ЛАЙКОВЕ */}
      <p className="detmov-likes">❤️ Харесвания: {likes}</p>
        <p className="detmov-views">👁 Преглеждания: {views}</p>
<div className="detmov-rating">
  {"★".repeat(stars)}
  {"☆".repeat(5 - stars)}
</div>

      {user ? (
        <button className="detmov-likebtn" onClick={likeMovie}>Харесай</button>
      ) : (
        <p className="detmov-profile"><i>Влезте в профила си за да лайкнете филма</i></p>
      )}

      <hr />

      {/* 💬 КОМЕНТАРИ */}
      <h3 className="detmov-commenta">Коментари</h3>

      {comments.map(c => (
        <div key={c.id} className="detmov-commentbox">
          <b>{c.username}: </b>
          <span>{c.text}</span>
        </div>
      ))}

      {user ? (
        <>
          <textarea
            className="detmov-textarea"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Напиши коментар..."
            rows="3"
            style={{ width: "100%" }}
          />
          <button className="detmov-commentbtn" onClick={addComment}>Коментирай</button>
        </>
      ) : (
        <p className="detmov-profile"><i>Влезте в профила си за да напишете коментар</i></p>
      )}

      <hr />

      {/* 🧑‍💻 OWNER ACTIONS */}
      {user?.id === movie.ownerId && (
        <>
          <button className="detmov-editbtn" onClick={() => navigate(`/edit/${movie.id}`)}>
            Промени
          </button>
          <button className="detmov-deletebtn" onClick={deleteMovie}>
            Изтрий
          </button>
        </>
      )}
    </div>
  );
}
