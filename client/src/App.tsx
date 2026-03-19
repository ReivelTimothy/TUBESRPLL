import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './store/store';
import { LoginPage } from './pages/login';
import Dashboard from './pages/dashboard'; // Asumsi kamu sudah buat file-nya

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Komponen Pembungkus untuk proteksi halaman
const ProtectedRoute = ({ children } : ProtectedRouteProps) => {
  // Mengambil status login langsung dari Redux Reducer 'auth'
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    // Provider menghubungkan "Store" ke seluruh komponen di dalamnya
    <Provider store={store}>  
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Halaman Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Halaman Dashboard (Hanya bisa dibuka jika sudah Login) */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Redirect otomatis */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;