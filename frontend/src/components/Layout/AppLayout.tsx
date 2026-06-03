/**
 * AutoAPI-X Main Application Layout
 * Professional sidebar navigation for enterprise platform
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AppLayout.css';

interface AppLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '🚗', path: '/' },
    { id: 'architecture', label: 'Vehicle Architecture', icon: '🔧', path: '/vehicle-architecture' },
    { id: 'infotainment', label: 'Infotainment Center', icon: '🎵', path: '/infotainment' },
    { id: 'attacks', label: 'Attack Simulation', icon: '🛡️', path: '/attack-simulation' },
    { id: 'impact', label: 'Impact Analysis', icon: '📊', path: '/impact-analysis' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Logo / Brand */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">⚡</span>
            {!sidebarCollapsed && <span className="logo-text">AutoAPI-X</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="status-indicator">
            <span className="status-dot"></span>
            {!sidebarCollapsed && <span className="status-text">System Online</span>}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="app-main">
        {children}
      </main>
    </div>
  );
};
