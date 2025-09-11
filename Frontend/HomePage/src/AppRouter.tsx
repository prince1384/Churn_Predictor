import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { App } from "./App";
// Lazy-load sibling apps
const LoginPage = lazy(() => import("@login/components/LoginPage"));
const DashboardApp = lazy(() => import("@dashboard/App").then(m => ({ default: m.App })));
export function AppRouter() {
  return <BrowserRouter>
          <Suspense fallback={<div style={{color:'#fff',padding:'2rem'}}>Loading...</div>}>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardApp />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
      </BrowserRouter>;
}