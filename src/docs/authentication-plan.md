# خطة تنفيذ نظام المصادقة

## نظرة عامة

سيتم تنفيذ نظام مصادقة آمن وقابل للتوسع باستخدام Supabase Auth، مما يوفر:
- تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
- تسجيل الدخول باستخدام مزودي الهوية الاجتماعية (Google, Facebook, Twitter)
- إدارة الجلسات والتوكنات
- استعادة كلمة المرور
- التحقق من البريد الإلكتروني
- تسجيل المستخدمين الجدد

## المكونات الرئيسية

### 1. صفحة تسجيل الدخول

```tsx
// src/modules/auth/components/LoginForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-card">
      <div className="text-center">
        <h2 className="text-3xl font-bold">تسجيل الدخول</h2>
        <p className="mt-2 text-muted-foreground">أدخل بياناتك للوصول إلى لوحة التحكم</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">البريد الإلكتروني</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium">كلمة المرور</label>
            <a href="/forgot-password" className="text-sm text-primary hover:underline">
              نسيت كلمة المرور؟
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            ليس لديك حساب؟{' '}
            <a href="/register" className="text-primary hover:underline">
              إنشاء حساب جديد
            </a>
          </p>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-white text-muted-foreground">أو تسجيل الدخول باستخدام</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" className="w-full">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            {/* Google icon */}
          </svg>
          Google
        </Button>
        <Button variant="outline" type="button" className="w-full">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            {/* Facebook icon */}
          </svg>
          Facebook
        </Button>
      </div>
    </div>
  );
}
```

### 2. صفحة التسجيل

```tsx
// src/modules/auth/components/RegisterForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-card">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-success">تم إنشاء الحساب بنجاح!</h2>
          <p className="mt-4 text-muted-foreground">
            تم إرسال رابط تأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك.
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="mt-6"
          >
            العودة إلى صفحة تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-card">
      <div className="text-center">
        <h2 className="text-3xl font-bold">إنشاء حساب جديد</h2>
        <p className="mt-2 text-muted-foreground">أدخل بياناتك لإنشاء حساب جديد</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm font-medium">الاسم الكامل</label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="محمد أحمد"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">البريد الإلكتروني</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">كلمة المرور</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            minLength={8}
          />
          <p className="text-xs text-muted-foreground">يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل</p>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            لديك حساب بالفعل؟{' '}
            <a href="/login" className="text-primary hover:underline">
              تسجيل الدخول
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
```

## خطوات التنفيذ

1. **إعداد Supabase**:
   - إنشاء مشروع جديد في Supabase
   - تكوين خدمة المصادقة
   - الحصول على مفاتيح API

2. **إنشاء مكتبة Supabase**:
   - إنشاء ملف `src/lib/supabase.ts` لتكوين عميل Supabase

3. **تنفيذ مكونات المصادقة**:
   - إنشاء نماذج تسجيل الدخول والتسجيل
   - إنشاء صفحة استعادة كلمة المرور
   - إنشاء صفحة تأكيد البريد الإلكتروني

4. **إنشاء سياق المصادقة**:
   - إنشاء `AuthContext` لإدارة حالة المصادقة في جميع أنحاء التطبيق
   - تنفيذ وظائف المصادقة (تسجيل الدخول، تسجيل الخروج، التحقق من الجلسة)

5. **حماية المسارات**:
   - إنشاء مكون `ProtectedRoute` للتحقق من حالة المصادقة
   - تطبيق المكون على المسارات التي تتطلب المصادقة

6. **اختبار نظام المصادقة**:
   - اختبار تسجيل الدخول والتسجيل
   - اختبار استعادة كلمة المرور
   - اختبار حماية المسارات

## الجدول الزمني

| المهمة | المدة التقديرية |
|--------|----------------|
| إعداد Supabase | 1 يوم |
| إنشاء مكتبة Supabase | 0.5 يوم |
| تنفيذ مكونات المصادقة | 3 أيام |
| إنشاء سياق المصادقة | 1 يوم |
| حماية المسارات | 0.5 يوم |
| اختبار نظام المصادقة | 1 يوم |

**إجمالي الوقت التقديري**: 7 أيام
