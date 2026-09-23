import { useAuth } from "../lib/auth";
import PostEditor from "./PostEditor";

export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Admin</h1>
        <button onClick={logout} className="text-sm underline">
          Log out
        </button>
      </div>
      <PostEditor />
    </div>
  );
}