import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import { AuthProvider } from "@/frontend/contexts/AuthContext";
import { LanguageProvider } from "@/frontend/contexts/LanguageContext";
import ProtectedRoute from "@/frontend/components/ProtectedRoute";
import DashboardLayout from "@/frontend/modules/layout/DashboardLayout";
import AuthSessionCheck from "@/frontend/modules/auth/components/AuthSessionCheck";

// Import module dashboards
import { StoreDashboard } from "@/frontend/modules/store/components/StoreDashboard";
import { MainDashboard } from "@/frontend/modules/dashboard";
import AccountingDashboard from "@/frontend/modules/accounting/components/AccountingDashboard";
import MarketingDashboard from "@/frontend/modules/marketing/components/MarketingDashboard";
import InboxDashboard from "@/frontend/modules/inbox/components/InboxDashboard";
import AnalyticsDashboard from "@/frontend/modules/analytics/components/AnalyticsDashboard";
import CustomersDashboard from "@/frontend/modules/customers/components/CustomersDashboard";
import DocumentsDashboard from "@/frontend/modules/documents/components/DocumentsDashboard";
import IntegrationsDashboard from "@/frontend/modules/integrations/components/IntegrationsDashboard";
import DeveloperDashboard from "@/frontend/modules/developer/components/DeveloperDashboard";
import SettingsDashboard from "@/frontend/modules/settings/components/SettingsDashboard";

// Lazy load home component
const Home = lazy(() => import("@/frontend/components/Home"));

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
    <AuthProvider>
      <LanguageProvider>
        <AuthSessionCheck />
        <Suspense fallback={<LoadingFallback />}>
          <>
            <Routes>
              <Route path="/*" element={<Home />} />
              <Route path="/login/*" element={<LoginPage isRTL={false} />} />
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
                      <MainDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/store/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout currentModule="Store">
                      <StoreDashboard isRTL={false} />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/accounting/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout currentModule="Accounting">
                      <AccountingDashboard isRTL={false} />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/marketing/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout currentModule="Marketing">
                      <MarketingDashboard isRTL={false} />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/inbox/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout currentModule="Inbox">
                      <InboxDashboard isRTL={false} />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/analytics/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout currentModule="Analytics">
                      <AnalyticsDashboard isRTL={false} />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/customers/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout currentModule="Customers">
                      <CustomersDashboard isRTL={false} />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/documents/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout currentModule="Documents">
                      <DocumentsDashboard isRTL={false} />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/integrations/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout currentModule="Integrations">
                      <IntegrationsDashboard isRTL={false} />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/developer/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout currentModule="Developer">
                      <DeveloperDashboard isRTL={false} />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout currentModule="Settings">
                      <SettingsDashboard isRTL={false} />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/storefront/*"
                element={
                  <ProtectedRoute>
                    <ProductList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/storefront/product/:id/*"
                element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/storefront/cart/*"
                element={
                  <ProtectedRoute>
                    <ShoppingCart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/storefront/checkout/*"
                element={
                  <ProtectedRoute>
                    <Checkout />
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
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
