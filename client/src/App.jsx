import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import './marketing.css';
import { AuthProvider, AuthContext } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/PublicLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Home from './pages/public/Home';
import Pricing from './pages/public/Pricing';
import Register from './pages/public/Register';
import Checkout from './pages/public/Checkout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import TenantDashboard from './pages/TenantDashboard';
import RentCollection from './pages/RentCollection';
import MaintenanceRequests from './pages/MaintenanceRequests';
import CommunicationHub from './pages/CommunicationHub';
import DocumentVault from './pages/DocumentVault';
import FinancialAnalytics from './pages/FinancialAnalytics';
import AcceptInvite from './pages/AcceptInvite';
import PropertyDetails from './pages/PropertyDetails';
import PropertiesList from './pages/PropertiesList';
import TenantsList from './pages/TenantsList';
import Settings from './pages/Settings';

// ── Role dashboard path map ────────────────────────────────────────────────
const ROLE_HOME = {
  admin: '/admin-dashboard',
  owner: '/owner-dashboard',
  manager: '/manager-dashboard',
  tenant: '/tenant-dashboard',
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />;
  }
  return children;
};

const RootRedirect = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />;
};

const AppRoutes = () => {
  const location = useLocation();

  React.useEffect(() => {
    const path = location.pathname;
    let title = 'HantiOS';
    if (path.includes('dashboard')) {
      const role = path.split('-')[0].replace('/', '');
      title = `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard | HantiOS`;
    } else if (path === '/properties') {
      title = 'Properties | HantiOS';
    } else if (path === '/tenants') {
      title = 'Tenants | HantiOS';
    } else if (path === '/settings') {
      title = 'Settings | HantiOS';
    } else if (path === '/rent') {
      title = 'Rent Collection | HantiOS';
    } else if (path === '/maintenance') {
      title = 'Maintenance Requests | HantiOS';
    } else if (path === '/communication') {
      title = 'Communication Hub | HantiOS';
    } else if (path === '/documents') {
      title = 'Document Vault | HantiOS';
    } else if (path === '/financials') {
      title = 'Financial Analytics | HantiOS';
    } else if (path === '/login') {
      title = 'Login | HantiOS';
    } else if (path.startsWith('/properties/')) {
      title = 'Property Details | HantiOS';
    }
    document.title = title;
  }, [location]);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkout" element={<ProtectedRoute allowedRoles={['owner']}><Checkout /></ProtectedRoute>} />
      <Route path="/accept-invite/:token" element={<AcceptInvite />} />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>

        {/* ── Dashboards ────────────────────────────────────────────── */}
        <Route path="/admin-dashboard"   element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/owner-dashboard"   element={<ProtectedRoute allowedRoles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/manager-dashboard" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/tenant-dashboard"  element={<ProtectedRoute allowedRoles={['tenant']}><TenantDashboard /></ProtectedRoute>} />

        {/* ── Property drill-down ───────────────────────────────────── */}
        <Route path="/properties/:id" element={<ProtectedRoute allowedRoles={['owner', 'manager']}><PropertyDetails /></ProtectedRoute>} />

        {/* ── Shared routes ─────────────────────────────────────────── */}
        <Route path="/properties"  element={<ProtectedRoute allowedRoles={['owner', 'manager']}><PropertiesList /></ProtectedRoute>} />
        <Route path="/tenants"     element={<ProtectedRoute allowedRoles={['owner', 'manager']}><TenantsList /></ProtectedRoute>} />
        <Route path="/settings"    element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/rent"        element={<ProtectedRoute allowedRoles={['manager']}><RentCollection /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute allowedRoles={['owner', 'manager', 'tenant']}><MaintenanceRequests /></ProtectedRoute>} />
        <Route path="/communication" element={<ProtectedRoute allowedRoles={['owner', 'manager', 'tenant']}><CommunicationHub /></ProtectedRoute>} />
        <Route path="/documents"   element={<ProtectedRoute allowedRoles={['owner', 'manager', 'tenant']}><DocumentVault /></ProtectedRoute>} />
        <Route path="/financials"  element={<ProtectedRoute allowedRoles={['owner']}><FinancialAnalytics /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          {/* MED-3: Global toast system — replaces all alert() calls */}
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
