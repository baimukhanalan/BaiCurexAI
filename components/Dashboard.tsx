
import React from 'react';
import { StudyRecord, TriageStatus } from '../types';
import { Language, translations } from '../translations';

interface DashboardProps {
  studies: StudyRecord[];
  onViewStudy: (study: StudyRecord) => void;
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ studies, onViewStudy, lang }) => {
  const t = translations[lang];
  const stats = {
    total: studies.length,
    ready: studies.filter(s => s.status === 'READY').length,
    processing: studies.filter(s => s.status === 'PROCESSING').length,
    issued: studies.filter(s => s.status === 'ISSUED').length,
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-['Inter']">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:-translate-y-1">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t.totalStudies}</p>
          <p className="text-3xl font-black text-slate-900 tracking-tighter italic">{stats.total}</p>
        </div>
        <div className="bg-blue-600 p-6 rounded-3xl shadow-[0_15px_30px_rgba(37,99,235,0.25)] text-white transition-all hover:-translate-y-1 group">
          <p className="text-[10px] text-blue-200 font-black uppercase tracking-widest mb-1">{t.readyToIssue}</p>
          <p className="text-3xl font-black tracking-tighter italic">{stats.ready}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:-translate-y-1">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t.processing}</p>
          <div className="flex items-center gap-3">
             <p className="text-3xl font-black text-orange-600 tracking-tighter italic">{stats.processing}</p>
             {stats.processing > 0 && <div className="w-3 h-3 rounded-full bg-orange-500 animate-ping shadow-[0_0_12px_rgba(249,115,22,0.6)]"></div>}
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-900/10 text-white transition-all hover:-translate-y-1">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{t.avgTime}</p>
          <div className="flex items-end gap-1">
            <p className="text-3xl font-black text-blue-400 tracking-tighter italic">0.8</p>
            <span className="text-[10px] font-black text-slate-500 pb-1.5 uppercase">MIN</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden text-left">
        <div className="px-8 py-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">{t.studyFlow}</h2>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div> {t.ready}</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]"></div> PATHOLOGY</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">{t.identification}</th>
                <th className="px-8 py-5">{t.service}</th>
                <th className="px-8 py-5">{t.readiness}</th>
                <th className="px-8 py-5">{t.time}</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {studies.map((study) => (
                <tr key={study.id} className="hover:bg-blue-50/50 transition-all cursor-pointer group" onClick={() => onViewStudy(study)}>
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-900 text-base">{study.patient_name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">ID: {study.id}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">{study.study_type}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        study.triage_status === TriageStatus.GREEN ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
                        study.triage_status === TriageStatus.YELLOW ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.6)]' :
                        'bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]'
                      }`}></div>
                      <span className={`font-black text-[10px] uppercase tracking-widest ${
                        study.triage_status === TriageStatus.GREEN ? 'text-green-600' :
                        study.triage_status === TriageStatus.YELLOW ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {study.triage_status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-500 font-bold tabular-nums">
                    {new Date(study.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="px-6 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
                       {t.openAction}
                    </button>
                  </td>
                </tr>
              ))}
              {studies.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center text-slate-300 italic font-medium">
                    <div className="flex flex-col items-center gap-4 opacity-50">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      {t.queueEmpty}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
