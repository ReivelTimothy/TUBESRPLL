import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { Button } from '../components/button';

const Dashboard = () => {
  const dispatch = useDispatch();
  // Ambil data user dari Redux Store
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout()); // Hapus data di Redux & LocalStorage
    window.location.href = '/login'; // Tendang balik ke login
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">
          Selamat Datang, <span className="text-blue-600">{user?.name || 'User'}</span>!
        </h1>
        <p className="text-gray-500 mt-1">Role Anda: **{user?.role}**</p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-blue-800">Status Absensi</h3>
            <p className="text-sm text-blue-600 mt-1">Anda belum melakukan absen hari ini.</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-800">Informasi Perangkat</h3>
            <p className="text-sm text-gray-600 mt-1 text-xs">IP: 114.122.xxx.xxx (Terverifikasi)</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button onClick={() => alert('Fitur Fingerprint menyusul!')}>
            Mulai Absen Biometrik
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Keluar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;