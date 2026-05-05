import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ProfilePage from './pages/profile/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

import UserManagementPage from './pages/admin/UserManagement';
import LeavePage from './pages/leave/LeavePage';
import ReimbursePage from './pages/reimburse/ReimbursePage';
import PenaltyPage from './pages/penalty/PenaltyPage';
import PayrollPage from './pages/payroll/PayrollPage';
import DirectoryPage from './pages/directory/DirectoryPage';
import AttendancePage from './pages/attendance/AttendancePage';

const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.role) return <Navigate to="/login" replace />;

  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute allowedRoles={["ADMIN","MANAGER","STAFF"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/reimburse" element={<ReimbursePage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/penalty" element={<PenaltyPage />} />

          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin/users" element={<UserManagementPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
