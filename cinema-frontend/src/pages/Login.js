import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ ГРЕШКА
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const login = async () => {
    setError(""); // чистим стара грешка

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      // ❌ невалидни данни
      if (err.response && err.response.status === 401) {
        setError("Невалиден имейл или парола");
      } else {
        setError("Възникна грешка. Опитай отново.");
      }
    }
  };

  return (
    <div>
      <h2 className="loginhead">Влез в акаунт</h2>

      <input
        className="loginemail"
        placeholder="Имейл"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        className="loginpass"
        type="password"
        placeholder="Парола"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button className="loginbtn" onClick={login}>
        Влез
      </button>

            {error && <p className="loginerror">{error}</p>}


      <p className="logintoreg">
        Нямаш акаунт?{" "}
        <Link className="loginhyp" to="/register">
          Регистрация
        </Link>
      </p>


    </div>
  );
}
