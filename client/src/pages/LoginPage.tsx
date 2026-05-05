import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isAuthenticated, user, error, clearError } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate, user?.role]);

    useEffect(() => {
        if (error) {
            setLoginError(error);
        }
    }, [error]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        clearError();
        
        if (!email || !password) {
            setLoginError('Email and password are required');
            return;
        }

        try {
            setIsLoading(true);
            await login({ email, password });
        } catch (error: any) {
            setLoginError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-white to-brand-100 p-4">
            <div className="absolute -left-20 top-14 h-64 w-64 rounded-full bg-brand-200/50 blur-3xl" />
            <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-slate-300/40 blur-3xl" />

            <div className="relative w-full max-w-md rounded-3xl border border-white/50 bg-white/90 p-8 shadow-panel backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">Company HR Portal</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">Sign in</h1>
                <p className="mt-1 text-sm text-slate-600">Access your HR dashboard with your company account.</p>

                {loginError && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{loginError}</p>}

                <form onSubmit={handleLogin} className="mt-5 grid gap-4">
                    <label className="grid gap-1 text-sm">
                        <span className="font-medium text-slate-700">Email</span>
                        <input
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (loginError) setLoginError('');
                                if (error) clearError();
                            }}
                            disabled={isLoading}
                            className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-brand-200 focus:ring"
                            required
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="font-medium text-slate-700">Password</span>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 focus-within:ring-2 focus-within:ring-brand-200">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (loginError) setLoginError('');
                                    if (error) clearError();
                                }}
                                disabled={isLoading}
                                className="w-full bg-transparent outline-none"
                                required
                            />
                            <button
                                type="button"
                                className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                                onClick={() => setShowPassword((prev) => !prev)}
                                tabIndex={-1}
                                disabled={isLoading}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </label>

                    <button
                        type="submit"
                        className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-slate-500">Use your company credentials to continue.</p>
            </div>
        </div>
    );
};

export default LoginPage;