import React from 'react';
import { useAuth } from '../context/authContext';

const MainSidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      name: 'Início', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      ), path: '/'
    },
    {
      name: 'Mensagens', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
      ), path: '/messages'
    },
  ];

  const NavItem = ({ name, icon }: typeof menuItems[0]) => (
    <button
      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors text-sm font-medium ${name === 'Mensagens'
          ? 'bg-[#5865F2] text-white shadow-md'
          : 'text-[#B5BAC1] hover:bg-[#2B2D31]'
        }`}
      onClick={() => { }}
    >
      {icon}
      <span>{name}</span>
    </button>
  );

  const UserPanel = () => (
    <div className="p-3 border-t border-[#232428] mt-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center group p-1 rounded transition-colors mr-1">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-xs">
              {user?.name.substring(0, 1).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1E1F22]"></div>
          </div>
          <span className="ml-2 text-white font-medium text-sm truncate">{user?.name}</span>
        </div>
        <button
          onClick={logout}
          className="text-[#B5BAC1] hover:text-red-500 cursor-pointer transition-colors p-1 rounded"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
      </div>
    </div>
  );


  return (
    <div className="w-60 bg-[#1E1F22] flex flex-col h-screen border-r border-[#151618] shadow-lg">
      <div className="h-16 flex items-center p-4 border-b border-[#232428]">
        <span className="text-[#B5BAC1] text-sm font-semibold ml-2">Super Chat</span>
      </div>
      <nav className="flex flex-col p-4 space-y-2 flex-1">
        {menuItems.map(item => (
          <NavItem key={item.name} {...item} />
        ))}
      </nav>
      <UserPanel />
    </div>
  );
};

export default MainSidebar;