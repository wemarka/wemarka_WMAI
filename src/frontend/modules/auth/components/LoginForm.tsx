import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Alert, AlertDescription } from "@/frontend/components/ui/alert";
import { cn } from "@/frontend/lib/utils";
import SocialLoginButtons from "./SocialLoginButtons";

export default function LoginForm({ isRTL = false }: { isRTL?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Check for redirect messages
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get("message");
    if (message === "password_reset") {
      setRedirectMessage(
        isRTL
          ? "تم تغيير كلمة المرور بنجاح. يرجى تسجيل الدخول بكلمة المرور الجديدة."
          : "Password has been reset successfully. Please login with your new password.",
      );
    } else if (message === "account_created") {
      setRedirectMessage(
        isRTL
          ? "تم إنشاء حسابك بنجاح. يرجى تسجيل الدخول."
          : "Your account has been created successfully. Please login.",
      );
    } else if (message === "session_expired") {
      setRedirectMessage(
        isRTL
          ? "انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى."
          : "Your session has expired. Please login again.",
      );
    }
  }, [location.search, isRTL]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);

      if (error) throw error;

      // Get the intended destination from location state or default to dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from);
    } catch (err: any) {
      setError(
        err.message ||
          (isRTL
            ? "حدث خطأ أثناء تسجيل الدخول"
            : "An error occurred during login"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-card"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary">
          {isRTL ? "تسجيل الدخول" : "Login"}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {isRTL
            ? "أدخل بياناتك للوصول إلى لوحة التحكم"
            : "Enter your credentials to access the dashboard"}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {redirectMessage && (
        <Alert>
          <AlertDescription>{redirectMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            {isRTL ? "البريد الإلكتروني" : "Email"}
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={isRTL ? "بريدك@مثال.com" : "your@email.com"}
            className={cn("w-full")}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium">
              {isRTL ? "كلمة المرور" : "Password"}
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              {isRTL ? "نسيت كلمة المرور؟" : "Forgot password?"}
            </Link>
          </div>
          {isRTL && (
            <p className="text-xs text-muted-foreground mt-1">
              أدخل كلمة المرور الخاصة بك للوصول إلى حسابك
            </p>
          )}
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className={cn("w-full")}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? isRTL
              ? "جاري تسجيل الدخول..."
              : "Logging in..."
            : isRTL
              ? "تسجيل الدخول"
              : "Login"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isRTL ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
            <Link to="/register" className="text-primary hover:underline">
              {isRTL ? "إنشاء حساب جديد" : "Create a new account"}
            </Link>
          </p>
        </div>
      </form>

      <SocialLoginButtons
        isRTL={isRTL}
        onError={(errorMsg) => setError(errorMsg)}
      />
    </div>
  );
}
