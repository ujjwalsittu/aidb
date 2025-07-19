import { useState } from "react";
import { setToken } from "../lib/auth";
import { api } from "../lib/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: any) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  async function onSubmit(e: any) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/auth/login", form);
      setToken(res.data.token);
      window.location.reload();
    } catch (e: any) {
      setError(e.response?.data?.error || "Bad credentials");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        maxWidth: 340,
        margin: "6em auto",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 1px 4px #0001",
        padding: 24,
      }}
    >
      <h2>Admin Login</h2>
      <input
        required
        autoFocus
        name="email"
        value={form.email}
        onChange={onChange}
        placeholder="Email"
        style={{ width: "100%", margin: 8, padding: 8 }}
      />
      <input
        required
        name="password"
        type="password"
        value={form.password}
        onChange={onChange}
        placeholder="Password"
        style={{ width: "100%", margin: 8, padding: 8 }}
      />
      <button type="submit" style={{ width: "100%", margin: 8, padding: 8 }}>
        Login
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
