import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { App } from './App';
import { ReportPage } from './ReportPage';

export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<App />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}