import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import Toast from "../components/Toast";
import api from "../lib/api";
import { useAuth } from "../auth/AuthContext";
import { Shield, Sparkles } from "lucide-react";

export default function Login() {
  const nav = useNavigate();
  const { setToken } = useAuth();

  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("secret123");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      setToken(res.data.token);
      nav("/app");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
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
            <div className="authTitle">Smart Task Manager</div>
            <div className="authSub">AI-powered categories • Mistral</div>
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* wichtig: Button variant in deinem Component muss ggf. primary heißen */}
          <Button className="w-full" type="submit" variant="primary">
            <Shield size={18} />
            Sign in
          </Button>
        </form>

        <div className="authFooter">
          <div className="authFooterLeft">
            <span className="muted">No account?</span>
            <Link className="authLink" to="/register">
              Create one
            </Link>
          </div>

          {/* optional: kleiner “Forgot password” link, wenn du willst */}
          {/* <a className="authLink" href="#">Forgot password?</a> */}
        </div>

        <div className="authMeta">
          Tip: try “spring”, “run”, “finance” in search after login.
        </div>
      </Card>
    </div>
  );
}
