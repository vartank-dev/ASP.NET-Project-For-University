import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Movies from "./pages/Movies";
import CreateMovie from "./pages/CreateMovie";
import MovieDetails from "./pages/MovieDetails";
import EditMovie from "./pages/EditMovie";

import CreateCategory from "./pages/CreateCategory";
import Categories from "./pages/Categories";
import MoviesByCategory from "./pages/MoviesByCategory";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* movies */}
        <Route path="/" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/create" element={<CreateMovie />} />
        <Route path="/edit/:id" element={<EditMovie />} />

        {/* auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* categories */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/create" element={<CreateCategory />} />
        <Route path="/categories/:id" element={<MoviesByCategory />} />
      </Routes>
    </BrowserRouter>
  );
}
