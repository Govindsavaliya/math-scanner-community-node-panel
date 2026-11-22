import Icon from "@/components/ui/Icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "@/components/ui";
import { paths } from "@/app/router/paths";
import { useLogin } from "../api";

const REMEMBER_KEY = "remembered_email";

const readRemembered = () => {
  localStorage.removeItem("ejwt");
  localStorage.removeItem("pjwt");
  const email = localStorage.getItem(REMEMBER_KEY) ?? "";
  return { email, password: "", remember: Boolean(email) };
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [inpData, setInpData] = useState(readRemembered);

  const login = useLogin({
    onSuccess: () => {
      if (inpData.remember === true) {
        localStorage.setItem(REMEMBER_KEY, inpData.email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
      navigate(paths.home);
    },
  });

  const handleChange = (e) => setInpData({ ...inpData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login.isPending) return;
    const { email, password } = e.currentTarget.elements;
    login.mutate({ email: email.value, password: password.value });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="w-105 max-w-full">
        <div className="mb-6 text-center">
          <img
            src="/logo/appicon.png"
            className="mx-auto mb-4 block size-16 rounded-2xl border border-line shadow-card"
            alt="Math Scanner"
          />
          <h1 className="mb-1 text-[26px] leading-[1.2] font-bold tracking-tight text-ink">Welcome back</h1>
          <p className="mb-0 text-[14px] text-muted">Sign in to manage your Math Scanner platform.</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-8 shadow-lg max-[400px]:p-5">
          <Form method="post" onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="login-email">
              <Form.Label>Email</Form.Label>
              <div className="relative mt-1.5">
                <Icon name="mail" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-muted" />
                <Form.Control
                  type="email"
                  className="pl-10"
                  placeholder="you@example.com"
                  name="email"
                  autoComplete="username"
                  value={inpData.email}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-4" controlId="login-password">
              <Form.Label>Password</Form.Label>
              <div className="relative mt-1.5">
                <Icon name="lock" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-muted" />
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  className="pr-11 pl-10"
                  placeholder="Enter your password"
                  name="password"
                  autoComplete="current-password"
                  value={inpData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-0 right-1 flex size-10 cursor-pointer items-center justify-center border-0 bg-transparent text-[20px] text-muted hover:text-primary"
                >
                  <Icon name={showPassword ? "eye-off" : "eye"} />
                </button>
              </div>
            </Form.Group>
            <Form.Group className="mb-6" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="Remember my email"
                checked={inpData.remember}
                onChange={(e) => setInpData({ ...inpData, remember: e.target.checked })}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-full py-2.5" disabled={login.isPending}>
              {login.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </Form>
        </div>
        <p className="mt-6 mb-0 text-center text-[13px] text-muted">© {new Date().getFullYear()} Math Scanner</p>
      </div>
    </div>
  );
}
