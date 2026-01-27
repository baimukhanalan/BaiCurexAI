
import React from 'react';
import { StudyRecord } from '../types';
import { Language, translations } from '../translations';

interface StudyResultProps {
  study: StudyRecord;
  onApprove: (id: string) => void;
  lang: Language;
}

const StudyResult: React.FC<StudyResultProps> = ({ study, lang }) => {
  const t = translations[lang];
  const handleDownloadPDF = () => {
    window.print();
  };

  const formattedDob = study.patient_dob 
    ? new Date(study.patient_dob).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US') 
    : 'N/A';

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 text-left fade-in">
      <style>{`
        @media print { 
          .no-print { display: none !important; } 
          .print-full { width: 100% !important; border: none !important; margin: 0 !important; box-shadow: none !important; padding: 0 !important; } 
          body { background-color: white !important; color: black !important; }
          .report-container { border: 1px solid #000 !important; padding: 40px !important; border-radius: 0 !important; }
          .medical-font { font-family: 'Courier New', Courier, monospace !important; font-size: 11pt !important; line-height: 1.6 !important; }
        }
        .medical-font { 
          font-family: 'Inter', sans-serif; 
          white-space: pre-line;
          line-height: 1.8;
          color: #0f172a;
        }
      `}</style>
      
      {/* Patient Meta Panel */}
      <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-sm border p-8 sm:p-12 flex flex-col lg:flex-row justify-between items-start gap-8 print-full report-container">
        <div className="w-full text-slate-900">
          <div className="flex flex-wrap items-center gap-3 mb-6 no-print">
            <span className="px-4 py-1.5 bg-slate-950 text-white rounded-xl font-black text-[9px] uppercase tracking-widest italic">BaiCurex Expert Node v2.5</span>
            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl font-black text-[9px] uppercase tracking-widest italic border border-blue-100">Draft Clinical Conclusion</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter mb-8 leading-tight uppercase italic">{study.patient_name}</h2>
          <div className="grid grid-cols-2 md:flex md:items-center gap-8 sm:gap-12 font-black uppercase text-[10px] tracking-widest border-t border-slate-100 pt-8">
            <div className="flex flex-col"><span className="text-slate-400 mb-2">{t.dobShort}</span><span className="text-sm text-slate-900">{formattedDob}</span></div>
            <div className="flex flex-col"><span className="text-slate-400 mb-2">{t.age}</span><span className="text-sm text-slate-900">{study.age}</span></div>
            <div className="flex flex-col"><span className="text-slate-400 mb-2">Modality</span><span className="text-sm text-blue-600 font-black">{study.study_type}</span></div>
            <div className="flex flex-col"><span className="text-slate-400 mb-2">System ID</span><span className="text-sm text-slate-900 uppercase font-mono">{study.id}</span></div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto no-print">
          <button onClick={handleDownloadPDF} className="flex-1 lg:flex-none px-8 py-5 bg-slate-950 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-95">
            {t.downloadPdf}
          </button>
        </div>
      </div>

      {/* Clinical Text Area */}
      <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-sm border p-8 sm:p-16 print-full report-container relative overflow-hidden">
        {/* Physician Sign-off Watermark (No-print) */}
        <div className="absolute top-10 right-10 border-4 border-slate-100 rounded-full p-10 opacity-20 rotate-12 pointer-events-none no-print">
           <div className="text-base font-black uppercase text-center leading-none text-slate-300 tracking-widest">Awaiting<br/>Review</div>
        </div>
        
        <div className="medical-font text-base md:text-xl font-medium tracking-tight bg-white p-2">
          {study.ai_report}
        </div>

        {/* Footer Signature Block */}
        <div className="mt-24 pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-end gap-10">
           <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest max-w-sm italic">
              Infrastructure Node: BX-AST-01. Report generated for clinical decision support.
           </div>
           <div className="w-64 border-b-2 border-slate-900 pb-3 text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Physician Signature Slot</span>
           </div>
        </div>
      </div>
      
      <div className="no-print">
         <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center italic leading-relaxed">
            Clinical responsibility belongs solely to the attending physician. This document is a technical analytical report from a Decision Support System.
         </div>
      </div>
    </div>
  );
};

export default StudyResult;
