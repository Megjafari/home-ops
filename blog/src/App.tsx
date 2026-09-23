import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthProvider";
import Home from "./pages/Home";
import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import RequireAuth from "./admin/RequireAuth";
import Blog from "./pages/Blog";
import Post from "./pages/Post";
import Nav from "./components/Nav";
import About from "./pages/About";

export default function App() {
  return (
    <AuthProvider>
  <BrowserRouter>
    <Nav />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<Post />} />
      <Route path="/about" element={<About />} />
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
    </Routes>
  </BrowserRouter>
</AuthProvider>
  );
}