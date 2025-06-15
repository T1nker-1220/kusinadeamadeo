'use client';

import { useState, useEffect } from 'react';
import Login from './Login';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check localStorage for admin login state
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    setIsAuthenticated(adminLoggedIn === 'true');
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Show admin content if authenticated
  return <>{children}</>;
} 