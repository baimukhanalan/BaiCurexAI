
import React, { useState, useEffect, useMemo } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import ClinicSidebar from './components/ClinicSidebar';
import AdminSidebar from './components/AdminSidebar';
import Dashboard from './components/Dashboard';
import UploadForm from './components/UploadForm';
import StudyResult from './components/StudyResult';
import { 
  StudyRecord, StudyType, Gender, TaskStatus, AppView, 
  ClinicSubView, AdminSubView, ClinicMetadata, ClinicStatus, User, PricingPlan,
  TriageStatus
} from './types';
import { Language, translations } from './translations';
import { processStudyTask } from './services/backendSimulator';
import { databaseService } from './services/databaseService';

const App: React.FC = () => {
  const [appView, setAppView] = useState<AppView>('landing');
  const [clinicView, setClinicView] = useState<ClinicSubView>('dashboard');
  const [adminView, setAdminView] = useState<AdminSubView>('clinics');
  const [lang, setLang] = useState<Language>('en'); 
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentClinic, setCurrentClinic] = useState<ClinicMetadata | null>(null);

  const [studies, setStudies] = useState<StudyRecord[]>([]);
  const [clinics, setClinics] = useState<ClinicMetadata[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<StudyRecord | null>(null);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('IDLE');
  const [progressMsg, setProgressMsg] = useState('');
  const [archiveSearch, setArchiveSearch] = useState('');

  const [uptime, setUptime] = useState(99.9982);
  const [pings, setPings] = useState({ core: 12, storage: 24, audit: 18 });

  const t = translations[lang];

  const getSelectedClinic = () => clinics.find(c => c.id === selectedClinicId);

  useEffect(() => {
    if (clinicView === 'sla') {
      const interval = setInterval(() => {
        setUptime(prev => prev + (Math.random() * 0.0001 - 0.00005));
        setPings({
          core: Math.floor(10 + Math.random() * 5),
          storage: Math.floor(20 + Math.random() * 8),
          audit: Math.floor(15 + Math.random() * 6)
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [clinicView]);

  const avgProcessingTime = useMemo(() => {
    const base = 44.2;
    const variation = (studies.length % 15) * 0.3;
    return (base + variation).toFixed(1);
  }, [studies]);

  const loadAllData = async () => {
    try {
      const [s, c, u, l] = await Promise.all([
        databaseService.getAllStudies(),
        databaseService.getClinics(),
        databaseService.getUsers(),
        databaseService.getAuditLogs()
      ]);
      setStudies(s);
      setClinics(c);
      setUsers(u);
      setAuditLogs(l);

      if (currentUser?.clinic_id) {
        const updatedClinic = c.find(clinic => clinic.id === currentUser.clinic_id);
        if (updatedClinic) setCurrentClinic(updatedClinic);
      }
    } catch (e) {
      console.error("Critical: Data load failed", e);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [appView, adminView, clinicView]);

  const handleLogin = async (email: string, role: 'ADMIN' | 'CLINIC', password?: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPass = password?.trim();

    if (normalizedEmail === 'tahetjsc@gmail.com' && normalizedPass === 'Alan2408' && role === 'CLINIC') {
      const dbClinics = await databaseService.getClinics();
      const testClinic = dbClinics.find(c => c.id === 'C-TEST-ALAN');
      const testUser: User = { id: 'U-ALAN', username: 'tahetjsc@gmail.com', role: 'CLINIC', clinic_id: 'C-TEST-ALAN', is_active: true };
      setCurrentClinic(testClinic || null);
      setCurrentUser(testUser);
      setAppView('portal');
      setClinicView('dashboard');
      return;
    }

    if (role === 'ADMIN') {
      if (normalizedEmail === 'baicurexai@gmail.com' && normalizedPass === 'Alan2408') {
        const adminUser: User = { id: 'U-ADMIN', username: 'baicurexai@gmail.com', role: 'ADMIN', is_active: true };
        setCurrentUser(adminUser);
        setAppView('portal');
        setAdminView('clinics');
        return;
      }
    }

    const dbUsers = await databaseService.getUsers();
    const user = dbUsers.find(u => u.username.toLowerCase() === normalizedEmail && u.role === role);
    if (user && user.is_active) {
      const clinic = clinics.find(c => c.id === user.clinic_id);
      setCurrentClinic(clinic || null);
      setCurrentUser(user);
      setAppView('portal');
      role === 'ADMIN' ? setAdminView('clinics') : setClinicView('dashboard');
    } else {
      alert("Invalid login or inactive account.");
    }
  };

  const updateClinicStatus = async (id: string, status: ClinicStatus) => {
    const dbClinics = await databaseService.getClinics();
    const clinic = dbClinics.find(c => c.id === id);
    if (clinic) {
      clinic.status = status;
      await databaseService.updateClinic(clinic);
      await databaseService.log({ id: Date.now().toString(), actor: 'ADMIN', action: `Status change: ${clinic.legal_name} -> ${status}`, timestamp: new Date().toISOString(), entity_reference: id });
      await loadAllData();
    }
  };

  const filteredArchive = studies.filter(s => 
    s.clinic_id === currentClinic?.id && 
    s.status === 'READY' &&
    (s.patient_name.toLowerCase().includes(archiveSearch.toLowerCase()) || s.id.toLowerCase().includes(archiveSearch.toLowerCase()))
  );

  if (appView === 'landing') return <LandingPage onStart={() => setAppView('auth')} lang={lang} onLanguageChange={setLang} />;
  if (appView === 'auth') return <AuthPage onLogin={handleLogin} onApply={() => setAppView('onboarding_success')} lang={lang} onBack={() => setAppView('landing')} />;
  if (appView === 'onboarding_success') return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
       <div className="max-w-xl bg-slate-900 p-8 md:p-12 rounded-[32px] md:rounded-[40px] text-white border border-white/10 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-black italic uppercase mb-6 text-blue-400">Application Submitted</h2>
          <button onClick={() => setAppView('landing')} className="w-full bg-white text-slate-950 px-8 py-4 rounded-xl font-black uppercase text-xs">Home Page</button>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8fafc] font-['Inter']">
      {currentUser?.role === 'CLINIC' ? (
        <ClinicSidebar onNavigate={setClinicView} activeView={clinicView} lang={lang} />
      ) : (
        <AdminSidebar onNavigate={setAdminView} activeView={adminView} lang={lang} />
      )}
      
      <main className="flex-1 p-4 md:p-12 max-w-7xl mx-auto w-full pb-24 lg:pb-12">
        <header className="mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print text-left">
          <div className="text-left">
            <span className="text-blue-600 text-[8px] md:text-[9px] font-black px-2 md:px-3 py-1 bg-blue-50 rounded-full uppercase tracking-widest mb-1 md:mb-2 block w-fit">
              {currentUser?.role === 'ADMIN' ? 'Infrastructure Root' : currentClinic?.legal_name}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
              {currentUser?.role === 'CLINIC' ? t[`nav${clinicView.charAt(0).toUpperCase() + clinicView.slice(1)}` as keyof typeof t] : adminView.toUpperCase()}
            </h1>
          </div>
          <div className="flex items-center gap-3 md:gap-4 no-print w-full sm:w-auto">
            {currentUser?.role === 'CLINIC' && (
              <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-green-50 rounded-lg md:rounded-xl border border-green-100 flex-1 sm:flex-none">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] md:text-[10px] font-black text-green-600 uppercase">SLA: {uptime.toFixed(3)}%</span>
              </div>
            )}
            <button onClick={() => { setCurrentUser(null); setAppView('landing'); }} className="text-slate-400 font-black uppercase text-[8px] md:text-[10px] bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-slate-100 shadow-sm hover:text-blue-600 transition-colors">Sign Out</button>
          </div>
        </header>

        {currentUser?.role === 'CLINIC' ? (
          <div className="fade-in">
            {clinicView === 'dashboard' && <Dashboard studies={studies.filter(s => s.clinic_id === currentClinic?.id)} onViewStudy={(s) => { setSelectedStudy(s); setClinicView('detail'); }} lang={lang} />}
            
            {clinicView === 'archive' && (
               <div className="space-y-6">
                 <div className="bg-slate-950 p-6 md:p-8 rounded-[24px] md:rounded-[40px] text-white shadow-xl text-left mb-6 md:mb-10 relative overflow-hidden">
                    <h3 className="text-xl md:text-2xl font-black uppercase italic mb-4 relative z-10">Medical Archive</h3>
                    <div className="relative z-10 max-w-md mt-4">
                      <input type="text" placeholder={t.searchPlaceholder} value={archiveSearch} onChange={(e) => setArchiveSearch(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500 text-sm" />
                    </div>
                    <div className="absolute top-0 right-0 p-8 text-6xl md:text-8xl font-black opacity-5 italic hidden md:block">HIST</div>
                 </div>
                 <Dashboard studies={filteredArchive} onViewStudy={(s) => { setSelectedStudy(s); setClinicView('detail'); }} lang={lang} />
               </div>
            )}

            {clinicView === 'sla' && (
              <div className="space-y-6 md:space-y-10 text-left">
                 <div className="bg-white p-6 md:p-12 rounded-[24px] md:rounded-[40px] border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 text-8xl font-black opacity-[0.03] italic -rotate-12 pointer-events-none hidden md:block">STABILITY</div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10">
                      <h3 className="text-xl md:text-2xl font-black uppercase italic text-slate-900">Live Performance</h3>
                      <div className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[8px] md:text-[10px] font-black border border-blue-100 animate-pulse">
                        REAL-TIME ACTIVE
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                       <div className="p-6 md:p-8 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 transition-all">
                          <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-3 md:mb-4 tracking-widest">Global Uptime</p>
                          <div className="flex items-center gap-3">
                             <p className="text-2xl md:text-4xl font-black text-slate-900 italic tracking-tighter tabular-nums">{uptime.toFixed(4)}%</p>
                          </div>
                          <div className="mt-4 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                             <div className="h-full bg-green-500" style={{ width: '99.9%' }}></div>
                          </div>
                       </div>
                       <div className="p-6 md:p-8 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 transition-all">
                          <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-3 md:mb-4 tracking-widest">Avg. Processing</p>
                          <p className="text-2xl md:text-4xl font-black text-blue-600 italic tracking-tighter tabular-nums">{avgProcessingTime}s</p>
                       </div>
                       <div className="p-6 md:p-8 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 transition-all">
                          <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-3 md:mb-4 tracking-widest">Response</p>
                          <p className="text-2xl md:text-4xl font-black text-slate-900 italic tracking-tighter tabular-nums">1.2h</p>
                       </div>
                       <div className="p-6 md:p-8 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 transition-all">
                          <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-3 md:mb-4 tracking-widest">Security</p>
                          <p className="text-2xl md:text-4xl font-black text-slate-900 italic tracking-tighter">100%</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {clinicView === 'economy' && (
              <div className="space-y-6 md:space-y-10 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  <div className="bg-slate-950 p-8 md:p-10 rounded-[24px] md:rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                     <p className="text-[9px] md:text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Balance</p>
                     <p className="text-3xl md:text-5xl font-black italic tracking-tighter mb-4 md:mb-2">{currentClinic?.billing_balance.toLocaleString()} ₸</p>
                     <button onClick={() => alert("Invoice...")} className="px-5 py-2 bg-blue-600 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest">Top Up</button>
                  </div>
                  <div className="bg-white p-8 md:p-10 rounded-[24px] md:rounded-[40px] border shadow-sm">
                     <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quota Usage</p>
                     <div className="flex items-end gap-2 mb-4">
                        <p className="text-3xl md:text-5xl font-black text-slate-900 italic tracking-tighter">{currentClinic?.used_reports}</p>
                        <span className="text-sm md:text-xl font-bold text-slate-300 pb-1 md:pb-1.5">/ {currentClinic?.monthly_report_limit}</span>
                     </div>
                     <div className="w-full bg-slate-100 h-1.5 md:h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: `${Math.min(100, ((currentClinic?.used_reports || 0) / (currentClinic?.monthly_report_limit || 1)) * 100)}%` }}></div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {clinicView === 'docs' && (
              <div className="space-y-6 md:space-y-8 text-left">
                 <div className="bg-white p-6 md:p-12 rounded-[24px] md:rounded-[40px] border shadow-sm">
                    <h3 className="text-lg md:text-2xl font-black text-slate-900 uppercase italic mb-8 md:mb-10 border-b pb-4 md:pb-6">Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-slate-900">
                       <div className="space-y-6">
                          <div><p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-1">Legal Name</p><p className="text-base md:text-xl font-bold">{currentClinic?.legal_name}</p></div>
                          <div><p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-1">BIN / IIN</p><p className="text-base md:text-xl font-mono">{currentClinic?.bin}</p></div>
                       </div>
                       <div className="space-y-6">
                          <div><p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-1">Status</p><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest">ACTIVE</span></div>
                          <div><p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-1">Billing Email</p><p className="text-base md:text-xl font-bold text-blue-600 truncate">{currentClinic?.contact_email}</p></div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {clinicView === 'upload' && <UploadForm onUpload={async (type, name, dob, gender, file) => {
                setTaskStatus('ANALYZING');
                try {
                  const result = await processStudyTask(type, name, dob, gender, file.name, (status, msg) => { setTaskStatus(status); setProgressMsg(msg); });
                  const age = new Date().getFullYear() - new Date(dob).getFullYear();
                  const record: StudyRecord = { 
                    id: 'S-' + Math.random().toString(36).substr(2, 5).toUpperCase(), 
                    clinic_id: currentClinic!.id, 
                    patient_name: name, 
                    patient_dob: dob,
                    age, 
                    gender: gender as Gender, 
                    ...result, 
                    timestamp: new Date().toISOString(), 
                    status: 'READY', 
                    is_audited: false 
                  };
                  await databaseService.saveStudy(record);
                  const updatedClinic = { ...currentClinic! };
                  updatedClinic.used_reports += 1;
                  updatedClinic.billing_balance -= 2500;
                  await databaseService.updateClinic(updatedClinic);
                  await loadAllData();
                  setSelectedStudy(record);
                  setClinicView('detail');
                } catch (err) { setTaskStatus('FAILED'); }
            }} status={taskStatus} progressMsg={progressMsg} lang={lang} />}

            {clinicView === 'detail' && selectedStudy && <StudyResult study={selectedStudy} onApprove={async (id) => {
               const studyToUpdate = studies.find(s => s.id === id);
               if (studyToUpdate) { studyToUpdate.is_audited = true; await databaseService.saveStudy(studyToUpdate); await loadAllData(); }
            }} lang={lang} />}
          </div>
        ) : (
          <div className="fade-in space-y-8 text-left">
            {adminView === 'clinics' && (
              <div className="bg-white border rounded-[24px] md:rounded-[40px] shadow-sm overflow-hidden text-slate-900">
                <div className="px-6 md:px-10 py-5 md:py-6 bg-slate-50 border-b flex justify-between items-center">
                   <h3 className="font-black uppercase italic tracking-tighter text-sm md:text-base">Portfolio</h3>
                   <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">Total: {clinics.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead className="bg-slate-50 text-slate-400 text-[8px] md:text-[10px] uppercase font-black tracking-widest">
                      <tr><th className="px-6 md:px-8 py-4 md:py-6 text-left">Clinic</th><th className="px-6 md:px-8 py-4 md:py-6 text-left">Compliance</th><th className="px-6 md:px-8 py-4 md:py-6 text-right">Balance</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
                      {clinics.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => { setSelectedClinicId(c.id); setAdminView('clinic_detail'); }}>
                          <td className="px-6 md:px-8 py-4 md:py-6 font-bold">{c.legal_name}</td>
                          <td className="px-6 md:px-8 py-4 md:py-6"><span className="px-2 py-0.5 md:px-3 md:py-1 bg-green-50 text-green-700 rounded-full text-[8px] md:text-[9px] font-black">{c.status}</span></td>
                          <td className="px-6 md:px-8 py-4 md:py-6 font-black text-right">{c.billing_balance.toLocaleString()} ₸</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
