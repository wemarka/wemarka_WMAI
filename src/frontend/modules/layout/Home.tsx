import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { Button } from "@/frontend/components/ui/button";
import {
  Sparkles,
  Store,
  CreditCard,
  BarChart3,
  MessageSquare,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const { language, direction } = useLanguage();
  const isRTL = direction === "rtl";

  const features = [
    {
      icon: <Store className="h-6 w-6" />,
      title: isRTL ? "متجر متكامل" : "Integrated Store",
      description: isRTL
        ? "إدارة المنتجات، المخزون، الطلبات، والمزيد."
        : "Manage products, inventory, orders, and more.",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: isRTL ? "محاسبة ذكية" : "Smart Accounting",
      description: isRTL
        ? "فواتير، مصروفات، تقارير مالية، وتحليلات."
        : "Invoices, expenses, financial reports, and analytics.",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: isRTL ? "مساعد ذكي" : "AI Assistant",
      description: isRTL
        ? "مساعد ذكي يساعدك في جميع جوانب عملك."
        : "Smart assistant that helps you in all aspects of your business.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: isRTL ? "تحليلات متقدمة" : "Advanced Analytics",
      description: isRTL
        ? "رؤى قوية لاتخاذ قرارات أفضل لعملك."
        : "Powerful insights to make better decisions for your business.",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: isRTL ? "صندوق وارد موحد" : "Unified Inbox",
      description: isRTL
        ? "إدارة جميع رسائلك من مكان واحد."
        : "Manage all your messages from one place.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: isRTL ? "إدارة العملاء" : "Customer Management",
      description: isRTL
        ? "تتبع وإدارة علاقات العملاء بكفاءة."
        : "Track and manage customer relationships efficiently.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 relative z-10">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-800/40 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
              {isRTL
                ? "نظام تشغيل الأعمال الموحد"
                : "Unified Business Operating System"}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-800 dark:text-primary-200 mb-4 tracking-tight">
              {isRTL ? "ويماركا WMAI" : "Wemarka WMAI"}
            </h1>
            <p className="text-xl md:text-2xl text-primary-700 dark:text-primary-300 max-w-3xl mx-auto">
              {isRTL
                ? "منصة شاملة تجمع كل ما تحتاجه لإدارة أعمالك في مكان واحد، مدعومة بالذكاء الاصطناعي."
                : "A comprehensive platform that brings everything you need to manage your business in one place, powered by AI."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                asChild
                size="lg"
                className="px-8 py-6 text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/login" className="flex items-center gap-2">
                  {isRTL ? "تسجيل الدخول" : "Login"}
                  <ArrowRight
                    className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`}
                  />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-6 text-base rounded-xl border-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              >
                <Link to="/register">
                  {isRTL ? "إنشاء حساب" : "Create Account"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-800 dark:text-primary-200 mb-4">
              {isRTL
                ? "ميزات قوية لنمو أعمالك"
                : "Powerful Features for Your Business Growth"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {isRTL
                ? "كل ما تحتاجه لإدارة وتنمية عملك في منصة واحدة متكاملة."
                : "Everything you need to manage and grow your business in one integrated platform."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card hover:bg-primary-50/50 dark:hover:bg-primary-900/10 border border-border rounded-xl p-6 shadow-subtle hover:shadow-card transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary-700 dark:text-primary-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50 dark:bg-primary-900/20 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-800 dark:text-primary-200 mb-4">
            {isRTL ? "جاهز للبدء؟" : "Ready to Get Started?"}
          </h2>
          <p className="text-lg text-primary-700 dark:text-primary-300 mb-8 max-w-3xl mx-auto">
            {isRTL
              ? "انضم إلى آلاف الشركات التي تستخدم ويماركا WMAI لتنمية أعمالها."
              : "Join thousands of businesses using Wemarka WMAI to grow their operations."}
          </p>
          <Button
            asChild
            size="lg"
            className="px-8 py-6 text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Link to="/register">
              {isRTL ? "ابدأ الآن مجاناً" : "Start Now for Free"}
            </Link>
          </Button>
        </div>
      </div>

      <footer className="w-full py-12 border-t bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center text-white font-bold mr-3">
                W
              </div>
              <span className="text-xl font-bold text-primary">
                Wemarka WMAI
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>
                © 2024 Wemarka WMAI.{" "}
                {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved"}.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
