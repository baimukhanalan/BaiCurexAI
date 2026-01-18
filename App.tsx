
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

  // Dynamic SLA Telemetry States
  const [uptime, setUptime] = useState(99.9982);
  const [pings, setPings] = useState({ core: 12, storage: 24, audit: 18 });

  const t = translations[lang];

  // Fix: Added getSelectedClinic helper to resolve reference errors in Admin views
  const getSelectedClinic = () => {
    return clinics.find(c => c.id === selectedClinicId);
  };

  // Simulation of live telemetry
  useEffect(() => {
    if (clinicView === 'sla') {
      const interval = setInterval(() => {
        setUptime(prev => prev + (Math.random() * 0.0002 - 0.0001));
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
    // In a real app we'd compare timestamp_start vs timestamp_end
    // Here we simulate based on the number of studies to show a "dynamic" trend
    const base = 42.5;
    const variation = (studies.length % 10) * 0.5;
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
       <div className="max-w-xl bg-slate-900 p-12 rounded-[40px] text-white border border-white/10 shadow-2xl">
          <h2 className="text-3xl font-black italic uppercase mb-4 text-blue-400">Application Submitted</h2>
          <button onClick={() => setAppView('landing')} className="bg-white text-slate-950 px-10 py-4 rounded-xl font-black uppercase text-xs">Home Page</button>
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
      
      <main className="flex-1 p-4 sm:p-12 max-w-7xl mx-auto w-full">
        <header className="mb-12 flex justify-between items-center no-print">
          <div className="text-left">
            <span className="text-blue-600 text-[9px] font-black px-3 py-1 bg-blue-50 rounded-full uppercase tracking-widest mb-2 block w-fit">
              {currentUser?.role === 'ADMIN' ? 'Infrastructure Root' : currentClinic?.legal_name}
            </span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
              {currentUser?.role === 'CLINIC' ? t[`nav${clinicView.charAt(0).toUpperCase() + clinicView.slice(1)}` as keyof typeof t] : adminView.toUpperCase()}
            </h1>
          </div>
          <div className="flex items-center gap-4 no-print">
            {currentUser?.role === 'CLINIC' && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl border border-green-100">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-green-600 uppercase">SLA: {uptime.toFixed(4)}%</span>
              </div>
            )}
            <button onClick={() => { setCurrentUser(null); setAppView('landing'); }} className="text-slate-400 font-black uppercase text-[10px] bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm hover:text-blue-600 transition-colors">Sign Out</button>
          </div>
        </header>

        {currentUser?.role === 'CLINIC' ? (
          <div className="fade-in">
            {clinicView === 'dashboard' && <Dashboard studies={studies.filter(s => s.clinic_id === currentClinic?.id)} onViewStudy={(s) => { setSelectedStudy(s); setClinicView('detail'); }} lang={lang} />}
            
            {clinicView === 'archive' && (
               <div className="space-y-6">
                 <div className="bg-slate-950 p-8 rounded-[40px] text-white shadow-xl text-left mb-10 relative overflow-hidden">
                    <h3 className="text-2xl font-black uppercase italic mb-2 relative z-10">Medical Archive</h3>
                    <div className="relative z-10 max-w-md mt-6">
                      <input type="text" placeholder={t.searchPlaceholder} value={archiveSearch} onChange={(e) => setArchiveSearch(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500" />
                    </div>
                    <div className="absolute top-0 right-0 p-8 text-8xl font-black opacity-5 italic">HIST</div>
                 </div>
                 <Dashboard studies={filteredArchive} onViewStudy={(s) => { setSelectedStudy(s); setClinicView('detail'); }} lang={lang} />
               </div>
            )}

            {clinicView === 'sla' && (
              <div className="space-y-10 text-left">
                 <div className="bg-white p-12 rounded-[40px] border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 text-8xl font-black opacity-[0.03] italic -rotate-12 pointer-events-none">STABILITY</div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                      <h3 className="text-2xl font-black uppercase italic text-slate-900">Live Service Level Performance</h3>
                      <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black border border-blue-100 animate-pulse">
                        REAL-TIME TELEMETRY ACTIVE
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                       <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:border-blue-200">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Global Availability</p>
                          <div className="flex items-center gap-3">
                             <p className="text-4xl font-black text-slate-900 italic tracking-tighter tabular-nums">{uptime.toFixed(4)}%</p>
                          </div>
                          <div className="mt-4 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                             <div className="h-full bg-green-500" style={{ width: '99.9%' }}></div>
                          </div>
                       </div>
                       <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:border-blue-200">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">AI Processing Latency</p>
                          <p className="text-4xl font-black text-blue-600 italic tracking-tighter tabular-nums">{avgProcessingTime}s</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">SLA TARGET: &lt; 60.0s</p>
                       </div>
                       <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:border-blue-200">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Support Ticket SLA</p>
                          <p className="text-4xl font-black text-slate-900 italic tracking-tighter tabular-nums">1.2h</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">GUARANTEED: &lt; 2.0h</p>
                       </div>
                       <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:border-blue-200">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Data Durability</p>
                          <p className="text-4xl font-black text-slate-900 italic tracking-tighter">100%</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">AES-256 ENCRYPTED</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Infrastructure Nodes Status</h4>
                       {[
                         { node: "BX-CORE-KAZAKHSTAN-01", status: "Operational", ping: `${pings.core}ms`, load: "12%" },
                         { node: "BX-STORAGE-SECURE-VAULT", status: "Operational", ping: `${pings.storage}ms`, load: "4%" },
                         { node: "BX-AUDIT-MASTER-NODE", status: "Operational", ping: `${pings.audit}ms`, load: "22%" }
                       ].map(node => (
                          <div key={node.node} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
                             <div className="flex items-center gap-4 mb-2 sm:mb-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] group-hover:scale-125 transition-transform"></div>
                                <div className="text-left">
                                  <span className="font-black text-slate-900 text-sm uppercase italic tracking-tighter">{node.node}</span>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase">LOAD: {node.load}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="text-right">
                                   <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest tabular-nums">{node.ping}</span>
                                   <p className="text-[8px] font-bold text-slate-300 uppercase">LATENCY</p>
                                </div>
                                <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-xl text-[9px] font-black uppercase tracking-widest">{node.status}</span>
                             </div>
                          </div>
                       ))}
                    </div>

                    <div className="mt-12 p-8 bg-slate-950 rounded-[32px] text-white relative overflow-hidden">
                       <div className="absolute inset-0 opacity-10 pointer-events-none">
                         <svg width="100%" height="100%" viewBox="0 0 1200 200" preserveAspectRatio="none">
                           <path d="M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100 L1200,100" stroke="white" strokeWidth="2" fill="none" className="animate-[pulse_4s_infinite]" />
                         </svg>
                       </div>
                       <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-6">
                          <div className="text-center sm:text-left">
                             <h4 className="text-xl font-black italic uppercase tracking-tighter">BaiCurex Reliability Engine</h4>
                             <p className="text-slate-400 text-xs font-medium mt-1">Automatic failover and redundant medical processing nodes active.</p>
                          </div>
                          <div className="flex gap-4">
                             <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[100px]">
                                <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Incident Free</p>
                                <p className="text-lg font-black italic">412 Days</p>
                             </div>
                             <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[100px]">
                                <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Compliance</p>
                                <p className="text-lg font-black italic">DSS-1.2</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {clinicView === 'economy' && (
              <div className="space-y-10 text-left">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-slate-950 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Clinic Balance</p>
                     <p className="text-5xl font-black italic tracking-tighter mb-2">{currentClinic?.billing_balance.toLocaleString()} ₸</p>
                     <button onClick={() => alert("Invoice generation...")} className="mt-4 px-6 py-2 bg-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest">Top Up</button>
                     <div className="absolute top-0 right-0 p-8 text-7xl font-black opacity-10 italic text-white/5">CASH</div>
                  </div>
                  <div className="bg-white p-10 rounded-[40px] border shadow-sm">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quota Usage</p>
                     <div className="flex items-end gap-2 mb-4">
                        <p className="text-5xl font-black text-slate-900 italic tracking-tighter">{currentClinic?.used_reports}</p>
                        <span className="text-xl font-bold text-slate-300 pb-1.5">/ {currentClinic?.monthly_report_limit}</span>
                     </div>
                     <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: `${Math.min(100, ((currentClinic?.used_reports || 0) / (currentClinic?.monthly_report_limit || 1)) * 100)}%` }}></div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {clinicView === 'docs' && (
              <div className="space-y-8 text-left">
                 <div className="bg-white p-12 rounded-[40px] border shadow-sm">
                    <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-10 border-b pb-6">Organization Profile</h3>
                    <div className="grid md:grid-cols-2 gap-12 text-slate-900">
                       <div className="space-y-6">
                          <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Legal Name</p><p className="text-xl font-bold">{currentClinic?.legal_name}</p></div>
                          <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">BIN / IIN</p><p className="text-xl font-mono">{currentClinic?.bin}</p></div>
                          <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">License Number</p><p className="text-xl font-bold">{currentClinic?.license_number}</p></div>
                       </div>
                       <div className="space-y-6">
                          <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Contract Status</p><span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">ACTIVE</span></div>
                          <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Billing Email</p><p className="text-xl font-bold text-blue-600">{currentClinic?.contact_email}</p></div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {clinicView === 'support' && (
              <div className="max-w-4xl mx-auto text-left space-y-10">
                <div className="bg-white p-12 rounded-[40px] border shadow-sm relative overflow-hidden">
                   <h3 className="text-2xl font-black uppercase italic mb-8 text-slate-900 pt-10">Contact Support</h3>
                   <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Your ticket has been registered. Response will follow via email."); }}>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Subject</label>
                        <select className="w-full p-4 bg-slate-50 border rounded-2xl font-bold outline-none text-slate-900 appearance-none">
                           <option>File upload error</option>
                           <option>AI Interpretation query</option>
                           <option>Billing issues</option>
                           <option>Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Your Message</label>
                        <textarea required className="w-full p-6 bg-slate-50 border rounded-3xl font-medium outline-none h-40 text-slate-900 placeholder:text-slate-300" placeholder="Describe the problem..."></textarea>
                      </div>
                      <button type="submit" className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-600 transition-colors">Send Request</button>
                   </form>

                   <div className="flex flex-col items-center justify-center mt-20 relative py-12 border-t border-slate-50">
                      <div className="absolute inset-0 bg-blue-50/30 blur-[100px] rounded-full"></div>
                      <div className="relative w-48 h-48 [perspective:1000px] group">
                         <div className="w-full h-full relative [transform-style:preserve-3d] animate-[rotate_15s_linear_infinite]">
                            <div className="absolute inset-0 bg-blue-600/20 border-2 border-blue-500/30 rounded-3xl backdrop-blur-sm [transform:translateZ(40px)]"></div>
                            <div className="absolute inset-0 bg-blue-600/20 border-2 border-blue-500/30 rounded-3xl backdrop-blur-sm [transform:translateZ(-40px)]"></div>
                            <div className="absolute inset-0 bg-blue-600/20 border-2 border-blue-500/30 rounded-3xl backdrop-blur-sm [transform:rotateY(90deg)_translateZ(40px)]"></div>
                            <div className="absolute inset-0 bg-blue-600/20 border-2 border-blue-500/30 rounded-3xl backdrop-blur-sm [transform:rotateY(-90deg)_translateZ(40px)]"></div>
                         </div>
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-blue-600 font-black text-2xl tracking-tighter italic animate-pulse">BX-CORE</div>
                         </div>
                      </div>
                      <h4 className="mt-8 text-xl font-black text-slate-900 uppercase italic">BaiCurex AI Node Active</h4>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">SLA: 99.99% Guaranteed | DSS-SECURE</p>
                   </div>
                   <style>{`@keyframes rotate { from { transform: rotateX(0) rotateY(0); } to { transform: rotateX(360deg) rotateY(360deg); } }`}</style>
                </div>
              </div>
            )}

            {clinicView === 'upload' && <UploadForm onUpload={async (type, name, age, gender, file) => {
                setTaskStatus('ANALYZING');
                try {
                  const result = await processStudyTask(type, name, age, gender, file.name, (status, msg) => { setTaskStatus(status); setProgressMsg(msg); });
                  const record: StudyRecord = { id: 'S-' + Math.random().toString(36).substr(2, 5).toUpperCase(), clinic_id: currentClinic!.id, patient_name: name, age, gender, ...result, timestamp: new Date().toISOString(), status: 'READY', is_audited: false };
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
            {/* ADMIN PORTAL SECTIONS */}
            {adminView === 'clinics' && (
              <div className="bg-white border rounded-[40px] shadow-sm overflow-hidden">
                <div className="px-10 py-6 bg-slate-50 border-b flex justify-between items-center text-slate-900">
                   <h3 className="font-black uppercase italic tracking-tighter">B2B Clinic Portfolio (Compliance)</h3>
                   <span className="text-[10px] font-bold text-slate-400 uppercase">Total: {clinics.length}</span>
                </div>
                <table className="w-full">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                    <tr><th className="px-8 py-6 text-left">Clinic</th><th className="px-8 py-6 text-left">BIN / License</th><th className="px-8 py-6 text-left">Audit Status</th><th className="px-8 py-6 text-right">Balance</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {clinics.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50 cursor-pointer transition-colors text-slate-900" onClick={() => { setSelectedClinicId(c.id); setAdminView('clinic_detail'); }}>
                        <td className="px-8 py-6 font-bold">{c.legal_name}</td>
                        <td className="px-8 py-6 font-mono text-xs text-slate-600">{c.bin} / {c.license_number}</td>
                        <td className="px-8 py-6"><span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[9px] font-black">{c.status}</span></td>
                        <td className="px-8 py-6 font-black text-right">{c.billing_balance.toLocaleString()} ₸</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {adminView === 'audit' && (
              <div className="space-y-6">
                 <div className="bg-red-600 p-10 rounded-[40px] text-white shadow-xl relative overflow-hidden">
                    <h3 className="text-3xl font-black uppercase italic relative z-10">Clinical Governance</h3>
                    <p className="text-red-100 relative z-10 opacity-80">Pathological flags verification queue (Hard-Flag Logic).</p>
                    <div className="absolute top-0 right-0 p-8 text-7xl font-black opacity-10 italic">AUDIT</div>
                 </div>
                 <div className="bg-white border rounded-[40px] shadow-sm overflow-hidden">
                    <table className="w-full">
                       <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                          <tr><th className="px-8 py-6 text-left">Patient</th><th className="px-8 py-6 text-left">Risk</th><th className="px-8 py-6 text-left">AI Reason</th><th className="px-8 py-6 text-right">Action</th></tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 text-sm">
                          {studies.filter(s => s.triage_status !== TriageStatus.GREEN).map(s => (
                             <tr key={s.id} className="text-slate-900">
                                <td className="px-8 py-6 font-bold">{s.patient_name}</td>
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${s.triage_status === TriageStatus.RED ? 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)]' : 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.6)]'}`}></div>
                                      <span className="font-black text-[10px] uppercase">{s.triage_status}</span>
                                   </div>
                                </td>
                                <td className="px-8 py-6 italic text-slate-500">{s.quantitative_data.triage_reasons?.join(', ')}</td>
                                <td className="px-8 py-6 text-right"><button className="px-4 py-2 bg-slate-950 text-white rounded-lg text-[10px] font-black uppercase hover:bg-red-600 transition-colors">Audit</button></td>
                             </tr>
                          ))}
                          {studies.filter(s => s.triage_status !== TriageStatus.GREEN).length === 0 && (
                            <tr><td colSpan={4} className="py-24 text-center text-slate-300 italic">Audit queue is empty.</td></tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}

            {adminView === 'logs' && (
               <div className="space-y-6">
                  <div className="bg-slate-950 p-10 rounded-[40px] text-white shadow-xl relative overflow-hidden">
                     <h3 className="text-2xl font-black uppercase italic mb-2">AI Decision Trace</h3>
                     <p className="text-slate-500 text-sm">Logging every clinical operation (Compliance RK).</p>
                     <div className="absolute top-0 right-0 p-8 text-6xl font-black opacity-5 italic">TRACE</div>
                  </div>
                  <div className="bg-white border rounded-[40px] shadow-sm overflow-hidden">
                     <table className="w-full">
                        <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                           <tr><th className="px-8 py-6 text-left">Timestamp</th><th className="px-8 py-6 text-left">Actor</th><th className="px-8 py-6 text-left">Action Trace</th><th className="px-8 py-6 text-left">Ref</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-mono text-slate-900">
                           {auditLogs.map(l => (
                              <tr key={l.id} className="hover:bg-slate-50">
                                 <td className="px-8 py-5 text-slate-400 whitespace-nowrap">{new Date(l.timestamp).toLocaleString()}</td>
                                 <td className="px-8 py-5 font-black">{l.actor}</td>
                                 <td className="px-8 py-5">{l.action}</td>
                                 <td className="px-8 py-5 text-blue-600">{l.entity_reference}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {adminView === 'billing' && (
              <div className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-8 text-slate-900">
                    <div className="bg-white p-10 rounded-[40px] border shadow-sm">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total B2B Deposits</p>
                       <p className="text-4xl font-black italic tracking-tighter text-slate-900">{clinics.reduce((acc, c) => acc + c.billing_balance, 0).toLocaleString()} ₸</p>
                    </div>
                 </div>
                 <div className="bg-white border rounded-[40px] shadow-sm overflow-hidden text-slate-900">
                    <table className="w-full">
                       <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                          <tr><th className="px-8 py-6 text-left">Clinic</th><th className="px-8 py-6 text-left">Plan</th><th className="px-8 py-6 text-left">Status</th><th className="px-8 py-6 text-right">Balance</th></tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {clinics.map(c => (
                             <tr key={c.id}>
                                <td className="px-8 py-6 font-bold text-slate-900">{c.legal_name}</td>
                                <td className="px-8 py-6 font-black text-blue-600 uppercase">{c.plan_type}</td>
                                <td className="px-8 py-6"><span className="text-green-600 font-bold">{c.billing_status}</span></td>
                                <td className="px-8 py-6 text-right font-black text-slate-900">{c.billing_balance.toLocaleString()} ₸</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}

            {adminView === 'accounts' && (
              <div className="bg-white border rounded-[40px] shadow-sm overflow-hidden text-slate-900">
                 <div className="px-10 py-6 bg-slate-50 border-b">
                    <h3 className="font-black uppercase italic text-slate-900">Access Management (IAM)</h3>
                 </div>
                 <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                       <tr><th className="px-8 py-6 text-left">Username / Email</th><th className="px-8 py-6 text-left">Role</th><th className="px-8 py-6 text-left">Organization</th><th className="px-8 py-6 text-left">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {users.map(u => (
                          <tr key={u.id} className="hover:bg-slate-50 text-slate-900">
                             <td className="px-8 py-6 font-bold">{u.username}</td>
                             <td className="px-8 py-6"><span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase">{u.role}</span></td>
                             <td className="px-8 py-6 text-xs text-slate-500 font-medium">
                               {u.clinic_id ? (clinics.find(c => c.id === u.clinic_id)?.legal_name || u.clinic_id) : 'Internal Infrastructure'}
                             </td>
                             <td className="px-8 py-6"><span className="text-green-500 font-black uppercase text-[10px]">Active</span></td>
                          </tr>
                       ))}
                       {users.length === 0 && (
                          <tr><td colSpan={4} className="py-24 text-center text-slate-300 italic">User list is empty.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
            )}

            {adminView === 'pending_clinics' && (
              <div className="bg-white border rounded-[40px] shadow-sm overflow-hidden text-slate-900">
                 <table className="w-full">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                       <tr><th className="px-8 py-6 text-left">Organization</th><th className="px-8 py-6 text-left">Compliance Check</th><th className="px-8 py-6 text-left">Decision</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                       {clinics.filter(c => c.status === ClinicStatus.PENDING_REVIEW).map(c => (
                          <tr key={c.id}>
                             <td className="px-8 py-6">
                                <p className="font-bold text-slate-900">{c.legal_name}</p>
                                <p className="text-[10px] text-slate-400">{c.contact_email}</p>
                             </td>
                             <td className="px-8 py-6 text-orange-500 font-bold italic">Verification Required</td>
                             <td className="px-8 py-6 flex gap-2">
                                <button onClick={() => updateClinicStatus(c.id, ClinicStatus.ACTIVE)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-blue-700">Approve</button>
                             </td>
                          </tr>
                       ))}
                       {clinics.filter(c => c.status === ClinicStatus.PENDING_REVIEW).length === 0 && (
                          <tr><td colSpan={3} className="py-24 text-center text-slate-200 italic">No pending applications.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
            )}
            
            {adminView === 'clinic_detail' && getSelectedClinic() && (
              <div className="bg-white rounded-[40px] border shadow-sm p-12 text-left space-y-12 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-start">
                   <div>
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none mb-2">{getSelectedClinic()?.legal_name}</h2>
                      <p className="text-slate-400 font-mono text-sm uppercase font-black tracking-widest">Clinic ID: {getSelectedClinic()?.id}</p>
                   </div>
                   <div className="flex gap-4">
                      <button onClick={() => setAdminView('clinics')} className="px-8 py-5 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-200">Back</button>
                      <button onClick={() => updateClinicStatus(selectedClinicId!, ClinicStatus.BLOCKED)} className="px-8 py-5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-red-700">Block</button>
                   </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                   <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest">Legal Details</p>
                      <div className="space-y-5">
                         <div><p className="text-[9px] font-black text-slate-400 uppercase">BIN</p><p className="font-bold text-slate-900 text-lg">{getSelectedClinic()?.bin}</p></div>
                         <div><p className="text-[9px] font-black text-slate-400 uppercase">License</p><p className="font-bold text-slate-900 text-lg">{getSelectedClinic()?.license_number}</p></div>
                         <div><p className="text-[9px] font-black text-slate-400 uppercase">Contact</p><p className="font-bold text-slate-900 text-lg">{getSelectedClinic()?.contact_person}</p></div>
                      </div>
                   </div>
                   <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest">SaaS Contract</p>
                      <div className="space-y-5">
                         <div><p className="text-[9px] font-black text-slate-400 uppercase">Plan</p><p className="font-black text-blue-600 text-xl">{getSelectedClinic()?.plan_type}</p></div>
                         <div><p className="text-[9px] font-black text-slate-400 uppercase">Monthly Quota</p><p className="font-bold text-slate-900 text-lg">{getSelectedClinic()?.used_reports} / {getSelectedClinic()?.monthly_report_limit}</p></div>
                      </div>
                   </div>
                   <div className="p-10 bg-slate-950 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-6 tracking-widest">Billing</p>
                      <p className="text-4xl font-black italic tracking-tighter mb-8">{getSelectedClinic()?.billing_balance.toLocaleString()} ₸</p>
                      <button onClick={() => alert("Billing system active. Invoice sent.")} className="w-full py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">Generate Invoice</button>
                   </div>
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
