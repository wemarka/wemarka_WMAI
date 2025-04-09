import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Alert, AlertDescription } from "@/frontend/components/ui/alert";
import { cn } from "@/frontend/lib/utils";
import SocialLoginButtons from "./SocialLoginButtons";

export default function RegisterForm({ isRTL = false }: { isRTL?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signUp, user } = useAuth();

  // Check if user is already logged in
  useState(() => {
    if (user) {
      navigate("/dashboard");
    }
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError(isRTL ? "كلمات المرور غير متطابقة" : "Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password, name);

      if (error) throw error;

      // Redirect to login with success message
      navigate("/login?message=account_created");
    } catch (err: any) {
      setError(
        err.message ||
          (isRTL
            ? "حدث خطأ أثناء إنشاء الحساب"
            : "An error occurred during registration"),
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
          {isRTL ? "إنشاء حساب جديد" : "Create Account"}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {isRTL
            ? "أدخل بياناتك لإنشاء حساب جديد"
            : "Enter your details to create a new account"}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            {isRTL ? "الاسم" : "Name"}
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={isRTL ? "الاسم الكامل" : "Full name"}
            className={cn("w-full")}
          />
        </div>

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
          <label htmlFor="password" className="block text-sm font-medium">
            {isRTL ? "كلمة المرور" : "Password"}
          </label>
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

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium"
          >
            {isRTL ? "تأكيد كلمة المرور" : "Confirm Password"}
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
            className={cn("w-full")}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? isRTL
              ? "جاري إنشاء الحساب..."
              : "Creating account..."
            : isRTL
              ? "إنشاء حساب"
              : "Create Account"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isRTL ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
            <Link to="/login" className="text-primary hover:underline">
              {isRTL ? "تسجيل الدخول" : "Login"}
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
