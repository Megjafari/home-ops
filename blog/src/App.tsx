import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthProvider";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Post from "./pages/Post";
import About from "./pages/About";
import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import PostEditor from "./admin/PostEditor";
import RequireAuth from "./admin/RequireAuth";

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
          <Route
            path="/admin/new"
            element={
              <RequireAuth>
                <PostEditor />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <RequireAuth>
                <PostEditor />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}