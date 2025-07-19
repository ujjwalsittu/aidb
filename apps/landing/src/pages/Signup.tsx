import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { api } from "../lib/api";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [done, setDone] = useState(false);

  const onChange = (e: any) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  async function onSubmit(e: any) {
    e.preventDefault();
    await api.post("/auth/register", { ...form, role: "customer" });
    setStep(2);
    setDone(true);
  }

  return (
    <Box
      sx={{
        maxWidth: 380,
        mx: "auto",
        mt: 7,
        p: 4,
        boxShadow: 2,
        borderRadius: 4,
        bgcolor: "#fff",
      }}
    >
      <Typography variant="h4" mb={2}>
        Start building with AIDB
      </Typography>
      {!done ? (
        <form onSubmit={onSubmit}>
          <input
            required
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={onChange}
            style={{ width: "100%", padding: 8, margin: 4 }}
          />
          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            style={{ width: "100%", padding: 8, margin: 4 }}
          />
          <input
            required
            type="password"
            name="password"
            placeholder="Password"
            minLength={8}
            value={form.password}
            onChange={onChange}
            style={{ width: "100%", padding: 8, margin: 4 }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              margin: 8,
              padding: 10,
              background: "#00f176",
              color: "#191f31",
              border: "none",
              fontWeight: 800,
            }}
          >
            Sign Up →
          </button>
        </form>
      ) : (
        <Typography color="success.main" fontWeight={700}>
          Welcome! Check your email to verify your account and then{" "}
          <a href="/login">Login</a>.
        </Typography>
      )}
    </Box>
  );
}
