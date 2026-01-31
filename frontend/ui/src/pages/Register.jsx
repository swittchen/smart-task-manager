import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import Toast from "../components/Toast";
import api from "../lib/api";
import { useAuth } from "../auth/AuthContext";
import { UserPlus, Sparkles } from "lucide-react";

export default function Register() {
  const nav = useNavigate();
  const { setToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", { email, password });
      setToken(res.data.token);
      nav("/app");
    } catch (err) {
      setError(err?.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div className="authPage">
      <Card className="authCard">
        <div className="authHeader">
          <div className="authIcon" aria-hidden="true">
            <Sparkles size={20} />
          </div>

          <div>
            <div className="authTitle">Create account</div>
            <div className="authSub">Register → get JWT → start creating tasks</div>
          </div>
        </div>

        {error ? <Toast type="error" message={error} /> : null}

        <form onSubmit={onSubmit} className="authForm">
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="min 8 chars"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" type="submit" variant="primary" disabled={!email.trim() || password.length < 8}>
            <UserPlus size={18} />
            Create account
          </Button>
        </form>

        <div className="authFooter">
          <div className="authFooterLeft">
            <span className="muted">Already have one?</span>
            <Link className="authLink" to="/login">
              Sign in
            </Link>
          </div>
        </div>

        <div className="authMeta">
          Password rule: at least 8 characters.
        </div>
      </Card>
    </div>
  );
}
