// src/pages/NotAuthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotAuthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center px-4">
      <h1 className="text-4xl font-bold text-red-700 mb-4">403 - Not Authorized</h1>
      <p className="text-gray-700 mb-6">You do not have permission to view this page.</p>
      <Link to="/" className="text-blue-600 hover:underline">Go back to homepage</Link>
    </div>
  );
}
