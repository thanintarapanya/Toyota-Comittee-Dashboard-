import React, { useState } from 'react';
import { LayoutDashboard, Activity, KanbanSquare, MessageSquare, Settings, LogOut, ChevronLeft, ChevronRight, Menu, FolderOpen, Tv2, Eye, Crown, Shield } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
  onLogout: () => void;
  isAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onLogout, isAdmin }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { view: View.OVERVIEW_DIRECTOR, icon: Shield, label: 'Overview Director', adminOnly: true },
    { view: View.DIRECTOR, icon: Eye, label: 'Director Graph', adminOnly: true },
    { view: View.LIVE, icon: Tv2, label: 'Live Stream' },
    { view: View.FILES, icon: FolderOpen, label: 'Files' },
    { view: View.ADMINISTRATION, icon: Crown, label: 'Administration', adminOnly: true },
    { view: View.CHAT, icon: MessageSquare, label: 'Team Comms', disabled: true },
  ];

  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <div 
      className={`h-full border-r border-white/10 flex flex-col glass-panel z-20 transition-all duration-300 relative ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-zinc-900 border border-white/20 rounded-full p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Brand Header */}
      <div className="h-20 flex items-center justify-center px-4 border-b border-white/10 overflow-hidden">
        {isCollapsed ? (
           <Menu className="w-6 h-6 text-zinc-400" />
        ) : (
           <div className="flex items-center justify-center w-full px-2 relative">
              {/* White circular gradient for contrast */}
              <div className="absolute inset-0 bg-white blur-xl rounded-full scale-150 pointer-events-none opacity-80"></div>
              <img 
                src="https://lh3.googleusercontent.com/d/1Zaxzi7wKvndhXlfaKSdWHJg-DiD6Euxl" 
                alt="Logo" 
                className="h-10 w-auto object-contain relative z-10"
              />
           </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {filteredNavItems.map((item) => (
          <button
            key={item.view}
            onClick={() => !item.disabled && onChangeView(item.view)}
            disabled={item.disabled}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 text-sm font-light group relative ${
              currentView === item.view
                ? 'bg-white/10 text-white border border-white/5 shadow-inner'
                : item.disabled 
                  ? 'text-zinc-700 cursor-not-allowed' 
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${currentView === item.view ? 'text-isuzu-red' : item.disabled ? 'text-zinc-700' : 'group-hover:text-zinc-300'}`} />
            
            {!isCollapsed && (
                <span className="whitespace-nowrap opacity-100 transition-opacity duration-200">
                    {item.label}
                </span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-white/10">
                    {item.label}
                </div>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <button
          onClick={() => onChangeView(View.SETTINGS)}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 text-sm font-light group ${
            currentView === View.SETTINGS
              ? 'bg-white/10 text-white'
              : 'text-zinc-500 hover:text-white hover:bg-white/5'
          } ${isCollapsed ? 'justify-center' : ''}`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </button>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-light group ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Disconnect</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;