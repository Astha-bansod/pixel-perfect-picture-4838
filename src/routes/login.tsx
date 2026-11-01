import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — EchoNova" },
      { name: "description", content: "Log in to EchoNova to keep listening." },
      { property: "og:title", content: "Log in — EchoNova" },
      { property: "og:description", content: "Log in to EchoNova to keep listening." },
    ],
  }),
  component: () => <AuthForm mode="login" />,
});
