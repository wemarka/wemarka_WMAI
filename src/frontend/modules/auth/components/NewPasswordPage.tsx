import React from "react";
import { Link } from "react-router-dom";

interface NewPasswordPageProps {
  isRTL?: boolean;
}

export default function NewPasswordPage({
  isRTL = false,
}: NewPasswordPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-card">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">
            {isRTL ? "تعيين كلمة مرور جديدة" : "Set New Password"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {isRTL
              ? "أدخل كلمة المرور الجديدة الخاصة بك"
              : "Enter your new password"}
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isRTL ? "تذكرت كلمة المرور؟" : "Remembered your password?"}{" "}
            <Link to="/login" className="text-primary hover:underline">
              {isRTL ? "تسجيل الدخول" : "Login"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
