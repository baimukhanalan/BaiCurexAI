
import React from 'react';
import { APP_NAME } from '../constants';
import { ClinicSubView } from '../types';
import { translations, Language } from '../translations';

interface ClinicSidebarProps {
  onNavigate: (view: ClinicSubView) => void;
  activeView: ClinicSubView;
  lang: Language;
}

const ClinicSidebar: React.FC<ClinicSidebarProps> = ({ onNavigate, activeView, lang }) => {
  const t = translations[lang];

  const menuItems: { id: ClinicSubView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: t.navDashboard, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
    { id: 'upload', label: t.navUpload, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> },
    { id: 'archive', label: t.navArchive, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
    { id: 'sla', label: 'SLA & Stability', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    { id: 'economy', label: t.navEconomy, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: 'docs', label: t.navDocs, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { id: 'support', label: t.navSupport, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
  ];

  return (
    <>
      <div className="hidden lg:flex w-72 bg-slate-950 h-screen text-white flex-col p-6 sticky top-0 shadow-2xl z-50 overflow-y-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/20">B</div>
          <div>
            <h1 className="text-xl font-black tracking-tighter italic leading-none">{APP_NAME}</h1>
            <p className="text-[8px] text-slate-500 uppercase tracking-widest font-black mt-1">Laboratory SaaS</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)} className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all flex items-center gap-4 font-bold text-sm ${activeView === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'hover:bg-slate-900 text-slate-400 hover:text-white'}`}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="pt-6 mt-6 border-t border-slate-900">
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
             <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest italic">{t.digitalTrust}</p>
             <div className="flex items-center gap-2 text-[10px] text-blue-400 font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                SYSTEM ACTIVE
             </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-slate-950 border-t border-white/5 z-50 px-2 py-3 backdrop-blur-xl">
        <div className="flex justify-around items-center">
          {menuItems.slice(0, 5).map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)} className={`flex flex-col items-center gap-1 transition-all ${activeView === item.id ? 'text-blue-500' : 'text-slate-500'}`}>
              <div className={`p-2 rounded-xl transition-all ${activeView === item.id ? 'bg-blue-600/10' : ''}`}>
                {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClinicSidebar;
