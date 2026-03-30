import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthGuard from './components/AuthGuard';
import AuthPage from './pages/AuthPage';
import Layout from './components/Layout';

import ClientsPage from './pages/ClientsPage';
import ServicesPage from './pages/ServicesPage';
import AppointmentsPage from './pages/AppointmentsPage';
import HistoryPage from './pages/HistoryPage';
import FinancePage from './pages/FinancePage';
import BudgetsPage from './pages/BudgetsPage';
import TaxesPage from './pages/TaxesPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          
          <Route
            path="/"
            element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }
          >
            {/* Nested Routes inside Layout */}
            <Route index element={<ClientsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="budgets" element={<BudgetsPage />} />
            <Route path="taxes" element={<TaxesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
