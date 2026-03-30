import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { path: '/', icon: 'fa-address-book', label: 'Clientes' },
    { path: '/services', icon: 'fa-box', label: 'Serviços' },
    { path: '/appointments', icon: 'fa-calendar-check', label: 'Agendamentos' },
    { path: '/history', icon: 'fa-clock-rotate-left', label: 'Histórico' },
    { path: '/budgets', icon: 'fa-file-invoice-dollar', label: 'Orçamentos' },
    { path: '/finance', icon: 'fa-money-bill-trend-up', label: 'Financeiro' },
    { path: '/taxes', icon: 'fa-file-signature', label: 'Impostos (DAS)' },
  ];

  return (
    <div className="layout-wrapper">
      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-sidebar">
            <i className="fa-solid fa-gem" />
            <h2>MEI Manager</h2>
          </div>
          <button className="close-btn mobile-only" onClick={toggleSidebar}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="user-details">
              <span className="user-name">Administrador</span>
              <span className="user-email text-truncate">{user?.email}</span>
            </div>
          </div>
          <button className="btn-logout-sidebar" onClick={logout}>
            <i className="fa-solid fa-right-from-bracket"></i> Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="layout-content">
        {/* Top Header */}
        <header className="top-header">
          <button className="menu-toggle mobile-only" onClick={toggleSidebar}>
            <i className="fa-solid fa-bars"></i>
          </button>
          
          <div className="header-title desktop-only">
            <h1>Sistema Operacional do MEI</h1>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="main-scrollable">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
