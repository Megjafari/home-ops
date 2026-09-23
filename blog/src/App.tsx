import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthProvider";
import Home from "./pages/Home";
import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import RequireAuth from "./admin/RequireAuth";
import Blog from "./pages/Blog";
import Post from "./pages/Post";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<Login />} />
            <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<Post />} />
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