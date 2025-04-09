import React from "react";
import RegisterForm from "./RegisterForm";

interface RegisterPageProps {
  isRTL?: boolean;
}

export default function RegisterPage({ isRTL = false }: RegisterPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <RegisterForm isRTL={isRTL} />
    </div>
  );
}
