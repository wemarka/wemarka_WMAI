import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "@/frontend/contexts/AuthContext";
import { LanguageProvider } from "@/frontend/contexts/LanguageContext";
import ProtectedRoute from "@/frontend/components/ProtectedRoute";
import DashboardLayout from "@/frontend/modules/layout/DashboardLayout";
import AuthSessionCheck from "@/frontend/modules/auth/components/AuthSessionCheck";

// Import module dashboards
import { StoreDashboard } from "@/frontend/modules/store/components/StoreDashboard";
import {
  MainDashboard,
  ModulesHubDashboard,
} from "@/frontend/modules/dashboard";
import AccountingDashboard from "@/frontend/modules/accounting/components/AccountingDashboard";
import MarketingDashboard from "@/frontend/modules/marketing/components/MarketingDashboard";
import InboxDashboard from "@/frontend/modules/inbox/components/InboxDashboard";
import AnalyticsDashboard from "@/frontend/modules/analytics/components/AnalyticsDashboard";
import CustomersDashboard from "@/frontend/modules/customers/components/CustomersDashboard";
import DocumentsDashboard from "@/frontend/modules/documents/components/DocumentsDashboard";
import IntegrationsDashboard from "@/frontend/modules/integrations/components/IntegrationsDashboard";
import DeveloperDashboard from "@/frontend/modules/developer/components/DeveloperDashboard";
import {
  RoadmapIntegrationDashboard,
  ModuleIntegrationVisualization,
} from "@/frontend/modules/developer";
import MigrationDashboard from "@/components/MigrationDashboard";
import MigrationRunner from "@/components/MigrationRunner";
import GitHubMigrationImporter from "@/components/GitHubMigrationImporter";
import GitHubMigrationLogs from "@/components/GitHubMigrationLogs";
import DiagnosticPanel from "@/components/DiagnosticPanel";
import SettingsDashboard from "@/frontend/modules/settings/components/SettingsDashboard";
import UserAnalyticsDashboard from "@/frontend/modules/admin/components/UserAnalyticsDashboard";

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
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage isRTL={false} />} />
            <Route path="/register" element={<RegisterPage isRTL={false} />} />
            <Route
              path="/forgot-password"
              element={<ResetPasswordPage isRTL={false} />}
            />
            <Route
              path="/reset-password"
              element={<NewPasswordPage isRTL={false} />}
            />
            <Route path="/home/*" element={<Home />} />

            {/* Storefront Routes */}
            <Route
              path="/storefront"
              element={
                <ProtectedRoute>
                  <ProductList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/storefront/product/:id"
              element={
                <ProtectedRoute>
                  <ProductDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/storefront/cart"
              element={
                <ProtectedRoute>
                  <ShoppingCart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/storefront/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            {/* Dashboard Routes - Nested under a shared layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout currentModule="Modules Hub" />
                </ProtectedRoute>
              }
            >
              {/* Default route redirects to modules hub */}
              <Route index element={<ModulesHubDashboard />} />

              {/* Module routes */}
              <Route path="dashboard" element={<MainDashboard />} />
              <Route
                path="dashboard/store/*"
                element={<StoreDashboard isRTL={false} />}
              />
              <Route
                path="dashboard/accounting/*"
                element={<AccountingDashboard isRTL={false} />}
              />
              <Route
                path="dashboard/marketing/*"
                element={<MarketingDashboard isRTL={false} />}
              />
              <Route
                path="dashboard/inbox/*"
                element={<InboxDashboard isRTL={false} />}
              />
              <Route
                path="dashboard/analytics/*"
                element={<AnalyticsDashboard isRTL={false} />}
              />
              <Route
                path="dashboard/customers/*"
                element={<CustomersDashboard isRTL={false} />}
              />
              <Route
                path="dashboard/documents/*"
                element={<DocumentsDashboard isRTL={false} />}
              />
              <Route
                path="dashboard/integrations/*"
                element={<IntegrationsDashboard isRTL={false} />}
              />
              <Route path="dashboard/developer">
                <Route index element={<DeveloperDashboard isRTL={false} />} />
                <Route
                  path="roadmap-integration"
                  element={<RoadmapIntegrationDashboard isRTL={false} />}
                />
                <Route
                  path="integration-visualization"
                  element={<ModuleIntegrationVisualization isRTL={false} />}
                />
                <Route
                  path="migration-dashboard"
                  element={<MigrationDashboard />}
                />
                <Route path="migration-runner" element={<MigrationRunner />} />
                <Route
                  path="github-importer"
                  element={<GitHubMigrationImporter />}
                />
                <Route
                  path="migration-logs"
                  element={<GitHubMigrationLogs />}
                />
                <Route path="diagnostics" element={<DiagnosticPanel />} />
              </Route>
              <Route
                path="dashboard/settings/*"
                element={<SettingsDashboard isRTL={false} />}
              />
              <Route
                path="dashboard/admin/user-analytics/*"
                element={<UserAnalyticsDashboard isRTL={false} />}
              />
            </Route>

            {/* Tempo storyboard routes */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" element={<div />} />
            )}
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" &&
            useRoutes(import("tempo-routes").default)}
        </Suspense>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
