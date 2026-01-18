
import React from 'react';

interface MenuBarProps {
  onHome: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ onHome }) => {
  const menus = ['Session', 'Actions', 'Edit', 'Search', 'View', 'Tools', 'Help'];

  return (
    <div className="bg-[#fcfcfc] border-b border-gray-300 flex items-center px-1">
      <button 
        onClick={onHome}
        className="px-3 py-1.5 hover:bg-blue-100 text-gray-700 cursor-default"
      >
        Home
      </button>
      {menus.map((menu) => (
        <button
          key={menu}
          className="px-3 py-1.5 hover:bg-blue-100 text-gray-700 cursor-default"
        >
          {menu}
        </button>
      ))}
    </div>
  );
};
