import React, { useState } from 'react';
import { User, Bell, Calendar, Users, FileText, Pill, Settings, Menu, X } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg">
      {/* Desktop Navbar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold text-white">
                <a href="/">Swastha 🩺</a>
                </h1>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <NavItem icon={<Calendar size={20} />} label="Appointments" />
            <NavItem icon={<Users size={20} />} label="Patients" />
            <NavItem icon={<FileText size={20} />} label="Medical Records" />
            <NavItem icon={<Pill size={20} />} label="Pharmacy" />
            
            {/* Notifications */}
            <button className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">3</span>
            </button>
            
            {/* User Profile */}
            <div className="ml-4 flex items-center">
              <div className="flex-shrink-0">
                <button className="bg-blue-700 p-1 rounded-full text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white">
                  <User size={20} />
                </button>
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-white">Dr. Sahil Goyat</p>
                <p className="text-xs text-blue-200">Cardiology</p>
              </div>
            </div>
            
            {/* Settings */}
            <button className="ml-4 text-white hover:bg-blue-700 p-2 rounded-md">
              <Settings size={20} />
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-600">
            <MobileNavItem icon={<Calendar size={20} />} label="Appointments" />
            <MobileNavItem icon={<Users size={20} />} label="Patients" />
            <MobileNavItem icon={<FileText size={20} />} label="Medical Records" />
            <MobileNavItem icon={<Pill size={20} />} label="Pharmacy" />
            <MobileNavItem icon={<Bell size={20} />} label="Notifications" count={3} />
            <MobileNavItem icon={<Settings size={20} />} label="Settings" />
            
            {/* User Profile in Mobile View */}
            <div className="pt-4 pb-3 border-t border-blue-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center">
                    <User size={24} color="white" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">Dr. Sarah Johnson</div>
                  <div className="text-sm font-medium text-blue-200">Cardiology</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Desktop Navigation Item
function NavItem({ icon, label }) {
  return (
    <a href="#" className="flex items-center text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
      {icon}
      <span className="ml-2">{label}</span>
    </a>
  );
}

// Mobile Navigation Item
function MobileNavItem({ icon, label, count }) {
  return (
    <a href="#" className="flex items-center text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
      <div className="flex items-center">
        {icon}
        <span className="ml-2">{label}</span>
      </div>
      {count && (
        <span className="ml-auto bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
          {count}
        </span>
      )}
    </a>
  );
}

export default Navbar;