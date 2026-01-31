import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import Toast from "../components/Toast";
import api from "../lib/api";
import { useAuth } from "../auth/AuthContext";
import { CheckCircle2, LogOut, Plus, Search, Trash2 } from "lucide-react";

export default function Tasks() {
  const { logout, me } = useAuth();

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [toast, setToast] = useState({ type: "info", message: "" });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/tasks");
      setItems(res.data || []);
    } catch (err) {
      setToast({ type: "error", message: err?.response?.data?.error || "Load failed" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const headerText = useMemo(() => {
    if (!me?.raw) return "Hello";
    return me.raw; // e.g. "Hello test@test.com"
  }, [me]);

  async function createTask(e) {
    e.preventDefault();
    setToast({ type: "info", message: "" });

    if (!title.trim()) return;

    try {
      const res = await api.post("/tasks", {
        title: title.trim(),
        description: description.trim(),
      });

      setTitle("");
      setDescription("");
      setToast({
        type: "success",
        message: `Created. AI category: ${res.data?.category || "—"}`,
      });

      await load();
    } catch (err) {
      setToast({ type: "error", message: err?.response?.data?.error || "Create failed" });
    }
  }

  async function markDone(id) {
    try {
      await api.put(`/tasks/${id}`, { status: "DONE" });
      await load();
    } catch (err) {
      setToast({ type: "error", message: err?.response?.data?.error || "Update failed" });
    }
  }

  async function remove(id) {
    try {
      await api.delete(`/tasks/${id}`);
      await load();
    } catch (err) {
      setToast({ type: "error", message: err?.response?.data?.error || "Delete failed" });
    }
  }

  async function search(e) {
    e.preventDefault();

    if (!q.trim()) {
      await load();
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/tasks/search?q=${encodeURIComponent(q.trim())}`);
      setItems(res.data || []);
    } catch (err) {
      setToast({ type: "error", message: err?.response?.data?.error || "Search failed" });
    } finally {
      setLoading(false);
    }
  }

  function statusBadgeClass(status) {
    if (status === "DONE") return "badge badgeStatusDone";
    return "badge badgeStatusOpen"; // default OPEN
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="row" style={{ marginBottom: 18 }}>
        <div>
          <h1 className="h1">Tasks</h1>
          <div className="muted">{headerText}</div>
        </div>

        <Button variant="ghost" onClick={() => logout()}>
          <LogOut size={18} />
          Logout
        </Button>
      </div>

      {/* Main grid */}
      <div className="grid2">
        {/* Left: Create + Search */}
        <Card>
          <h2 className="h2">Create task</h2>

          <Toast type={toast.type} message={toast.message} />

          <form onSubmit={createTask} style={{ marginTop: 12, display: "grid", gap: 12 }}>
            <Input
              label="Title"
              placeholder="e.g. Prepare for interview"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Input
              label="Description"
              placeholder="What exactly to do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button variant="primary" type="submit" disabled={!title.trim()} className="w-full">
              <Plus size={18} />
              Create (AI will categorize)
            </Button>
          </form>

          <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(31,35,40,0.12)" }}>
            <h2 className="h2" style={{ marginBottom: 10 }}>
              Search
            </h2>

            <form onSubmit={search} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <Input
                  label="Query"
                  placeholder="spring / run / finance ..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>

              <Button type="submit">
                <Search size={18} />
              </Button>
            </form>

            <div className="muted" style={{ marginTop: 10 }}>
              Empty query resets the list.
            </div>
          </div>
        </Card>

        {/* Right: List */}
        <Card>
          <div className="row" style={{ marginBottom: 12 }}>
            <h2 className="h2" style={{ margin: 0 }}>
              My tasks
            </h2>
            <div className="muted">{loading ? "Loading..." : `${items.length} items`}</div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {items.map((t) => (
              <div key={t.id} className="task">
                <div className="row" style={{ alignItems: "flex-start" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 900, fontSize: 15, lineHeight: "18px" }}>
                      {t.title}
                    </div>

                    {t.description && (
                      <div className="muted" style={{ marginTop: 6 }}>
                        {t.description}
                      </div>
                    )}

                    <div className="badges">
                      {/* STATUS: now strong + color-coded */}
                      <span className={statusBadgeClass(t.status)}>
                        status: <b style={{ fontWeight: 900 }}>{t.status}</b>
                      </span>

                      <span className="badge badgeGreen">
                        category: {t.category || "—"}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {/* Button label depends on current status:
                        OPEN -> shows "OPEN" (clickable, marks done)
                        DONE -> shows "DONE" (disabled)
                    */}
                    <Button
                      variant="ghost"
                      onClick={() => markDone(t.id)}
                      disabled={t.status === "DONE"}
                      title={t.status === "DONE" ? "Already done" : "Click to mark as DONE"}
                    >
                      <CheckCircle2 size={18} />
                      {t.status === "DONE" ? "DONE" : "OPEN"}
                    </Button>

                    <Button variant="danger" onClick={() => remove(t.id)}>
                      <Trash2 size={18} />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {!loading && items.length === 0 && (
              <div className="muted" style={{ textAlign: "center", padding: "28px 0" }}>
                No tasks yet. Create one on the left ✨
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
