import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/input';
import { Button } from '../components/button';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth(); // Pakai hook buatan kita

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (err) {
      // Error sudah dihandle oleh state 'error' dari hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      
      {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <Button type="submit" isLoading={loading}>Masuk</Button>
    </form>
  );
};