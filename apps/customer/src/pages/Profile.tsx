import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { clearToken } from "../lib/auth";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/auth/me").then((r) => {
      setUser(r.data.user);
      setName(r.data.user.name);
    });
  }, []);

  async function save() {
    try {
      // Replace below line with your actual user update endpoint
      await api.patch(`/users/${user.id}`, { name });
      setMsg("Saved!");
      setEditing(false);
    } catch {
      setMsg("Could not save.");
    }
  }

  function logoutAndWipe() {
    clearToken();
    window.location.href = "/";
  }

  if (!user) return <div>Loading...</div>;
  return (
    <div>
      <h2>Profile</h2>
      <div>
        <strong>Email:</strong> {user.email}
      </div>
      <div>
        <strong>Name:</strong>{" "}
        {editing ? (
          <input value={name} onChange={(e) => setName(e.target.value)} />
        ) : (
          user.name
        )}
      </div>
      <div>
        <strong>Role:</strong> {user.role}
      </div>
      <div>
        <strong>Team:</strong> {user.team_id}
      </div>
      <div style={{ marginTop: 16 }}>
        {editing ? (
          <>
            <button onClick={save}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)}>Edit</button>
        )}
      </div>
      <div>
        <button style={{ marginTop: 24 }} onClick={logoutAndWipe}>
          Logout
        </button>
      </div>
      {msg && <div style={{ color: "green", marginTop: 10 }}>{msg}</div>}
    </div>
  );
}
