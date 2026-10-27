import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { API_BASE } from "../lib/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let res: Response;
    try {
      res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
    } catch {
      setError("Could not reach the server");
      return;
    }

    if (res.status === 429) {
      setError("Too many attempts, try again in a minute");
      return;
    }

    if (!res.ok) {
      setError("Wrong username or password");
      return;
    }

    const data = await res.json();
    login(data.token);
    navigate("/admin");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Admin login</h1>
      <input
        className="border p-2 rounded"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="border p-2 rounded"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button className="bg-black text-white p-2 rounded" type="submit">
        Log in
      </button>
    </form>
  );
}