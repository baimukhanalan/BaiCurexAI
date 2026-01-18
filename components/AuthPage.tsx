
import React, { useState } from 'react';
import { APP_NAME } from '../constants';
import { Language, translations } from '../translations';

interface AuthPageProps {
  onLogin: (username: string, role: 'ADMIN' | 'CLINIC', password?: string) => void;
  onApply: (data: any) => void;
  lang: Language;
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onApply, lang, onBack }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    legalName: '', 
    bin: '', 
    license: '', 
    contactName: '', 
    email: '', 
    password: '' 
  });

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Имитация задержки сети для визуального отклика
    await new Promise(r => setTimeout(r, 500));

    try {
      if (isAdminMode) {
        onLogin(formData.email, 'ADMIN', formData.password);
      } else {
        if (isLogin) {
          onLogin(formData.email, 'CLINIC', formData.password);
        } else {
          onApply(formData);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-['Inter'] text-left">
      <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 rounded-full blur-[120px] bg-blue-600/20 animate-pulse"></div>
      
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-slate-900/40 backdrop-blur-3xl rounded-[40px] border border-white/10 overflow-hidden shadow-2xl relative z-10">
        
        <div className={`hidden lg:flex flex-col justify-between p-16 transition-all duration-700 ${isAdminMode ? 'bg-slate-800' : 'bg-blue-600'} relative`}>
          <button onClick={onBack} className="text-white/70 hover:text-white transition-all text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            {t.back}
          </button>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4 italic leading-tight">{isAdminMode ? 'Управление Инфраструктурой' : t.authWelcome}</h2>
            <p className="text-blue-100/70 text-lg font-medium">{isAdminMode ? 'Вход для администраторов BaiCurex' : t.authDescClinic}</p>
          </div>
          <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 w-fit">
            <p className="text-[9px] text-white font-black uppercase tracking-widest">{isAdminMode ? 'SYSTEM ROOT' : 'PARTNER PORTAL'}</p>
          </div>
        </div>

        <div className="p-10 sm:p-16 flex flex-col justify-center bg-slate-900/80 relative">
          <div className="flex justify-center mb-10">
            <div className="bg-slate-800 p-1.5 rounded-2xl flex gap-1 border border-white/5">
              <button 
                type="button"
                onClick={() => { setIsAdminMode(false); setIsLogin(true); }} 
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isAdminMode ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {t.clinicTab}
              </button>
              <button 
                type="button"
                onClick={() => { setIsAdminMode(true); setIsLogin(true); }} 
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isAdminMode ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {t.adminTab}
              </button>
            </div>
          </div>

          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-10 leading-tight">
             {isAdminMode ? t.adminLogin : (isLogin ? t.signIn : t.applyTitle)}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isAdminMode && !isLogin && (
              <>
                <div className="space-y-4">
                  <input required placeholder={t.legalName} className="w-full bg-slate-800/40 border border-white/5 rounded-xl px-6 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600" onChange={e=>setFormData({...formData, legalName: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <input required placeholder={t.binLabel} className="w-full bg-slate-800/40 border border-white/5 rounded-xl px-6 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600" onChange={e=>setFormData({...formData, bin: e.target.value})} />
                    <input required placeholder={t.licenseLabel} className="w-full bg-slate-800/40 border border-white/5 rounded-xl px-6 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600" onChange={e=>setFormData({...formData, license: e.target.value})} />
                  </div>
                  <input required placeholder={t.contactPerson} className="w-full bg-slate-800/40 border border-white/5 rounded-xl px-6 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600" onChange={e=>setFormData({...formData, contactName: e.target.value})} />
                </div>
              </>
            )}
            
            <div className="space-y-4">
              <input 
                required 
                type="email" 
                placeholder={t.emailLabel} 
                className="w-full bg-slate-800/40 border border-white/5 rounded-xl px-6 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600" 
                value={formData.email}
                onChange={e=>setFormData({...formData, email: e.target.value})} 
              />
              
              <input 
                required 
                type="password" 
                placeholder={t.passwordLabel} 
                className="w-full bg-slate-800/40 border border-white/5 rounded-xl px-6 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600" 
                value={formData.password}
                onChange={e=>setFormData({...formData, password: e.target.value})} 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full text-white rounded-xl py-5 font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl transition-all mt-6 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${isAdminMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {isAdminMode ? t.adminLogin : (isLogin ? t.authSubmit : t.submitApplication)}
            </button>
          </form>

          {!isAdminMode && (
            <button onClick={() => setIsLogin(!isLogin)} className="mt-8 text-slate-500 hover:text-blue-400 font-bold text-[10px] uppercase tracking-widest text-center transition-all">
              {isLogin ? t.noAccount : t.alreadyIn}
            </button>
          )}

          {/* Индикатор безопасности */}
          <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-center gap-4 text-[8px] font-black text-slate-600 uppercase tracking-widest">
            <span className="flex items-center gap-1"><div className="w-1 h-1 bg-green-500 rounded-full"></div> SSL SECURE</span>
            <span className="flex items-center gap-1"><div className="w-1 h-1 bg-blue-500 rounded-full"></div> AES-256</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
