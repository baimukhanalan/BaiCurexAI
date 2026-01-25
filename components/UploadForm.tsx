
import React, { useState } from 'react';
import { StudyType, Gender, TaskStatus } from '../types';
import { Language, translations } from '../translations';

interface UploadFormProps {
  onUpload: (type: StudyType, name: string, dob: string, gender: Gender, file: File) => void;
  status: TaskStatus;
  progressMsg: string;
  lang: Language;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload, status, progressMsg, lang }) => {
  const t = translations[lang];
  const [type, setType] = useState<StudyType>(StudyType.EEG);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [file, setFile] = useState<File | null>(null);

  const isProcessing = status !== 'IDLE' && status !== 'COMPLETED' && status !== 'FAILED';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file && name && dob && gender !== '') {
      onUpload(type, name, dob, gender as Gender, file);
    } else {
      alert("Пожалуйста, заполните все поля формы.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto font-['Inter']">
      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-14 transition-all text-left">
        <div className="mb-10 sm:mb-14 border-b border-slate-100 pb-8 sm:pb-10">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100">Lab Interface</div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">{t.newAnalysisInit}</h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 font-medium">{t.uploadHint}</p>
        </div>
        
        {isProcessing ? (
          <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center">
            <div className="relative mb-10 sm:mb-12">
              <div className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin shadow-[0_0_25px_rgba(59,130,246,0.2)]"></div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-slate-900 text-xl italic">BX</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 uppercase italic tracking-tighter">{t.laboratoryProcessing}</h3>
            <div className="bg-blue-50 px-4 py-2 rounded-full mb-10 border border-blue-100">
              <p className="text-blue-600 font-black animate-pulse uppercase tracking-widest text-[10px] sm:text-xs">
                {progressMsg || t.syncing}
              </p>
            </div>
            <div className="w-full max-w-sm bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner p-0.5">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(59,130,246,0.4)] relative" 
                style={{ width: status === 'ANALYZING' ? '60%' : status === 'GENERATING_REPORT' ? '90%' : '25%' }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
            <div className="grid grid-cols-2 gap-4 sm:gap-8">
              <button
                type="button"
                onClick={() => setType(StudyType.EEG)}
                className={`py-8 sm:py-12 rounded-3xl border-2 flex flex-col items-center gap-4 transition-all group ${type === StudyType.EEG ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-2xl shadow-blue-500/10' : 'border-slate-50 text-slate-400 hover:border-slate-200 bg-slate-50/30'}`}
              >
                <div className={`p-4 rounded-2xl transition-all ${type === StudyType.EEG ? 'bg-blue-600 text-white shadow-xl rotate-3' : 'bg-white text-slate-200'}`}>
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span className="font-black uppercase tracking-[0.2em] text-[11px] sm:text-xs">{t.eegAnalysis}</span>
              </button>
              <button
                type="button"
                onClick={() => setType(StudyType.ECG)}
                className={`py-8 sm:py-12 rounded-3xl border-2 flex flex-col items-center gap-4 transition-all group ${type === StudyType.ECG ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-2xl shadow-blue-500/10' : 'border-slate-50 text-slate-400 hover:border-slate-200 bg-slate-50/30'}`}
              >
                <div className={`p-4 rounded-2xl transition-all ${type === StudyType.ECG ? 'bg-blue-600 text-white shadow-xl -rotate-3' : 'bg-white text-slate-200'}`}>
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
                <span className="font-black uppercase tracking-[0.2em] text-[11px] sm:text-xs">{t.ecgAnalysis}</span>
              </button>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2 block ml-1">{t.patientName}</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-6 py-4 sm:py-5 bg-slate-50 border border-slate-100 text-slate-900 font-bold rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm sm:text-base" placeholder={t.placeholderName} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2 block ml-1">{t.dob}</label>
                  <input required type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-6 py-4 sm:py-5 bg-slate-50 border border-slate-100 text-slate-900 font-bold rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm sm:text-base" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2 block ml-1">{t.gender}</label>
                  <select required value={gender} onChange={(e) => setGender(e.target.value as Gender)} className="w-full px-6 py-4 sm:py-5 bg-slate-50 border border-slate-100 text-slate-900 font-bold rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm sm:text-base appearance-none">
                    <option value="" disabled>Пол</option>
                    <option value={Gender.MALE}>{t.male}</option>
                    <option value={Gender.FEMALE}>{t.female}</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 block ml-1">{t.signalTransfer}</label>
                <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-10 sm:p-16 text-center hover:border-blue-500 transition-all relative cursor-pointer bg-slate-50/20">
                  <input required type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className={`mx-auto mb-6 w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${file ? 'bg-green-500 text-white' : 'bg-white text-slate-300 shadow-xl'}`}>
                    {file ? <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>}
                  </div>
                  <p className="text-sm font-black text-slate-900 uppercase italic">{file ? file.name : t.filePlaceholder}</p>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-950 text-white font-black py-6 sm:py-7 rounded-3xl hover:bg-blue-600 transition-all uppercase tracking-[0.3em] active:scale-[0.98]">
              {t.runAnalysis}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
