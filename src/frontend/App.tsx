import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import { AuthProvider } from "@/frontend/contexts/AuthContext";
import { LanguageProvider } from "@/frontend/contexts/LanguageContext";
import { AIProvider } from "@/frontend/contexts/AIContext";
import ProtectedRoute from "@/frontend/components/ProtectedRoute";
import DashboardLayout from "@/frontend/modules/layout/DashboardLayout";
import AuthSessionCheck from "@/frontend/modules/auth/components/AuthSessionCheck";
import { ToastProvider } from "@/frontend/components/ui/use-toast";

// Import dashboard components
import StoreDashboard from "@/frontend/modules/store/components/StoreDashboard";
import AccountingDashboard from "@/frontend/modules/accounting/components/AccountingDashboard";
import MarketingDashboard from "@/frontend/modules/marketing/components/MarketingDashboard";
import InboxDashboard from "@/frontend/modules/inbox/components/InboxDashboard";
import AnalyticsDashboard from "@/frontend/modules/analytics/components/AnalyticsDashboard";
import CustomersDashboard from "@/frontend/modules/customers/components/CustomersDashboard";
import DocumentsDashboard from "@/frontend/modules/documents/components/DocumentsDashboard";
import IntegrationsDashboard from "@/frontend/modules/integrations/components/IntegrationsDashboard";
import DeveloperDashboard from "@/frontend/modules/developer/components/DeveloperDashboard";
import SettingsDashboard from "@/frontend/modules/settings/components/SettingsDashboard";
import { CustomerServiceDashboard } from "@/frontend/modules/customer-service";

// Lazy load auth components
const LoginPage = lazy(
  () => import("@/frontend/modules/auth/components/LoginPage"),
);
const RegisterPage = lazy(
  () => import("@/frontend/modules/auth/components/RegisterPage"),
);
const ResetPasswordPage = lazy(
  () => import("@/frontend/modules/auth/components/ResetPasswordPage"),
);
const NewPasswordPage = lazy(
  () => import("@/frontend/modules/auth/components/NewPasswordPage"),
);

// Lazy load storefront components
const StorefrontDashboard = lazy(
  () =>
    import(
      "@/frontend/modules/store/components/storefront/StorefrontDashboard"
    ),
);
const ProductList = lazy(
  () => import("@/frontend/modules/store/components/storefront/ProductList"),
);
const ProductDetail = lazy(
  () => import("@/frontend/modules/store/components/storefront/ProductDetail"),
);
const ShoppingCart = lazy(
  () => import("@/frontend/modules/store/components/storefront/ShoppingCart"),
);
const Checkout = lazy(
  () => import("@/frontend/modules/store/components/storefront/Checkout"),
);
const HomePageEditor = lazy(
  () => import("@/frontend/modules/store/components/storefront/HomePageEditor"),
);

// Loading component with better styling
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="text-center">
      <div className="animate-spin h-12 w-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <LanguageProvider>
          <AIProvider>
            <AuthSessionCheck />
            <Suspense fallback={<LoadingFallback />}>
              <>
                <Routes>
                  <Route
                    path="/*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route
                    path="/login/*"
                    element={<LoginPage isRTL={false} />}
                  />
                  <Route
                    path="/register/*"
                    element={<RegisterPage isRTL={false} />}
                  />
                  <Route
                    path="/forgot-password/*"
                    element={<ResetPasswordPage isRTL={false} />}
                  />
                  <Route
                    path="/reset-password/*"
                    element={<NewPasswordPage isRTL={false} />}
                  />
                  <Route
                    path="/dashboard/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Dashboard">
                          <div>Dashboard Content</div>
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/store/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Store">
                          <StoreDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/accounting/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Accounting">
                          <AccountingDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/marketing/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Marketing">
                          <MarketingDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/inbox/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Inbox">
                          <InboxDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/analytics/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Analytics">
                          <AnalyticsDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/customers/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Customers">
                          <CustomersDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/documents/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Documents">
                          <DocumentsDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/integrations/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Integrations">
                          <IntegrationsDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/developer/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Developer">
                          <DeveloperDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/settings/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Settings">
                          <SettingsDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/customer-service/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Customer Service">
                          <CustomerServiceDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/storefront/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Storefront">
                          <StorefrontDashboard isRTL={false} />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/storefront/products/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Storefront">
                          <ProductList isRTL={false} />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/storefront/product/:id/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Storefront">
                          <ProductDetail isRTL={false} />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/storefront/cart/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Storefront">
                          <ShoppingCart />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/storefront/checkout/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Storefront">
                          <Checkout />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/storefront/home-editor/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout currentModule="Storefront">
                          <HomePageEditor isRTL={false} />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  {import.meta.env.VITE_TEMPO === "true" && (
                    <Route path="/tempobook/*" />
                  )}
                </Routes>
                {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
              </>
            </Suspense>
          </AIProvider>
        </LanguageProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
