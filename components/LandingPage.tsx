
import React, { useState, useRef, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { APP_NAME } from '../constants';
import { Language, translations } from '../translations';

const epilepsyData = [
  { year: '2020', incidence: 88, forecast: 88 },
  { year: '2021', incidence: 105, forecast: 105 },
  { year: '2022', incidence: 124, forecast: 124 },
  { year: '2023', incidence: 145, forecast: 145 },
  { year: '2024', incidence: 170, forecast: 170 },
  { year: '2025', forecast: 198 },
  { year: '2026', forecast: 225 },
];

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left group-hover:text-blue-600 transition-all"
      >
        <span className="text-lg sm:text-xl font-bold tracking-tight pr-4">{question}</span>
        <div className={`shrink-0 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-all ${isOpen ? 'bg-blue-600 border-blue-600 text-white rotate-180 shadow-lg shadow-blue-200' : 'text-slate-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] pb-8' : 'max-h-0'}`}>
        <p className="text-slate-500 font-medium leading-relaxed max-w-3xl whitespace-pre-line">{answer}</p>
      </div>
    </div>
  );
};

interface LandingPageProps {
  onStart: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, lang, onLanguageChange }) => {
  const t = translations[lang];
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: { id: Language; label: string; flag: string }[] = [
    { id: 'ru', label: 'Русский', flag: 'RU' },
    { id: 'en', label: 'English', flag: 'EN' },
    { id: 'kz', label: 'Қазақша', flag: 'KZ' },
  ];

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden font-['Inter']">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20 text-lg sm:text-xl">B</div>
            <span className="text-xl sm:text-2xl font-black tracking-tighter italic">{APP_NAME}</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="p-2 sm:p-2.5 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-2 text-slate-600 hover:text-blue-600 group"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{lang}</span>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-[60] animate-in fade-in zoom-in duration-200">
                  {languages.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        onLanguageChange(l.id);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-50 ${lang === l.id ? 'bg-blue-50/50' : ''}`}
                    >
                      <span className={`text-xs font-bold ${lang === l.id ? 'text-blue-600' : 'text-slate-600'}`}>{l.label}</span>
                      <span className="text-[8px] font-black text-slate-300">{l.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={onStart}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-900 text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm hover:bg-black transition-all shadow-xl shadow-slate-200 whitespace-nowrap"
            >
              {t.login}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,#eff6ff_0%,transparent_50%)] -z-10 opacity-60"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest mb-6 border border-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Centralized AI Infrastructure
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] lg:leading-[0.9] mb-6 sm:mb-8 italic">
              {t.heroTitle} <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">{t.heroTitleHighlight}</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              {t.heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={onStart}
                className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-300 transform hover:scale-105"
              >
                {t.startButton}
              </button>
              <div className="flex items-center gap-4 px-6 text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-tighter">
                <span className="flex items-center gap-2 text-green-500 whitespace-nowrap">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  {t.accuracy}
                </span>
                <span className="whitespace-nowrap">{t.b2bModel}</span>
              </div>
            </div>
          </div>
          <div className="relative hidden sm:block [perspective:1500px]">
             <div className="bg-white/40 backdrop-blur-xl rounded-[40px] shadow-[0_32px_64px_-16px_rgba(15,23,42,0.15)] border border-white/60 p-8 transition-all duration-700 ease-out max-w-lg mx-auto lg:max-w-none [transform-style:preserve-3d] [transform:rotateX(12deg)_rotateY(-18deg)_rotateZ(4deg)] hover:[transform:rotateX(0deg)_rotateY(0deg)_rotateZ(0deg)]">
                <div className="w-full aspect-square bg-slate-950 rounded-3xl overflow-hidden relative border border-white/10 shadow-inner">
                   {/* Grid Pattern overlay for tech feel */}
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                   <div className="absolute inset-0 flex items-center justify-center [transform:translateZ(40px)]">
                      <div className="text-white text-center">
                         <div className="text-[10px] sm:text-xs font-black text-blue-400 uppercase tracking-[0.4em] mb-4 opacity-80">{t.scalabilityScore}</div>
                         <div className="text-5xl sm:text-7xl font-black mb-2 tracking-tighter italic">A+++</div>
                         <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">(Enterprise Grade)</div>
                      </div>
                   </div>
                   {/* Scanning line effect */}
                   <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent animate-[scan_4s_ease-in-out_infinite] pointer-events-none"></div>
                </div>
             </div>
             {/* Decorative floating elements */}
             <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl animate-pulse"></div>
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl animate-pulse delay-700"></div>
          </div>
        </div>
        <style>{`
          @keyframes scan {
            0%, 100% { transform: translateY(-100%); }
            50% { transform: translateY(200%); }
          }
        `}</style>
      </header>

      {/* Process Section - How it Works */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 bg-slate-50 border-y border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter italic uppercase mb-6">{t.processTitle}</h2>
            <div className="p-6 bg-blue-600 text-white rounded-[32px] inline-block shadow-2xl shadow-blue-200">
               <p className="text-sm sm:text-xl font-black tracking-tight leading-snug">{t.goldenFormula}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 sm:gap-16">
            {[
              { title: t.processStep1, desc: t.processStep1Desc, icon: '01' },
              { title: t.processStep2, desc: t.processStep2Desc, icon: '02' },
              { title: t.processStep3, desc: t.processStep3Desc, icon: '03' }
            ].map((step, i) => (
              <div key={i} className="relative group">
                {i < 2 && <div className="hidden lg:block absolute top-10 -right-10 w-20 h-[2px] bg-slate-200"></div>}
                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center font-black text-3xl text-blue-600 mb-8 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Economy for Clinics */}
      <section className="py-20 sm:py-32 bg-slate-950 text-white px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,#1e3a8a_0%,transparent_40%)] opacity-30"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tighter mb-4 sm:mb-6 uppercase italic leading-tight">{t.economyTitle}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-medium text-sm sm:text-base">{t.economyDesc}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="p-8 sm:p-12 bg-slate-900 rounded-[32px] sm:rounded-[40px] border border-slate-800 shadow-2xl">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 sm:mb-8">{t.traditionalModel}</div>
               <div className="space-y-4 sm:space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4 text-sm sm:text-base">
                     <span className="text-slate-400">{t.doctorSalary}</span>
                     <span className="font-bold text-right ml-2">{t.salaryRange}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4 text-sm sm:text-base">
                     <span className="text-slate-400">{t.throughput}</span>
                     <span className="font-bold text-right ml-2">{t.limited}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4 text-sm sm:text-base">
                     <span className="text-slate-400">{t.qualityInterp}</span>
                     <span className="font-bold text-red-400 text-right ml-2">{t.subjective}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 text-sm sm:text-base">
                     <span className="text-slate-400">{t.staffDependency}</span>
                     <span className="font-bold text-red-400 text-right ml-2">{t.critical}</span>
                  </div>
               </div>
            </div>

            <div className="p-8 sm:p-12 bg-blue-600 rounded-[32px] sm:rounded-[40px] shadow-[0_0_50px_rgba(37,99,235,0.3)] relative overflow-hidden border border-blue-400/30">
               <div className="absolute top-0 right-0 p-8 text-6xl sm:text-8xl font-black opacity-10 italic">AI</div>
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-6 sm:mb-8 relative z-10">BaiCurex DSS Model</div>
               <div className="space-y-4 sm:space-y-6 relative z-10">
                  <div className="flex justify-between items-center border-b border-blue-500/50 pb-4 text-sm sm:text-base">
                     <span className="text-blue-100">{t.centralizedAnalysis}</span>
                     <span className="font-black text-right ml-2">{t.aiCore}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-blue-500/50 pb-4 text-sm sm:text-base">
                     <span className="text-blue-100">{t.scaling}</span>
                     <span className="font-black text-right ml-2">{t.doctorCapacity}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-blue-500/50 pb-4 text-sm sm:text-base">
                     <span className="text-blue-100">{t.qualityInterp}</span>
                     <span className="font-black text-green-300 text-right ml-2">{t.standardization}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 text-sm sm:text-base">
                     <span className="text-blue-100">{t.costSavings}</span>
                     <span className="font-black text-green-300 text-right ml-2">{t.costReduction}</span>
                  </div>
               </div>
               <div className="mt-8 sm:mt-10 p-5 bg-blue-700/80 backdrop-blur-sm rounded-2xl text-center font-black uppercase tracking-widest text-[10px] sm:text-xs border border-white/10 shadow-xl">
                  {t.marginGrowth}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investor Trigger Block */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter italic uppercase mb-8 leading-none">
                {t.investorTitle}
              </h2>
              <p className="text-lg sm:text-2xl text-slate-500 font-medium mb-12 leading-relaxed">
                {t.investorDesc}
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { t: t.invTrigger1, d: t.invTrigger1Desc },
                  { t: t.invTrigger2, d: t.invTrigger2Desc },
                  { t: t.invTrigger3, d: t.invTrigger3Desc },
                  { t: t.invTrigger4, d: t.invTrigger4Desc }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-[28px] border border-slate-100 hover:shadow-xl transition-all">
                    <h4 className="font-black text-slate-900 uppercase italic tracking-tighter mb-2">{item.t}</h4>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="bg-slate-900 rounded-[60px] p-12 sm:p-20 text-white shadow-[0_40px_100px_rgba(15,23,42,0.3)] relative overflow-hidden group">
                  <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-20 transition-all group-hover:scale-125"></div>
                  <div className="text-8xl sm:text-[140px] font-black opacity-5 italic select-none pointer-events-none absolute bottom-10 left-10">SAAS</div>
                  <div className="relative z-10 space-y-8">
                     <div className="text-blue-400 font-black uppercase tracking-[0.4em] text-xs">Market Dominance</div>
                     <p className="text-3xl sm:text-5xl font-black italic tracking-tighter leading-tight">B2B <br/> Recurring <br/> Revenue <br/> Infrastructure</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 bg-slate-50">
         <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
               <div className="text-center lg:text-left">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter mb-6 sm:mb-8 italic uppercase leading-tight">{t.pricingTitle}</h2>
                  <p className="text-lg sm:text-xl text-slate-500 mb-8 sm:mb-10 leading-relaxed font-medium">{t.pricingDesc}</p>
                  
                  <div className="space-y-6 mb-10 text-left">
                     <div className="flex gap-4 sm:gap-6 items-start">
                        <div className="w-12 h-12 bg-white border border-slate-200 shadow-lg rounded-2xl flex items-center justify-center shrink-0 text-blue-600 font-black text-xl">1</div>
                        <div>
                           <h4 className="font-black text-slate-900 uppercase tracking-tight mb-1">{t.subscriptionContract}</h4>
                           <p className="text-sm text-slate-500 leading-snug">{t.subscriptionDetail}</p>
                        </div>
                     </div>
                     <div className="flex gap-4 sm:gap-6 items-start">
                        <div className="w-12 h-12 bg-white border border-slate-200 shadow-lg rounded-2xl flex items-center justify-center shrink-0 text-blue-600 font-black text-xl">2</div>
                        <div>
                           <h4 className="font-black text-slate-900 uppercase tracking-tight mb-1">{t.variablePart}</h4>
                           <p className="text-sm text-slate-500 leading-snug">{t.variableDetail}</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                     {[t.noHiddenFees, t.noUserFees, t.noTimeLimits].map(badge => (
                       <span key={badge} className="px-4 py-2 bg-white text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm">
                          {badge}
                       </span>
                     ))}
                  </div>
               </div>

               <div className="bg-slate-900 rounded-[40px] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 text-6xl sm:text-9xl font-black opacity-5 italic pointer-events-none transition-transform group-hover:scale-110">SAVE</div>
                  <h3 className="text-2xl sm:text-3xl font-black mb-8 italic text-blue-400 uppercase tracking-tighter">{t.whyBeneficial}</h3>
                  <div className="space-y-6 mb-10">
                     {[t.benefit1, t.benefit2, t.benefit3, t.benefit4].map(benefit => (
                       <div key={benefit} className="flex gap-3 items-center">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] font-black shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.4)]">✓</div>
                          <span className="font-bold text-base sm:text-lg leading-tight">{benefit}</span>
                       </div>
                     ))}
                  </div>
                  <button 
                     onClick={onStart}
                     className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl sm:rounded-3xl font-black uppercase text-xs tracking-[0.2em] transition-all transform hover:scale-[1.02] shadow-2xl shadow-blue-500/20"
                  >
                     {t.requestOffer}
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,#1e3a8a_0%,transparent_50%)] opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12 sm:mb-20 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter mb-4 uppercase italic">{t.statsTitle}</h2>
            <p className="text-slate-400 max-w-2xl font-medium text-sm sm:text-base mx-auto lg:mx-0">{t.statsDesc}</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16 sm:mb-20">
            {[
              { v: '40k', l: t.stat1Label, d: t.stat1Desc },
              { v: '+30%', l: t.stat2Label, d: t.stat2Desc },
              { v: '3x', l: t.stat3Label, d: t.stat3Desc },
              { v: '1-5%', l: t.stat4Label, d: t.stat4Desc }
            ].map(stat => (
              <div key={stat.l} className="group">
                <div className={`text-4xl sm:text-6xl font-black mb-2 tracking-tighter italic ${stat.v === '1-5%' ? 'text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'}`}>{stat.v}</div>
                <p className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">{stat.l}</p>
                <p className="hidden sm:block text-xs text-slate-500 leading-relaxed opacity-60 font-medium">{stat.d}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] shadow-2xl">
             <h3 className="text-lg sm:text-xl font-black mb-6 flex items-center gap-4 uppercase italic tracking-tighter">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                {t.epilepsyChartTitle}
             </h3>
             <div className="h-60 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={epilepsyData}>
                    <defs>
                      <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '10px' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="incidence" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorInc)" name={t.chartDataLabel} />
                    <Area type="monotone" dataKey="forecast" stroke="#ef4444" strokeWidth={4} strokeDasharray="8 8" fillOpacity={0} name={t.chartForecastLabel} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 bg-slate-50 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter italic uppercase">{t.faqTitle}</h2>
          </div>
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-6 sm:p-12">
            <FAQItem question={t.faqQ1} answer={t.faqA1} />
            <FAQItem question={t.faqQ2} answer={t.faqA2} />
            <FAQItem question={t.faqQ3} answer={t.faqA3} />
            <FAQItem question={t.faqQ4} answer={t.faqA4} />
            <FAQItem question={t.faqQ5} answer={t.faqA5} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16 px-4 sm:px-6 border-t border-slate-900">
         <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="md:col-span-2">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xl">B</div>
                 <span className="text-xl sm:text-2xl font-black tracking-tighter italic">{APP_NAME}</span>
               </div>
               <p className="text-slate-500 font-medium max-w-sm mb-8 leading-relaxed font-medium">{t.footerDesc}</p>
               
               {/* Social Buttons */}
               <div className="flex items-center gap-4 mt-8">
                  <a href="#" className="p-3 bg-slate-900 rounded-xl hover:bg-blue-600 transition-all text-slate-400 hover:text-white border border-white/5">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.562.218.96.48 1.382.902.422.422.684.82.902 1.382.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.218.562-.48.96-.902 1.382-.422.422-.82.684-1.382.902-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.562-.218-.96-.48-1.382-.902-.422-.422-.684-.82-.902-1.382-.163-.422-.358-1.057-.412-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.218-.562.48-.96.902-1.382.422-.422.82-.684 1.382-.902.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.277.057-2.149.258-2.912.553-.789.307-1.458.718-2.124 1.384-.666.666-1.077 1.335-1.384 2.124-.295.763-.496 1.635-.553 2.912-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.057 1.277.258 2.149.553 2.912.307.789.718 1.458 1.384 2.124.666.666 1.335 1.077 2.124 1.384.763.295 1.635.496 2.912.553 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.277-.057 2.149-.258 2.912-.553.789-.307 1.458-.718 2.124-1.384.666-.666 1.077-1.335 1.384-2.124.763-.295 1.635-.496 2.912-.553 1.28-.058 1.688-.072 4.947-.072s3.667.014 4.947.072c1.277.057 2.149.258 2.912.553.789.307 1.458.718 2.124 1.384.666.666 1.077 1.335 1.384 2.124.763.295 1.635.496 2.912.553 1.28.058 1.688.072 4.947.072zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                  <a href="#" className="p-3 bg-slate-900 rounded-xl hover:bg-black transition-all text-slate-400 hover:text-white border border-white/5">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.023c.131.005.262.012.394.022.133.01.265.023.396.039.132.016.262.036.393.059.13.024.259.052.388.084l.383.097c.126.035.25.075.374.12l.366.132c.12.048.238.1.354.156l.341.17c.112.06.221.124.328.19l.314.204c.101.071.2.147.296.226l.278.24c.089.083.176.171.258.26l.24.288c.076.096.148.196.216.298l.192.31c.061.107.119.216.171.328l.148.341c.046.117.088.235.126.354l.1.366c.035.124.064.249.089.375l.067.382c.023.131.04.263.053.395l.024.397c.007.133.01.266.009.398v.01l.001.003c.001.127-.002.254-.008.381l-.023.396c-.012.132-.029.264-.051.396l-.066.388c-.023.131-.051.261-.083.39l-.096.383c-.035.127-.074.253-.119.378l-.132.368c-.048.121-.101.24-.157.357l-.171.343c-.06.114-.124.225-.192.333l-.206.319c-.071.103-.148.204-.229.301l-.242.283c-.083.091-.171.179-.263.262l-.286.244c-.097.078-.198.151-.301.219l-.312.195c-.108.063-.22.122-.334.174l-.344.15c-.118.047-.239.09-.36.128l-.369.102c-.126.036-.253.065-.382.09l-.385.068c-.131.023-.264.04-.399.053l-.401.024c-.133.007-.267.01-.401.008l-.01.001h-.001c-.133 0-.266-.003-.399-.009l-.396-.023c-.133-.012-.265-.029-.398-.051l-.391-.066c-.131-.023-.263-.051-.393-.083l-.386-.096c-.128-.035-.255-.074-.381-.119l-.371-.132c-.122-.048-.242-.101-.36-.157l-.345-.171c-.115-.06-.228-.124-.337-.192l-.321-.206c-.104-.071-.205-.148-.303-.229l-.285-.242c-.092-.083-.181-.171-.265-.263l-.246-.286c-.079-.097-.152-.198-.221-.301l-.196-.312c-.064-.108-.123-.22-.176-.334l-.151-.344c-.048-.118-.091-.239-.129-.36l-.103-.369c-.037-.126-.066-.253-.092-.382l-.068-.385c-.024-.131-.04-.264-.054-.399l-.024-.401c-.008-.133-.011-.267-.008-.401l-.001-.01v-.001c0-.133.003-.266.009-.399l.023-.396c.012-.133.029-.265.051-.398l.066-.391c.023-.131.051-.263.083-.393l.096-.386c.035-.128.074-.255.119-.381l.132-.371c.048-.122.101-.242.157-.36l.171-.345c.06-.115.124-.228.192-.337l.206-.321c.071-.104.148-.205.229-.303l.242-.285c.083-.092.171-.181.263-.265l.286-.246c.097-.079.198-.152.301-.221l.312-.196c.108-.064.22-.123.334-.176l.344-.151c.118-.048.239-.091.36-.129l.369-.103c.126-.037.253-.066.382-.092l.385-.068c.131-.024.264-.04.399-.054l.401-.024c.133-.008.267-.011.401-.008l.01-.001h.001zm-3.09 18.067c-.201.002-.403.004-.606.004-1.802 0-3.149-.525-4.135-1.528-1.004-1.021-1.428-2.39-1.428-4.576V6.782H1.144V4.54h2.122V1.525h2.417v3.015h3.111v2.242H5.683v4.613c0 .88.136 1.488.423 1.836.275.334.78.497 1.549.497.34 0 .685-.04 1.037-.12l.743 2.012c-.417.151-.834.252-1.25.302l-.24.015z"/></svg>
                  </a>
                  <a href="#" className="p-3 bg-slate-900 rounded-xl hover:bg-blue-700 transition-all text-slate-400 hover:text-white border border-white/5">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
               </div>
            </div>
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6">{t.b2bContacts}</h4>
               <p className="text-base font-black mb-1 italic tracking-tight">baicurexai@gmail.com</p>
               <p className="text-xs text-slate-500 font-medium leading-relaxed">{t.address}</p>
            </div>
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">{t.operations}</h4>
               <p className="text-xs font-bold italic">{t.workingHours}</p>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-900 text-center">
            <p className="text-[8px] sm:text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">{t.copyright}</p>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
