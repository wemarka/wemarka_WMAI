import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { Button } from "@/frontend/components/ui/button";

export default function Home() {
  const { language, direction } = useLanguage();
  const isRTL = direction === "rtl";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-8 max-w-3xl px-4">
        <div>
          <h1 className="text-5xl font-bold text-primary mb-4">
            {isRTL ? "ويماركا WMAI" : "Wemarka WMAI"}
          </h1>
          <p className="text-xl text-muted-foreground">
            {isRTL
              ? "نظام تشغيل الأعمال الموحد"
              : "Unified Business Operating System"}
          </p>
        </div>

        <div className="space-y-6">
          <p className="text-lg">
            {isRTL
              ? "منصة شاملة تجمع كل ما تحتاجه لإدارة أعمالك في مكان واحد، مدعومة بالذكاء الاصطناعي."
              : "A comprehensive platform that brings everything you need to manage your business in one place, powered by AI."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 text-primary-700 dark:text-primary-300">
                {isRTL ? "متجر متكامل" : "Integrated Store"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isRTL
                  ? "إدارة المنتجات، المخزون، الطلبات، والمزيد."
                  : "Manage products, inventory, orders, and more."}
              </p>
            </div>

            <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 text-primary-700 dark:text-primary-300">
                {isRTL ? "محاسبة ذكية" : "Smart Accounting"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isRTL
                  ? "فواتير، مصروفات، تقارير مالية، وتحليلات."
                  : "Invoices, expenses, financial reports, and analytics."}
              </p>
            </div>

            <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 text-primary-700 dark:text-primary-300">
                {isRTL ? "مساعد ذكي" : "AI Assistant"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isRTL
                  ? "مساعد ذكي يساعدك في جميع جوانب عملك."
                  : "Smart assistant that helps you in all aspects of your business."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="px-8">
            <Link to="/login">{isRTL ? "تسجيل الدخول" : "Login"}</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8">
            <Link to="/register">
              {isRTL ? "إنشاء حساب" : "Create Account"}
            </Link>
          </Button>
        </div>
      </div>

      <footer className="mt-auto w-full py-6 border-t bg-muted/30">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>
            © 2024 Wemarka WMAI.{" "}
            {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved"}.
          </p>
        </div>
      </footer>
    </div>
  );
}
