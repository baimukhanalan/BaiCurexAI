
import React from 'react';
import { StudyRecord } from '../types';
import { DSS_DISCLAIMER } from '../constants';
import { Language, translations } from '../translations';

interface StudyResultProps {
  study: StudyRecord;
  onApprove: (id: string) => void;
  lang: Language;
}

const StudyResult: React.FC<StudyResultProps> = ({ study, onApprove, lang }) => {
  const t = translations[lang];
  const handleDownloadPDF = () => window.print();

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 text-left">
      <style>{`@media print { .no-print { display: none !important; } .print-full { width: 100% !important; border: none !important; margin: 0 !important; } }`}</style>
      
      <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-sm border p-8 sm:p-12 flex flex-col lg:flex-row justify-between items-start gap-8 sm:gap-10 print-full">
        <div className="w-full text-slate-900">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6 no-print">
            <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-slate-950 text-white rounded-xl font-black text-[8px] sm:text-[9px] uppercase tracking-widest">DSS REPORT</span>
            <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-slate-100 text-slate-400 rounded-xl font-black text-[8px] sm:text-[9px] uppercase tracking-widest italic">ID: {study.id}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-6 sm:mb-8 leading-tight">{study.patient_name}</h2>
          <div className="grid grid-cols-2 md:flex md:items-center gap-6 sm:gap-10 font-black uppercase text-[8px] sm:text-[10px] tracking-widest">
            <div className="flex flex-col"><span className="text-slate-400 mb-1 sm:mb-2">{t.age}</span><span className="text-xs sm:text-sm text-slate-900">{study.age}</span></div>
            <div className="flex flex-col"><span className="text-slate-400 mb-1 sm:mb-2">{t.modality}</span><span className="text-xs sm:text-sm text-blue-600">{study.study_type}</span></div>
            <div className="flex flex-col col-span-2 sm:col-span-1"><span className="text-slate-400 mb-1 sm:mb-2">{t.status}</span><span className={`text-xs sm:text-sm flex items-center gap-2 ${study.is_audited ? 'text-green-500' : 'text-slate-900'}`}>
              {study.is_audited ? t.signedSealed : 'Сгенерировано ИИ'} 
            </span></div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto no-print">
          <button onClick={handleDownloadPDF} className="flex-1 lg:flex-none px-6 sm:px-10 py-4 sm:py-5 bg-slate-950 text-white rounded-2xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest hover:bg-slate-800 transition-all shadow-xl">
            {t.downloadPdf}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          <section className="bg-white rounded-[32px] sm:rounded-[40px] shadow-sm border p-8 sm:p-16 print-full relative overflow-hidden">
            <div className={`absolute top-10 right-10 border-4 rounded-full p-4 opacity-50 rotate-12 ${study.is_audited ? 'border-green-500 text-green-600' : 'border-slate-200 text-slate-300'}`}>
               <div className="text-xs font-black uppercase text-center leading-none">BaiCurex<br/>AI ANALYSIS</div>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-8 sm:mb-10 uppercase tracking-tighter italic border-b pb-6">{t.medicalReport}</h3>
            <div className="text-slate-800 leading-relaxed text-base sm:text-xl font-medium whitespace-pre-line">
              {study.ai_report}
            </div>
            <div className="mt-12 sm:mt-16 pt-8 sm:pt-16 border-t border-slate-100">
               <p className="text-[9px] sm:text-[10px] text-slate-400 italic leading-relaxed">{DSS_DISCLAIMER}</p>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 no-print space-y-6 sm:space-y-8">
           <div className="bg-slate-950 rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 sm:p-8 text-6xl sm:text-8xl opacity-10 font-black italic pointer-events-none">TRUST</div>
              <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 italic text-blue-400 uppercase tracking-tighter">{t.legalValidation}</h3>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed font-medium mb-8 sm:mb-12">{t.legalDesc}</p>
              <div className="space-y-3 sm:space-y-4">
                 <div className="flex items-center justify-between p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">{t.sealStatus}</span>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase text-green-400">{t.active}</span>
                 </div>
                 <div className="flex items-center justify-between p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">{t.securityNode}</span>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase text-blue-400">v.DSS-PRO</span>
                 </div>
              </div>
           </div>
           
           <div className="bg-white p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] border shadow-sm">
              <h4 className="font-black text-slate-900 uppercase italic text-[10px] sm:text-xs mb-4 sm:mb-6 tracking-widest">{t.shareResults}</h4>
              <button className="w-full flex items-center justify-center gap-3 py-4 border-2 border-slate-100 rounded-2xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest text-slate-900 hover:border-blue-600 hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                {t.copyLink}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudyResult;
