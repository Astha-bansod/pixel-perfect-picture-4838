import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { DemoBadge, Logo } from "@/components/echo";
import cover from "@/assets/cover-2.jpg";

const base = {
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
};
const loginSchema = z.object(base);
const signupSchema = z
  .object({ name: z.string().trim().min(2, "Enter your name").max(60), ...base, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: "Passwords don't match", path: ["confirm"] });

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = (isSignup ? signupSchema : loginSchema).safeParse(values);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    setStatus("loading");
    // Demo only: nothing is sent or stored.
    setTimeout(() => {
      setStatus("done");
      setValues({ name: "", email: "", password: "", confirm: "" });
    }, 700);
  };

  const field = (name: keyof typeof values, label: string, type = "text") => (
    <label className="block">
      <span className="text-sm text-muted-foreground">{label}</span>
      <input
        type={type}
        value={values[name]}
        onChange={(e) => setValues({ ...values, [name]: e.target.value })}
        className="mt-1 w-full rounded-xl border border-input bg-card px-4 py-3 outline-none focus:border-primary"
        aria-invalid={!!errors[name]}
      />
      {errors[name] && <span className="mt-1 block text-xs text-destructive">{errors[name]}</span>}
    </label>
  );

  return (
    <div className="grid min-h-[calc(100vh-4rem)] pb-20 md:grid-cols-2">
      <div className="relative hidden overflow-hidden md:block">
        <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <p className="absolute bottom-12 left-10 max-w-sm font-display text-5xl leading-tight">"The best conversations happen after midnight."</p>
      </div>
      <div className="flex items-center justify-center px-5 py-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4 animate-rise" noValidate>
          <Logo />
          <h1 className="font-display text-5xl">{isSignup ? "Create your account" : "Welcome back"}</h1>
          <DemoBadge>Demo UI · no account is created or stored</DemoBadge>
          {isSignup && field("name", "Name")}
          {field("email", "Email", "email")}
          {field("password", "Password", "password")}
          {isSignup && field("confirm", "Confirm password", "password")}
          <button disabled={status === "loading"} className="w-full rounded-full bg-gradient-primary py-3 font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
            {status === "loading" ? "Checking…" : isSignup ? "Sign up" : "Log in"}
          </button>
          {status === "done" && (
            <p className="rounded-xl border border-primary/40 bg-accent/40 p-3 text-sm">
              Form is valid. In this demo nothing was sent — sign-in will work once a backend is connected.
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {isSignup ? "Already have an account? " : "New to EchoNova? "}
            <Link to={isSignup ? "/login" : "/signup"} className="text-primary-glow">{isSignup ? "Log in" : "Sign up"}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
