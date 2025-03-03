import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";

// Layout
import AppLayout from "./components/layout/AppLayout";
import RouteGuard from "./components/RouteGuard";

// Main Pages
import Home from "./pages/Home";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import Plans from './pages/Plans';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import TermsPrivacy from './pages/TermsPrivacy';
import ContactSupport from './pages/ContactSupport';
import Dashboard from './pages/Admin/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManagePlans from './pages/Admin/ManagePlans';
import ManageNotifications from './pages/Admin/ManageNotifications';
import ManageHighlights from './pages/Admin/ManageHighlights';
import ActivityLogs from './pages/Admin/ActivityLogs';
import Reports from './pages/Admin/Reports';

// Mobile Menu
import MobileMenu from './pages/MobileMenu';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <RouteGuard>
                  <AppLayout>
                    <Home />
                  </AppLayout>
                </RouteGuard>
              } 
            />
            <Route 
              path="/plans" 
              element={
                <RouteGuard>
                  <AppLayout>
                    <Plans />
                  </AppLayout>
                </RouteGuard>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <RouteGuard>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </RouteGuard>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <RouteGuard>
                  <AppLayout>
                    <Notifications />
                  </AppLayout>
                </RouteGuard>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <RouteGuard>
                  <AppLayout>
                    <Settings />
                  </AppLayout>
                </RouteGuard>
              } 
            />
            <Route 
              path="/terms-privacy" 
              element={
                <RouteGuard>
                  <AppLayout>
                    <TermsPrivacy />
                  </AppLayout>
                </RouteGuard>
              } 
            />
            <Route 
              path="/contact-support" 
              element={
                <RouteGuard>
                  <AppLayout>
                    <ContactSupport />
                  </AppLayout>
                </RouteGuard>
              } 
            />
            
            {/* Mobile Menu Route */}
            <Route
              path="/mobile-menu"
              element={
                <RouteGuard>
                  <AppLayout>
                    <MobileMenu />
                  </AppLayout>
                </RouteGuard>
              }
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <RouteGuard allowedRoles={['admin']}>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </RouteGuard>
              } 
            />
            <Route 
              path="/admin/manage-users" 
              element={
                <RouteGuard allowedRoles={['admin']}>
                  <AppLayout>
                    <ManageUsers />
                  </AppLayout>
                </RouteGuard>
              } 
            />
            <Route 
              path="/admin/manage-plans" 
              element={
                <RouteGuard allowedRoles={['admin']}>
                  <AppLayout>
                    <ManagePlans />
                  </AppLayout>
                </RouteGuard>
              } 
            />
            <Route 
              path="/admin/manage-highlights" 
              element={
                <RouteGuard allowedRoles={['admin']}>
                  <AppLayout>
                    <ManageHighlights />
                  </AppLayout>
                </RouteGuard>
              } 
            />
            <Route 
              path="/admin/manage-notifications" 
              element={
                <RouteGuard allowedRoles={['admin']}>
                  <AppLayout>
                    <ManageNotifications />
                  </AppLayout>
                </RouteGuard>
              } 
            />
            <Route 
              path="/admin/activity-logs" 
              element={
                <RouteGuard allowedRoles={['admin']}>
                  <AppLayout>
                    <ActivityLogs />
                  </AppLayout>
                </RouteGuard>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <RouteGuard allowedRoles={['admin','partner']}>
                  <AppLayout>
                    <Reports />
                  </AppLayout>
                </RouteGuard>
              } 
            />
            
            {/* Access Control */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
