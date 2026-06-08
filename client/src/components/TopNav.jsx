import React, { useContext } from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const TopNav = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="top-nav">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="text-muted hover:text-primary transition-colors duration-200 block md:hidden p-1 rounded-lg hover:bg-black/5"
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-muted hover:text-primary relative p-1 rounded-lg hover:bg-black/5 transition-all duration-200" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full ring-2 ring-[var(--color-bg)]"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l pl-6" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-main">{user?.full_name || 'User'}</span>
            <span className="text-xs text-muted capitalize">{user?.role || 'Guest'}</span>
          </div>
          <div className="avatar hover:scale-105 transition-transform duration-200 cursor-pointer shadow-sm shadow-primary/20">
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <button 
            onClick={logout} 
            className="text-muted hover:text-danger p-1.5 rounded-lg hover:bg-danger-light/10 transition-all duration-200 ml-1" 
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
