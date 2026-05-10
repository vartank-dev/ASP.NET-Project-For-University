import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navigaciq">
      {/* ЛЯВА ЧАСТ */}
      <div className="nav-left">
        <Link to="/">Начало</Link>

        {user && (
          <>
            <Link to="/create">Създай филм</Link>
            <Link to="/categories">Категории</Link>
            <Link to="/categories/create">Създай категория</Link>
          </>
        )}
      </div>

      {/* ДЯСНА ЧАСТ */}
      <div className="nav-right">
        {user ? (
          <>
            <span style={{color: "black"}}>👤 {user.username}</span>
            <button onClick={logout}>Излез</button>
          </>
        ) : (
          <>
            <Link to="/login">Влез</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
      </div>
    </nav>
  );
}
