
import React, { useState, useRef, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { APP_NAME } from '../constants';
import { Language, translations } from '../translations';

const growthData = [
  { month: 'Jan', volume: 45, nodes: 12 },
  { month: 'Feb', volume: 52, nodes: 18 },
  { month: 'Mar', volume: 68, nodes: 24 },
  { month: 'Apr', volume: 95, nodes: 42 },
  { month: 'May', volume: 145, nodes: 88 },
  { month: 'Jun', volume: 190, nodes: 124 },
  { month: 'Jul', volume: 240, nodes: 186 },
];

const InfrastructureHUD: React.FC = () => {
  return (
    <div className="relative w-full h-[320px] md:h-[500px] flex items-center justify-center overflow-visible" style={{ perspective: '1200px' }}>
      <style>{`
        @keyframes orbit {
          from { transform: rotateY(0deg) rotateX(20deg); }
          to { transform: rotateY(360deg) rotateX(20deg); }
        }
        @keyframes core-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes float-node {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .analytical-core {
          transform-style: preserve-3d;
          animation: orbit 30s linear infinite;
        }
        .hud-ring {
          position: absolute;
          border: 1px solid rgba(37, 99, 235, 0.15);
          border-radius: 50%;
        }
      `}</style>
      
      {/* Background Glow */}
      <div className="absolute w-40 h-40 md:w-80 md:h-80 bg-blue-600/10 blur-[80px] md:blur-[120px] rounded-full animate-pulse"></div>

      <div className="analytical-core w-48 h-48 md:w-72 md:h-72 relative flex items-center justify-center">
        {/* BX Central Unit */}
        <div className="w-36 h-36 md:w-56 md:h-56 bg-slate-900/40 border border-blue-500/20 rounded-[40px] md:rounded-[64px] absolute flex flex-col items-center justify-center shadow-2xl backdrop-blur-3xl transition-transform hover:scale-105">
           <div className="text-blue-500 font-black text-5xl md:text-8xl italic tracking-tighter mb-1 animate-[core-pulse_4s_ease-in-out_infinite]">BX</div>
           <div className="text-[6px] md:text-[9px] font-black text-blue-400/40 uppercase tracking-[0.5em]">Neural Core v2.5</div>
        </div>
        
        {/* Orbital HUD Rings */}
        <div className="hud-ring w-[280px] h-[280px] md:w-[380px] md:h-[380px]" style={{ transform: 'rotateX(90deg)' }}></div>
        <div className="hud-ring w-[350px] h-[350px] md:w-[480px] md:h-[480px]" style={{ transform: 'rotateY(90deg)' }}></div>
        
        {/* Floating Data Nodes */}
        {[0, 90, 180, 270].map((deg, i) => (
          <div 
            key={i} 
            className="absolute"
            style={{ 
              transform: `rotateY(${deg}deg) translateZ(120px) md:translateZ(200px)`,
            }}
          >
            <div className="bg-white/80 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-2xl border border-white/50 animate-[float-node_5s_ease-in-out_infinite]" style={{ animationDelay: `${i * 1.2}s` }}>
              <div className="w-8 md:w-10 h-1 bg-blue-600/30 rounded-full mb-1"></div>
              <div className="w-5 md:w-6 h-1 bg-blue-400/20 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Scalability HUD Overlay (Minimalist) */}
      <div className="absolute bottom-[-40px] md:bottom-2 left-1/2 -translate-x-1/2 w-full text-center z-20">
         <div className="inline-block bg-slate-900/50 backdrop-blur-2xl border border-white/10 px-8 py-6 md:px-12 md:py-10 rounded-[32px] md:rounded-[48px] shadow-2xl transition-all hover:border-blue-500/30">
            <div className="text-[8px] md:text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] mb-2 md:mb-4">Scalability Index</div>
            <div className="text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-none mb-2">A+++</div>
            <div className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
               Diagnostic Infrastructure
            </div>
         </div>
      </div>
    </div>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-7 md:py-9 flex justify-between items-center text-left hover:bg-slate-50/50 px-2 transition-all rounded-2xl"
      >
        <span className="text-base md:text-xl font-black tracking-tight pr-8 uppercase italic leading-tight text-slate-800 transition-colors group-hover:text-blue-600">{question}</span>
        <div className={`shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full border border-slate-200 flex items-center justify-center transition-all ${isOpen ? 'bg-blue-600 border-blue-600 text-white rotate-180 shadow-lg' : 'text-slate-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[600px] pb-10 px-2' : 'max-h-0'}`}>
        <p className="text-slate-500 font-medium leading-relaxed max-w-3xl whitespace-pre-line text-sm md:text-lg pt-5 border-t border-slate-100">{answer}</p>
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
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['hero']));
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set(prev).add(entry.target.id));
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('section').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const languages: { id: Language; label: string }[] = [
    { id: 'ru', label: 'Русский' },
    { id: 'en', label: 'English' },
    { id: 'kz', label: 'Қазақша' },
  ];

  const isVisible = (id: string) => visibleSections.has(id);

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden font-['Inter'] selection:bg-blue-600 selection:text-white">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-2xl z-[100] border-b border-slate-100 h-20 md:h-24">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-2xl shadow-blue-500/30 text-2xl transition-transform group-hover:rotate-12">B</div>
            <span className="text-2xl font-black tracking-tighter italic uppercase">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-8">
            <div className="relative" ref={langRef}>
              <button onClick={() => setIsLangOpen(!isLangOpen)} className="px-4 py-2 hover:bg-slate-50 rounded-2xl transition-all flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest">
                {lang} <svg className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-white border border-slate-100 rounded-3xl shadow-2xl py-3 z-[110] animate-in fade-in zoom-in">
                  {languages.map((l) => (
                    <button key={l.id} onClick={() => { onLanguageChange(l.id); setIsLangOpen(false); }} className={`w-full text-left px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${lang === l.id ? 'bg-blue-50' : ''}`}>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${lang === l.id ? 'text-blue-600' : 'text-slate-500'}`}>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={onStart} className="px-6 md:px-10 py-3 md:py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl">
              {t.login}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="hero" className="pt-40 md:pt-56 pb-24 md:pb-32 px-6 bg-white overflow-visible">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-blue-100">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
              {t.heroSubtitle}
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[1.05] md:leading-[0.95] mb-10 italic uppercase">
              {t.heroTitle}<br/>
              <span className="text-blue-600 underline decoration-blue-100 underline-offset-8 decoration-8">{t.heroTitleHighlight}</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-500 mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              {t.heroDesc}
            </p>
            <button onClick={onStart} className="w-full sm:w-auto px-12 py-6 bg-blue-600 text-white rounded-[32px] font-black uppercase text-sm tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl transform hover:-translate-y-1">
              {t.startButton}
            </button>
          </div>
          <div className="relative mt-12 lg:mt-0">
            <InfrastructureHUD />
          </div>
        </div>
      </header>

      {/* Trust Stats */}
      <section id="stats" className="py-24 px-6 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-16 text-center">{t.trustTitle}</p>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {[
              { label: t.accuracy, val: '98%' },
              { label: t.statProcessed, val: '240k+' },
              { label: t.statEfficiency, val: '×4.5' },
              { label: t.statCost, val: '-70%' },
              { label: t.statError, val: '<0.2%' }
            ].map((stat, i) => (
              <div key={i} className={`text-center sm:text-left transition-all duration-1000 ${isVisible('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 leading-tight">{stat.label}</p>
                <p className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investor / Scalability Section (Integrated Chart) */}
      <section id="investor" className="py-24 md:py-32 px-6 bg-slate-950 text-white text-left overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-20">
            <div className={`lg:w-1/2 transition-all duration-1000 ${isVisible('investor') ? 'opacity-100' : 'opacity-0 -translate-x-10'}`}>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase mb-10 leading-[0.9] text-white">{t.investorTitle}</h2>
              <p className="text-xl md:text-2xl text-slate-400 mb-16 leading-relaxed font-medium">{t.investorDesc}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { t: t.invTrigger1, d: t.invTrigger1Desc },
                  { t: t.invTrigger2, d: t.invTrigger2Desc },
                  { t: t.invTrigger3, d: t.invTrigger3Desc },
                  { t: t.invTrigger4, d: t.invTrigger4Desc }
                ].map((item, i) => (
                  <div key={i} className="p-8 bg-white/5 rounded-[40px] border border-white/10 hover:bg-white/10 transition-all group">
                    <h4 className="font-black text-blue-400 uppercase italic tracking-tighter mb-3 group-hover:translate-x-1 transition-transform">{item.t}</h4>
                    <p className="text-sm text-slate-500 font-bold leading-relaxed">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Real-time Integrated Chart */}
            <div className={`lg:w-1/2 w-full bg-slate-900 p-8 md:p-14 rounded-[56px] border border-white/10 relative shadow-3xl transition-all duration-1000 delay-300 ${isVisible('investor') ? 'opacity-100' : 'opacity-0 translate-x-10'}`}>
               <div className="mb-12 flex justify-between items-center">
                  <div>
                    <h4 className="font-black text-blue-400 uppercase italic tracking-tight text-2xl mb-2">Growth Dynamics</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Enterprise Data Flow Forecast</p>
                  </div>
                  <div className="px-5 py-2 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 animate-pulse">Live</div>
               </div>
               <div className="h-[300px] md:h-[420px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                       <defs>
                          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                             <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                       <XAxis dataKey="month" stroke="#475569" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} dy={15} />
                       <YAxis hide />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '24px', color: '#fff', fontSize: '13px', fontWeight: 'bold', padding: '16px' }}
                          itemStyle={{ color: '#60a5fa' }}
                       />
                       <Area 
                          type="monotone" 
                          dataKey="volume" 
                          stroke="#3b82f6" 
                          strokeWidth={6} 
                          fillOpacity={1} 
                          fill="url(#chartGlow)" 
                          animationDuration={2500}
                       />
                    </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Economics Section */}
      <section id="economy" className="py-24 md:py-32 px-6 bg-white text-left overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 md:mb-24 text-center">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter italic uppercase mb-6">{t.economyTitle}</h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">{t.economyDesc}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className={`bg-slate-50 p-10 md:p-20 rounded-[56px] border border-slate-100 transition-all duration-1000 ${isVisible('economy') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
               <h3 className="text-3xl font-black text-slate-400 uppercase italic mb-16 tracking-tighter">{t.traditionalModel}</h3>
               <div className="space-y-10">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-6"><span className="font-bold text-slate-400">{t.doctorSalary}</span><span className="font-black text-red-500 text-lg uppercase tracking-widest">{t.salaryRange}</span></div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-6"><span className="font-bold text-slate-400">{t.throughput}</span><span className="font-black text-red-500 text-lg uppercase tracking-widest">{t.limited}</span></div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-6"><span className="font-bold text-slate-400">{t.qualityInterp}</span><span className="font-black text-red-500 text-lg uppercase tracking-widest">{t.subjective}</span></div>
               </div>
            </div>
            <div className={`bg-blue-600 p-10 md:p-20 rounded-[56px] shadow-3xl shadow-blue-500/30 text-white relative overflow-hidden transition-all duration-1000 delay-300 ${isVisible('economy') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
               <div className="absolute top-0 right-0 p-12 text-[15rem] font-black text-white/5 italic -rotate-12 pointer-events-none translate-x-20">A+++</div>
               <h3 className="text-3xl font-black text-white uppercase italic mb-16 tracking-tighter relative z-10">{t.centralizedAnalysis}</h3>
               <div className="space-y-10 relative z-10">
                  <div className="flex justify-between items-center border-b border-white/20 pb-6"><span className="font-bold text-blue-100">{t.costSavings}</span><span className="font-black text-green-300 text-3xl tracking-tighter">{t.costReduction}</span></div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-6"><span className="font-bold text-blue-100">{t.scaling}</span><span className="font-black text-green-300 text-lg uppercase tracking-widest">{t.doctorCapacity}</span></div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-6"><span className="font-bold text-blue-100">{t.standardization}</span><span className="font-black text-green-300 text-lg uppercase tracking-widest">Standardized</span></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Legal */}
      <section id="legal" className="py-24 md:py-32 px-6 bg-white text-left">
        <div className="max-w-4xl mx-auto">
          <div className="mb-24 md:mb-32">
             <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-8">{t.legalTitle}</h2>
             <h3 className="text-4xl md:text-7xl font-black tracking-tighter italic uppercase mb-10 leading-[0.9] text-slate-900">{t.legalSubtitle}</h3>
             <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed bg-slate-50 p-8 md:p-12 rounded-[48px] border border-slate-100">{t.legalDesc}</p>
          </div>
          <div className="bg-white rounded-[56px] border border-slate-200 shadow-3xl p-10 md:p-20">
            <h4 className="text-3xl font-black uppercase italic mb-12 tracking-tighter">{t.faqTitle}</h4>
            <FAQItem question={t.faqQ1} answer={t.faqA1} />
            <FAQItem question={t.faqQ2} answer={t.faqA2} />
            <FAQItem question={t.faqQ3} answer={t.faqA3} />
            <FAQItem question={t.faqQ4} answer={t.faqA4} />
            <FAQItem question={t.faqQ5} answer={t.faqA5} />
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white py-24 px-6 border-t border-white/5 text-left">
         <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-20">
            <div className="md:col-span-2">
               <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-2xl">B</div>
                 <span className="text-3xl font-black tracking-tighter italic uppercase">{APP_NAME}</span>
               </div>
               <p className="text-slate-500 font-medium max-w-sm mb-12 leading-relaxed text-lg">{t.baicurexDefinition}</p>
            </div>
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-10">{t.b2bContacts}</h4>
               <p className="text-xl font-black mb-2 italic tracking-tight">baicurexai@gmail.com</p>
               <p className="text-sm text-slate-500 font-medium">{t.address}</p>
            </div>
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-10">{t.operations}</h4>
               <p className="text-sm font-black italic uppercase tracking-widest">{t.workingHours}</p>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
