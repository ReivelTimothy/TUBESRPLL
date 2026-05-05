import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type NavItem = {
  to: string;
  label: string;
  roles?: Array<'ADMIN' | 'MANAGER' | 'STAFF'>;
};

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/leave', label: 'Leave' },
  { to: '/reimburse', label: 'Reimburse' },
  { to: '/penalty', label: 'Penalty' },
  { to: '/profile', label: 'Profile' },
  { to: '/admin/users', label: 'User Management', roles: ['ADMIN'] },
];

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const filteredNav = useMemo(() => {
    return navItems.filter((item) => {
      if (!item.roles) return true;
      return user?.role ? item.roles.includes(user.role as 'ADMIN' | 'MANAGER' | 'STAFF') : false;
    });
  }, [user?.role]);

  const heading = useMemo(() => {
    const found = navItems.find((item) => location.pathname.startsWith(item.to));
    return found?.label || 'Dashboard';
  }, [location.pathname]);

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white/90 p-4 backdrop-blur lg:w-72 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex items-center justify-between lg:mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">HR Suite</p>
              <h1 className="text-xl font-bold text-slate-900">Company Portal</h1>
            </div>
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-2 py-1 text-sm lg:hidden"
              onClick={() => setOpen((prev) => !prev)}
            >
              Menu
            </button>
          </div>

          <nav className={`${open ? 'block' : 'hidden'} space-y-1 lg:block`}>
            {filteredNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-600 text-white shadow'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Signed in as</p>
            <p className="truncate text-sm font-semibold text-slate-900">{user?.name || user?.email || 'User'}</p>
            <p className="text-xs text-brand-700">{user?.role}</p>
          </div>

          <button
            type="button"
            className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            onClick={onLogout}
          >
            Logout
          </button>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Workspace</p>
            <h2 className="text-2xl font-bold text-slate-900">{heading}</h2>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
