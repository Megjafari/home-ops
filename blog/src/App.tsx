import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthProvider";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Post from "./pages/Post";
import About from "./pages/About";
import RequireAuth from "./admin/RequireAuth";

// Admin pages (and the Tiptap editor) are only loaded when needed.
const Login = lazy(() => import("./admin/Login"));
const Dashboard = lazy(() => import("./admin/Dashboard"));
const PostEditor = lazy(() => import("./admin/PostEditor"));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1">
            <Suspense fallback={<div className="p-8 font-mono text-sm text-fg-muted">loading...</div>}>
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
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}