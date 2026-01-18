
import React from 'react';
import { APP_NAME } from '../constants';
import { AdminSubView } from '../types';
import { translations, Language } from '../translations';

interface AdminSidebarProps {
  onNavigate: (view: AdminSubView) => void;
  activeView: AdminSubView;
  lang: Language;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavigate, activeView, lang }) => {
  const t = translations[lang];

  const menuItems: { id: AdminSubView; label: string; icon: React.ReactNode }[] = [
    { id: 'clinics', label: 'Клиники', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
    { id: 'pending_clinics', label: 'На одобрении', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: 'audit', label: 'Аудит', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
    { id: 'billing', label: 'Биллинг', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { id: 'accounts', label: 'Доступы', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { id: 'logs', label: 'Логи', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ];

  return (
    <div className="hidden lg:flex w-72 bg-slate-900 h-screen text-white flex-col p-6 sticky top-0 shadow-2xl z-50 overflow-y-auto">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-blue-500/20">B</div>
        <div>
          <h1 className="text-xl font-black tracking-tighter italic leading-none">{APP_NAME}</h1>
          <p className="text-[8px] text-slate-500 uppercase tracking-widest font-black mt-1">Control Panel (B2B)</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {menuItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => onNavigate(item.id)} 
            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 font-bold text-sm ${activeView === item.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="pt-6 mt-6 border-t border-slate-800">
        <p className="text-[10px] text-slate-500 uppercase font-black mb-3 tracking-widest italic">Root: baicurexai@gmail.com</p>
        <div className="flex items-center gap-2 text-[10px] text-green-400 font-bold">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
          SECURE CONNECTION ACTIVE
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
