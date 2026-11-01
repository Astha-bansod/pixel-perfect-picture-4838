import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — EchoNova" },
      { name: "description", content: "Create an EchoNova account to save shows and track listening." },
      { property: "og:title", content: "Sign up — EchoNova" },
      { property: "og:description", content: "Create an EchoNova account to save shows and track listening." },
    ],
  }),
  component: () => <AuthForm mode="signup" />,
});
