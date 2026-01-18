
import React from 'react';
import { APP_NAME } from '../constants';
// Fixed: Replaced non-existent PortalSubView with ClinicSubView to resolve import error
import { ClinicSubView } from '../types';

interface SidebarProps {
  // Fixed: Updated parameter type to ClinicSubView
  onNavigate: (view: ClinicSubView) => void;
  // Fixed: Updated activeView type to ClinicSubView
  activeView: ClinicSubView;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeView }) => {
  // Fixed: Updated id type in menuItems to ClinicSubView. Added 'integrations' to types.ts.
  const menuItems: { id: ClinicSubView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Статус исследований', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg> },
    { id: 'upload', label: 'Новый анализ', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> },
    { id: 'archive', label: 'Архив пациентов', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg> },
    { id: 'economy', label: 'Экономика', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: 'sla', label: 'Стабильность (SLA)', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
    { id: 'integrations', label: 'Интеграции', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { id: 'docs', label: 'Документы', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { id: 'support', label: 'Поддержка', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
  ];

  return (
    <>
      <div className="hidden lg:flex w-72 bg-slate-900 h-screen text-white flex-col p-6 sticky top-0 shadow-2xl z-50 overflow-y-auto no-print">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg">B</div>
          <h1 className="text-2xl font-black tracking-tighter italic">{APP_NAME}</h1>
        </div>
        <nav className="flex-1 space-y-1">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)} className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 font-bold text-sm ${activeView === item.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="pt-6 mt-6 border-t border-slate-800">
          <p className="text-[10px] text-slate-500 uppercase font-black mb-3 tracking-widest italic">Service Standard</p>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-bold">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            Uptime 99.99%
          </div>
        </div>
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-slate-900 text-white z-[110] flex items-center justify-around p-3 border-t border-slate-800 shadow-2xl no-print">
        {menuItems.slice(0, 4).map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} className={`flex flex-col items-center gap-1 transition-colors ${activeView === item.id ? 'text-blue-500' : 'text-slate-500'}`}>
            {/* Fixed: Cast item.icon to React.ReactElement<any> to allow 'className' property in cloneElement */}
            {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
            <span className="text-[9px] font-black uppercase tracking-widest">{item.id.substring(0, 4)}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;