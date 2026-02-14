// src/routes/AdminRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/supabaseClient';

export default function AdminRoute() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return setIsAdmin(false);
      const { data, error } = await supabase.from('users').select('role').eq('id', user.id).single();
      if (error || !data || data.role !== 'admin') return setIsAdmin(false);
      setIsAdmin(true);
    };
    checkAdmin();
  }, [user]);

  if (isAdmin === null) return <div className="text-center py-16">Checking access...</div>;

  if (!isAdmin) return <Navigate to="/not-authorized" />;

  return <iframe src="http://localhost:5173/" className="w-full h-screen border-none" title="Admin Dashboard" />;
}
