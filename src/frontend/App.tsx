import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import { AuthProvider } from "@/frontend/contexts/AuthContext";
import { LanguageProvider } from "@/frontend/contexts/LanguageContext";
import { AIProvider } from "@/frontend/contexts/AIContext";
import { RoleProvider } from "@/frontend/contexts/RoleContext";
import ProtectedRoute from "@/frontend/components/ProtectedRoute";
import DashboardLayout from "@/frontend/modules/layout/DashboardLayout";
import AuthSessionCheck from "@/frontend/modules/auth/components/AuthSessionCheck";
import { ToastProvider } from "@/frontend/components/ui/use-toast";
import StagingEnvironmentNotice from "@/frontend/components/StagingEnvironmentNotice";
import { userAnalyticsTracker } from "@/frontend/services/userAnalyticsTracker";
import { QueryProvider } from "@/frontend/contexts/QueryProvider";

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
import {
  DocumentationCenterDashboard,
  DocumentationCenterTestPanel,
} from "@/frontend/modules/documentation-center";
import { HelpCenterDashboard } from "@/frontend/modules/help-center";
import { MonitoringDashboard } from "@/frontend/modules/developer/components/MonitoringDashboard";
import { UserAnalyticsDashboard } from "@/frontend/modules/admin";

// Import test panel components
import StoreTestPanel from "@/frontend/modules/store/components/StoreTestPanel";
import AccountingTestPanel from "@/frontend/modules/accounting/components/AccountingTestPanel";
import MarketingTestPanel from "@/frontend/modules/marketing/components/MarketingTestPanel";
import InboxTestPanel from "@/frontend/modules/inbox/components/InboxTestPanel";
import DocumentsTestPanel from "@/frontend/modules/documents/components/DocumentsTestPanel";
import CustomerServiceTestPanel from "@/frontend/modules/customer-service/components/CustomerServiceTestPanel";
import IntegrationsTestPanel from "@/frontend/modules/integrations/components/IntegrationsTestPanel";
import TestCoverageDashboard from "@/frontend/modules/developer/components/TestCoverageDashboard";
import RTLShowcase from "@/frontend/modules/developer/components/RTLShowcase";
import DashboardTestPanel from "@/frontend/modules/dashboard/components/DashboardTestPanel";
import StorefrontTestPanel from "@/frontend/modules/store/components/StorefrontTestPanel";

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
      <QueryProvider>
        <AuthProvider>
          <RoleProvider>
            <LanguageProvider>
              <AIProvider>
                <StagingEnvironmentNotice className="sticky top-0 z-50" />
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
                          <ProtectedRoute requiredModule="Store">
                            <DashboardLayout currentModule="Store">
                              <StoreDashboard />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/accounting/*"
                        element={
                          <ProtectedRoute requiredModule="Accounting">
                            <DashboardLayout currentModule="Accounting">
                              <AccountingDashboard />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/marketing/*"
                        element={
                          <ProtectedRoute requiredModule="Marketing">
                            <DashboardLayout currentModule="Marketing">
                              <MarketingDashboard />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/inbox/*"
                        element={
                          <ProtectedRoute requiredModule="Inbox">
                            <DashboardLayout currentModule="Inbox">
                              <InboxDashboard />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/analytics/*"
                        element={
                          <ProtectedRoute requiredModule="Analytics">
                            <DashboardLayout currentModule="Analytics">
                              <AnalyticsDashboard />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/customers/*"
                        element={
                          <ProtectedRoute requiredModule="Customers">
                            <DashboardLayout currentModule="Customers">
                              <CustomersDashboard />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/documents/*"
                        element={
                          <ProtectedRoute requiredModule="Documents">
                            <DashboardLayout currentModule="Documents">
                              <DocumentsDashboard />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/integrations/*"
                        element={
                          <ProtectedRoute requiredModule="Integrations">
                            <DashboardLayout currentModule="Integrations">
                              <IntegrationsDashboard />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/developer/*"
                        element={
                          <ProtectedRoute requiredModule="Developer">
                            <DashboardLayout currentModule="Developer">
                              <DeveloperDashboard />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/settings/*"
                        element={
                          <ProtectedRoute requiredModule="Settings">
                            <DashboardLayout currentModule="Settings">
                              <SettingsDashboard />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/customer-service/*"
                        element={
                          <ProtectedRoute requiredModule="Customer Service">
                            <DashboardLayout currentModule="Customer Service">
                              <CustomerServiceDashboard />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/documentation/*"
                        element={
                          <ProtectedRoute requiredModule="Documentation">
                            <DashboardLayout currentModule="Documentation">
                              <DocumentationCenterDashboard />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/help-center/*"
                        element={
                          <ProtectedRoute requiredModule="Help Center">
                            <DashboardLayout currentModule="Help Center">
                              <HelpCenterDashboard />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/documentation/test-panel/*"
                        element={
                          <ProtectedRoute>
                            <DashboardLayout currentModule="Documentation">
                              <DocumentationCenterTestPanel isRTL={false} />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />

                      {/* Test Panel Routes */}
                      <Route
                        path="/dashboard/developer/test-coverage/*"
                        element={
                          <ProtectedRoute>
                            <DashboardLayout currentModule="Developer">
                              <TestCoverageDashboard isRTL={false} />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/developer/rtl-showcase/*"
                        element={
                          <ProtectedRoute>
                            <DashboardLayout currentModule="Developer">
                              <RTLShowcase />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/developer/monitoring/*"
                        element={
                          <ProtectedRoute>
                            <DashboardLayout currentModule="Developer">
                              <MonitoringDashboard isRTL={false} />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/admin/user-analytics/*"
                        element={
                          <ProtectedRoute requiredModule="User Analytics">
                            <DashboardLayout currentModule="Admin">
                              <UserAnalyticsDashboard isRTL={false} />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/store/test-panel/*"
                        element={
                          <ProtectedRoute>
                            <DashboardLayout currentModule="Store">
                              <StoreTestPanel isRTL={false} />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/accounting/test-panel/*"
                        element={
                          <ProtectedRoute>
                            <DashboardLayout currentModule="Accounting">
                              <AccountingTestPanel isRTL={false} />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/marketing/test-panel/*"
                        element={
                          <ProtectedRoute>
                            <DashboardLayout currentModule="Marketing">
                              <MarketingTestPanel isRTL={false} />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/inbox/test-panel/*"
                        element={
                          <ProtectedRoute>
                            <DashboardLayout currentModule="Inbox">
                              <InboxTestPanel isRTL={false} />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/documents/test-panel/*"
                        element={
                          <ProtectedRoute>
                            <DashboardLayout currentModule="Documents">
                              <DocumentsTestPanel isRTL={false} />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/customer-service/test-panel/*"
                        element={
                          <ProtectedRoute>
                            <DashboardLayout currentModule="Customer Service">
                              <CustomerServiceTestPanel isRTL={false} />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/integrations/test-panel/*"
                        element={
                          <ProtectedRoute>
                            <DashboardLayout currentModule="Integrations">
                              <IntegrationsTestPanel isRTL={false} />
                            </DashboardLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/dashboard/test-panel/*"
                        element={
                          <ProtectedRoute>
                            <DashboardLayout currentModule="Dashboard">
                              <DashboardTestPanel isRTL={false} />
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
                      <Route
                        path="/dashboard/storefront/test-panel/*"
                        element={
                          <ProtectedRoute>
                            <DashboardLayout currentModule="Storefront">
                              <StorefrontTestPanel isRTL={false} />
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
          </RoleProvider>
        </AuthProvider>
      </QueryProvider>
    </ToastProvider>
  );
}

export default App;
