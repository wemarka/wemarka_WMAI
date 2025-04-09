import React from "react";
import { Button } from "@/frontend/components/ui/button";
import { useAuth } from "@/frontend/contexts/AuthContext";

interface SocialLoginButtonsProps {
  isRTL?: boolean;
  onError: (message: string) => void;
}

export default function SocialLoginButtons({
  isRTL = false,
  onError,
}: SocialLoginButtonsProps) {
  const { signInWithProvider } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithProvider("google");
      if (error) throw error;
    } catch (err: any) {
      onError(
        err.message ||
          (isRTL
            ? "حدث خطأ أثناء تسجيل الدخول باستخدام Google"
            : "An error occurred during Google login"),
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            {isRTL ? "أو تسجيل الدخول باستخدام" : "Or continue with"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <Button
          variant="outline"
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
          </svg>
          {isRTL ? "Google تسجيل الدخول باستخدام" : "Sign in with Google"}
        </Button>
      </div>
    </div>
  );
}
