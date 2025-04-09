import React from "react";
import LoginForm from "./LoginForm";

interface LoginPageProps {
  isRTL?: boolean;
}

export default function LoginPage({ isRTL = false }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoginForm isRTL={isRTL} />
    </div>
  );
}
