import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import MobileNavbar from '../components/MobileNavbar';
import { useAuth } from '../context/AuthContext';
import StudentSidebar from '../components/student/StudentSidebar';

const StudentLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  const userData = user?.user || user || {};
  const debeCompletarEmail = userData?.debeCompletarEmail === true;

  if (debeCompletarEmail) {
    return (
      <div className="min-h-screen bg-slate-50">
        <StudentSidebar />
        <div className="w-full md:pl-64 pb-24 md:pb-8 relative">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <StudentSidebar />
      <div className="w-full md:pl-64 pb-24 md:pb-8 relative">
        <Outlet />
      </div>
      <MobileNavbar />
    </div>
  );
};

export default StudentLayout;