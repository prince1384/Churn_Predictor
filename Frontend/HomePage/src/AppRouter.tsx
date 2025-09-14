import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { App } from './App';
import { App as LoginPage } from '../../LoginPage/src/App';
import { App as DashboardPage } from '../../Dashboard/src/App';
import { App as ReportPage } from '../../report-dashboard/src/App';

export function AppRouter() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}