import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

      const navigator = useNavigate();


  const register = async () => {
    setError("");

    if (!username || !email || !password) {
      setError("Моля, попълни всички полета");
      return;
    }

    try {
      await axios.post("http://localhost:5273/api/auth/register", {
        username,
        email,
        password
      });

      setUsername("");
      setEmail("");
      setPassword("");
      navigator("/");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Грешка при регистрация");
      }
    }
  };

  return (
    <div>
      <h2 className="loginhead">Създаване на акаунт</h2>

      <input
        className="loginemail"
        placeholder="Потребителско име"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

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

      <button className="loginbtn" onClick={register}>
        Създай
      </button>

            {error && <p className="loginerror" >{error}</p>}

                  <p className="logintoreg">
        Имаш акаунт?{" "}
        <Link className="loginhyp" to="/login">
          Влез
        </Link>
      </p>
    </div>
  );
}
