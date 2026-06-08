import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CreditCard, 
  Wrench, 
  MessageSquare, 
  FileText,
  PieChart,
  Settings
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const roleNavItems = {
    admin: [
      { path: '/admin-dashboard', label: 'Platform Admin', icon: LayoutDashboard },
    ],
    owner: [
      { path: '/owner-dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/properties', label: 'Properties', icon: Building2 },
      { path: '/tenants', label: 'Tenants', icon: Users },
      { path: '/financials', label: 'Financials', icon: PieChart },
      { path: '/maintenance', label: 'Maintenance', icon: Wrench },
      { path: '/documents', label: 'Documents', icon: FileText },
    ],
    manager: [
      { path: '/manager-dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/properties', label: 'Properties', icon: Building2 },
      { path: '/tenants', label: 'Tenants', icon: Users },
      { path: '/maintenance', label: 'Maintenance', icon: Wrench },
      { path: '/rent', label: 'Rent & Invoices', icon: CreditCard },
      { path: '/communication', label: 'Messages', icon: MessageSquare },
      { path: '/documents', label: 'Documents', icon: FileText },
    ],
    tenant: [
      { path: '/tenant-dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/maintenance', label: 'Maintenance', icon: Wrench },
      { path: '/communication', label: 'Messages', icon: MessageSquare },
      { path: '/documents', label: 'Documents', icon: FileText },
    ]
  };

  const navItems = user ? roleNavItems[user.role] || [] : [];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="flex items-center justify-center p-6 mb-2">
        <div className="cursor-pointer" onClick={() => navigate(`/${user?.role}`)}>
          <img src="/logo.png" alt="HantiOS" style={{ height: '120px', width: 'auto' }} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="flex flex-col gap-1 px-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem 0.75rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                  backgroundColor: isActive ? 'rgba(15, 118, 110, 0.15)' : 'transparent',
                  borderLeft: isActive ? '4px solid var(--color-secondary)' : '4px solid transparent',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'var(--transition)'
                })}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={20} style={{ color: isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)', transition: 'var(--transition)' }} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t mt-auto" style={{ borderColor: 'var(--color-border)' }}>
        <NavLink 
          to="/settings" 
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem 0.75rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            color: isActive ? 'var(--color-text-main)' : 'var(--color-text-muted)',
            backgroundColor: isActive ? 'rgba(15, 118, 110, 0.15)' : 'transparent',
            borderLeft: isActive ? '4px solid var(--color-secondary)' : '4px solid transparent',
            fontWeight: isActive ? '600' : '400',
            transition: 'var(--transition)'
          })}
        >
          {({ isActive }) => (
            <>
              <Settings size={20} style={{ color: isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)', transition: 'var(--transition)' }} />
              <span>Settings</span>
            </>
          )}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
