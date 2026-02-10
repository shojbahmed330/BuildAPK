
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Smartphone, Loader2, Zap, Cpu, LogOut, Check, Rocket, Settings,
  Download, Globe, Activity, Terminal, ShieldAlert, Package as PackageIcon, QrCode, 
  AlertCircle, Key, Mail, ArrowLeft, FileCode, ShoppingCart, User as UserIcon,
  ChevronRight, Github, Save, Trash2, Square, Circle, RefreshCw, Fingerprint,
  User, Lock, Eye, EyeOff, MessageSquare, Monitor, CreditCard, Upload, X, ShieldCheck,
  FileJson, Layout, Users, BarChart3, Clock, Wallet, CheckCircle2, XCircle, Search, TrendingUp,
  Plus, Edit2, Ban, ShieldX, LayoutDashboard, History, Gift, Filter, Bell, ListTodo,
  Trophy, Star, Award, Layers, Target, Code2, Sparkles, BrainCircuit, ShieldEllipsis, 
  Fingerprint as BioIcon, Camera, Laptop, Tablet, Menu, Smartphone as MobileIcon, Eye as ViewIcon, ExternalLink, Calendar, Coins, CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppMode, ChatMessage, User as UserType, GithubConfig, Package, Transaction, ActivityLog } from './types';
import { GeminiService } from './services/geminiService';
import { DatabaseService } from './services/dbService';
import { GithubService } from './services/githubService';

// --- BIOMETRIC SCAN PAGE ---
const ScanPage: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [isScanning, setIsScanning] = useState(false);
  const handleStartAuth = () => {
    setIsScanning(true);
    setTimeout(() => onFinish(), 2000);
  };
  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-[#0a0110] text-white relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,45,117,0.15)_0%,_transparent_70%)] opacity-50"></div>
      <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
        <div className="mb-12 space-y-2">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-pink-400 to-pink-600 drop-shadow-[0_0_20px_rgba(255,45,117,0.4)]">OneClick Studio</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500/60">Secure Uplink System • AI Core</p>
        </div>
        <div onClick={!isScanning ? handleStartAuth : undefined} className={`relative w-40 h-40 flex items-center justify-center cursor-pointer transition-transform active:scale-95 group mb-12`}>
          <div className={`absolute inset-0 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all ${!isScanning ? 'animate-pulse' : ''}`}></div>
          <Fingerprint size={isScanning ? 80 : 70} className={`${isScanning ? 'text-pink-400 scale-110' : 'text-pink-600'} transition-all relative z-10 drop-shadow-[0_0_25px_rgba(255,45,117,0.6)] ${!isScanning ? 'animate-[float_3s_ease-in-out_infinite]' : ''}`} />
          {isScanning && <div className="absolute top-0 left-0 w-full h-1 bg-pink-400 shadow-[0_0_25px_#ff2d75] rounded-full animate-[scanning_1.5s_infinite] z-20"></div>}
        </div>
        <h2 className={`text-sm md:text-xl font-bold tracking-widest uppercase ${isScanning ? 'text-pink-400' : 'text-slate-500'}`}>{isScanning ? 'Identity Scanning...' : 'Touch sensor to initiate login'}</h2>
      </div>
      <style>{`@keyframes scanning { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } } @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }`}</style>
    </div>
  );
};

// --- AUTH PAGE ---
const AuthPage: React.FC<{ onLoginSuccess: (user: UserType) => void }> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const db = DatabaseService.getInstance();
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    try {
      if (isForgot) { await db.resetPassword(formData.email); setResetSent(true); } 
      else {
        const res = isRegister ? await db.signUp(formData.email, formData.password, formData.name) : await db.signIn(formData.email, formData.password);
        if (res.error) throw res.error; if (isRegister) { alert("Registration Successful!"); setIsRegister(false); return; }
        const userData = await db.getUser(formData.email, res.data.user?.id);
        if (userData) onLoginSuccess(userData);
      }
    } catch (error: any) { alert(error.message); } finally { setIsLoading(false); }
  };
  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-[#0a0110] text-white p-4">
      <div className="relative w-full max-w-[420px] h-[550px] [perspective:1200px]">
        <div className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] ${isRegister ? '[transform:rotateY(-180deg)]' : ''}`}>
          <div className="absolute inset-0 [backface-visibility:hidden] glass-tech rounded-[3rem] p-10 flex flex-col justify-center border-pink-500/20 shadow-2xl">
            <h2 className="text-3xl font-black mb-8">System <span className="text-pink-500">Login</span></h2>
            <form onSubmit={handleAuth} className="space-y-5">
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="developer@studio" />
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="••••••••" />
              <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all">{isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Execute Login'}</button>
            </form>
            <button onClick={() => setIsRegister(true)} className="mt-6 text-xs text-pink-400 font-bold hover:underline">New developer? Registry here</button>
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] glass-tech rounded-[3rem] p-10 flex flex-col justify-center border-pink-500/20 shadow-2xl [transform:rotateY(180deg)]">
            <h2 className="text-3xl font-black mb-8">New <span className="text-pink-500">Registry</span></h2>
            <form onSubmit={handleAuth} className="space-y-5">
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="Full Name" />
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="Email" />
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="••••••••" />
              <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all">{isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Join Studio'}</button>
            </form>
            <button onClick={() => setIsRegister(false)} className="mt-6 text-xs text-pink-400 font-bold hover:underline">Already registered? Access terminal</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ADMIN LOGIN & PANEL ---
const AdminLoginPage: React.FC<{ onLoginSuccess: (user: UserType) => void }> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const db = DatabaseService.getInstance();
  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    try {
      const res = await db.signIn(formData.email, formData.password);
      const userData = await db.getUser(formData.email, res.data.user?.id);
      if (userData && userData.isAdmin) onLoginSuccess(userData);
      else throw new Error("Access Denied.");
    } catch (error: any) { alert(error.message); } finally { setIsLoading(false); }
  };
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0a0110] text-white p-4">
      <div className="glass-tech p-10 rounded-[3rem] w-full max-w-md border-pink-500/20 shadow-2xl">
        <h2 className="text-3xl font-black text-center mb-8">Admin <span className="text-pink-500">Terminal</span></h2>
        <form onSubmit={handleAdminAuth} className="space-y-6">
          <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm" placeholder="Admin ID" />
          <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm" placeholder="Master Key" />
          <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm">{isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Authorize Access'}</button>
        </form>
      </div>
    </div>
  );
};

const AdminPanel: React.FC<{ user: UserType }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'payments' | 'packages' | 'logs'>('stats');
  const [stats, setStats] = useState<any>({ totalRevenue: 0, usersToday: 0, topPackage: 'N/A', salesCount: 0, chartData: [] });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [adminUsers, setAdminUsers] = useState<UserType[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const db = DatabaseService.getInstance();
  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') setStats(await db.getAdminStats());
      if (activeTab === 'payments') setTransactions(await db.getAdminTransactions());
      if (activeTab === 'packages') setPackages(await db.getPackages());
      if (activeTab === 'logs') setActivityLogs(await db.getActivityLogs());
      if (activeTab === 'users') { const { data } = await db.supabase.from('users').select('*').order('created_at', { ascending: false }); setAdminUsers(data || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, [activeTab]);
  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-[#050108]">
      <aside className="w-full md:w-64 border-r border-pink-500/10 bg-black/40 p-6 flex flex-col gap-2">
        <h2 className="text-xl font-black text-pink-500 mb-8">ADMIN HQ</h2>
        {['stats', 'users', 'payments', 'packages', 'logs'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-xs font-black uppercase transition-all ${activeTab === tab ? 'bg-pink-600 text-white' : 'text-slate-500'}`}>{tab}</button>
        ))}
      </aside>
      <main className="flex-1 p-10 overflow-y-auto">
        {loading ? <Loader2 className="animate-spin mx-auto text-pink-500" size={40}/> : (
          <div className="max-w-6xl mx-auto space-y-8">
            {activeTab === 'stats' && <div className="grid grid-cols-4 gap-6">
              <div className="glass-tech p-8 rounded-3xl">Total: ৳{stats.totalRevenue}</div>
              <div className="glass-tech p-8 rounded-3xl">Users Today: {stats.usersToday}</div>
            </div>}
            {activeTab === 'users' && <div className="glass-tech rounded-3xl overflow-hidden"><table className="w-full text-xs"><tbody>{adminUsers.map(u => <tr key={u.id} className="border-b border-white/5"><td className="p-4">{u.email}</td><td className="p-4">{u.tokens} Tokens</td></tr>)}</tbody></table></div>}
            {activeTab === 'payments' && <div className="glass-tech rounded-3xl overflow-hidden"><table className="w-full text-xs"><tbody>{transactions.map(tx => <tr key={tx.id} className="border-b border-white/5"><td className="p-4">{tx.user_email}</td><td className="p-4">৳{tx.amount}</td><td className="p-4">{tx.status}</td></tr>)}</tbody></table></div>}
          </div>
        )}
      </main>
    </div>
  );
};

// --- MAIN APP ---
const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isScanned, setIsScanned] = useState(false);
  const [mode, setMode] = useState<AppMode>(AppMode.PREVIEW);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectFiles, setProjectFiles] = useState<Record<string, string>>({ 'index.html': '<h1>OneClick Studio</h1>' });
  const [selectedFile, setSelectedFile] = useState('index.html');
  const [githubConfig, setGithubConfig] = useState<GithubConfig>({ token: '', repo: '', owner: '' });
  const [buildStatus, setBuildStatus] = useState<{ status: 'idle' | 'pushing' | 'building' | 'success' | 'error', message: string, apkUrl?: string, webUrl?: string }>({ status: 'idle', message: '' });
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview'>('preview');
  const [packages, setPackages] = useState<Package[]>([]);
  const [isConnectingGit, setIsConnectingGit] = useState(false);

  const gemini = useRef(new GeminiService());
  const db = DatabaseService.getInstance();
  const github = useRef(new GithubService());

  useEffect(() => {
    const initApp = async () => {
      const session = await db.getCurrentSession();
      if (session?.user) {
        let userData = await db.getUser(session.user.email || '', session.user.id);
        
        // OAuth Callback হ্যান্ডলিং: যদি নতুন সেশনে provider_token থাকে
        if (session.provider_token && userData) {
          try {
            // ১. GitHub ইউজার ডিটেইলস ফেচ করা
            const ghRes = await fetch('https://api.github.com/user', {
              headers: { 'Authorization': `token ${session.provider_token}` }
            });
            const ghData = await ghRes.json();
            
            // ২. ডাটাবেজে অটোমেটিক সেভ করা (একবারই হবে)
            if (ghData.login) {
              await db.updateGithubConfig(userData.id, {
                token: session.provider_token,
                owner: ghData.login,
                repo: userData.github_repo || 'my-awesome-app'
              });
              // ফ্রেশ ডাটা লোড করা
              userData = await db.getUser(session.user.email || '', session.user.id);
            }
          } catch (e) { console.error("GH Sync Error:", e); }
        }

        if (userData) {
          setUser(userData); 
          setIsScanned(true);
          setGithubConfig({
            token: userData.github_token || '',
            owner: userData.github_owner || '',
            repo: userData.github_repo || ''
          });
        }
      }
      setAuthLoading(false);
    };

    initApp();
    db.getPackages().then(setPackages);
  }, []);

  const handleLogout = async () => { await db.signOut(); setUser(null); setIsScanned(false); };

  // OAuth কানেকশন ট্রিগার
  const handleConnectGithub = async () => {
    setIsConnectingGit(true);
    try {
      await db.connectWithGithub();
    } catch (e: any) {
      alert(e.message);
      setIsConnectingGit(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    const text = input; setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() }]);
    setIsGenerating(true);
    try {
      const res = await gemini.current.generateWebsite(text, projectFiles, messages);
      if (res.files) setProjectFiles(prev => ({ ...prev, ...res.files }));
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: res.answer, timestamp: Date.now(), ...res }]);
      if (user) { const updated = await db.useToken(user.id, user.email); if (updated) setUser(updated); }
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const handleBuildAPK = async () => {
    if (!githubConfig.token || !githubConfig.owner) {
      alert("GitHub কানেক্ট করা নেই। প্রোফাইল পেজ থেকে Connect GitHub বাটনে ক্লিক করুন।");
      setMode(AppMode.PROFILE);
      return;
    }
    setBuildStatus({ status: 'pushing', message: 'Uplinking code to GitHub...' });
    setMode(AppMode.EDIT);
    try {
      await github.current.pushToGithub(githubConfig, projectFiles);
      setBuildStatus({ status: 'building', message: 'Building APK (3-5 mins)...' });
      const checkInterval = setInterval(async () => {
        const details = await github.current.getLatestApk(githubConfig);
        if (details) {
          clearInterval(checkInterval);
          setBuildStatus({ status: 'success', message: 'APK Ready!', apkUrl: details.downloadUrl, webUrl: details.webUrl });
        }
      }, 15000);
    } catch (e: any) { setBuildStatus({ status: 'error', message: e.message || 'Build system failure.' }); }
  };

  if (authLoading) return <div className="h-screen w-full flex items-center justify-center bg-[#0a0110] text-pink-500"><Loader2 className="animate-spin" size={40}/></div>;
  if (!user) return isScanned ? <AuthPage onLoginSuccess={setUser} /> : <ScanPage onFinish={() => setIsScanned(true)} />;
  if (user.isAdmin && mode === AppMode.ADMIN) return <div className="h-screen bg-[#0a0110]"><AdminPanel user={user} /></div>;

  return (
    <div className="h-[100dvh] flex flex-col text-slate-100 bg-[#0a0110] overflow-hidden">
      <header className="h-20 border-b border-pink-500/10 glass-tech flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg"><Cpu size={20} className="text-white"/></div>
          <span className="font-black uppercase tracking-tighter">OneClick <span className="text-pink-400">Studio</span></span>
        </div>
        <nav className="hidden lg:flex bg-black/40 rounded-xl p-1 border border-white/5">
          {[AppMode.PREVIEW, AppMode.EDIT, AppMode.SHOP, AppMode.PROFILE].map(m => (
            <button key={m} onClick={() => setMode(m)} className={`px-6 py-2 text-[10px] font-black uppercase rounded-lg ${mode === m ? 'active-nav-pink' : 'text-slate-400 hover:text-white'}`}>{m}</button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-xs text-pink-400 font-bold bg-pink-500/10 px-4 py-2 rounded-full">{user.tokens} Tokens</span>
          <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><LogOut size={20}/></button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {mode === AppMode.PREVIEW ? (
          <div className="flex-1 flex flex-col lg:flex-row h-full">
            <section className={`w-full lg:w-[450px] border-r border-pink-500/10 flex flex-col bg-[#01040f]/50 backdrop-blur-xl h-full ${mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
              <div className="flex-1 p-6 overflow-y-auto space-y-6 pb-40">
                {messages.map(m => (
                  <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${m.role === 'user' ? 'bg-pink-600' : 'bg-slate-900/90 border border-pink-500/20'}`}>{m.content}</div>
                  </div>
                ))}
              </div>
              <div className="p-6 absolute bottom-0 w-full lg:w-[450px]">
                <div className="relative glass-tech rounded-2xl p-2 flex items-center gap-2">
                  <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Describe your app..." className="flex-1 bg-transparent p-4 text-xs h-16 outline-none resize-none" />
                  <button onClick={handleSend} disabled={isGenerating} className="p-4 bg-pink-600 rounded-2xl"><Send size={18}/></button>
                </div>
              </div>
            </section>
            <section className={`flex-1 flex flex-col items-center justify-center p-4 relative ${mobileTab === 'chat' ? 'hidden lg:flex' : 'flex'}`}>
              <div className="w-full max-w-[360px] h-[720px] bg-slate-900 rounded-[3.5rem] border-[8px] border-slate-800 overflow-hidden flex flex-col shadow-2xl">
                <iframe srcDoc={projectFiles['index.html']} className="flex-1 w-full bg-white" />
              </div>
              <button onClick={handleBuildAPK} className="absolute bottom-10 right-10 flex items-center gap-3 px-8 py-4 bg-pink-600 rounded-2xl font-black uppercase text-xs shadow-xl"><Rocket size={18}/> Build APK</button>
            </section>
          </div>
        ) : mode === AppMode.PROFILE ? (
          <div className="flex-1 p-10 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
              <div className="glass-tech p-12 rounded-[3rem] border-pink-500/10 flex items-center gap-8">
                <img src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="w-32 h-32 rounded-[2.5rem] border-4 border-pink-500/20 shadow-2xl" />
                <div className="space-y-2">
                  <h2 className="text-4xl font-black">{user.name}</h2>
                  <span className="text-pink-400 font-bold bg-pink-500/5 px-3 py-1 rounded-lg border border-pink-500/10">{user.email}</span>
                </div>
              </div>

              {/* GitHub OAuth Integration Section */}
              <div className="glass-tech p-10 rounded-[2.5rem] border-white/5 space-y-8 shadow-xl text-center">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center justify-center gap-3"><Github className="text-pink-500"/> GitHub <span className="text-pink-500">Integration</span></h3>
                
                {user.github_token ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-3 text-green-400 bg-green-400/10 py-4 rounded-2xl border border-green-400/20">
                      <CheckCircle size={20}/>
                      <span className="font-bold">Connected as @{user.github_owner}</span>
                    </div>
                    <p className="text-xs text-slate-500">আপনার গিটহাব অ্যাকাউন্টটি সফলভাবে লিঙ্ক করা হয়েছে। এখন আপনি সরাসরি বিল্ড অপশন ব্যবহার করতে পারবেন।</p>
                    <button onClick={handleConnectGithub} className="text-[10px] text-pink-400 uppercase font-black tracking-widest hover:underline">Re-connect Account</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-sm text-slate-400">আপনার গিটহাব অ্যাকাউন্ট কানেক্ট করুন যাতে সিস্টেম অটোমেটিক রিপোজিটরি তৈরি এবং বিল্ড করতে পারে।</p>
                    <button 
                      disabled={isConnectingGit} 
                      onClick={handleConnectGithub} 
                      className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-3 hover:bg-pink-500 hover:text-white transition-all group"
                    >
                      {isConnectingGit ? <Loader2 className="animate-spin"/> : <Github className="group-hover:scale-110 transition-transform"/>}
                      Connect GitHub Account
                    </button>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Safe & Secure OAuth Link</p>
                  </div>
                )}
              </div>
              
              <button onClick={handleLogout} className="w-full py-6 bg-red-600/10 border border-red-600/20 text-red-500 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-red-600 hover:text-white transition-all">টার্মিনাল থেকে প্রস্থান করুন</button>
            </div>
          </div>
        ) : mode === AppMode.EDIT ? (
          <div className="flex-1 flex overflow-hidden">
            {buildStatus.status === 'idle' ? (
              <>
                <aside className="w-64 border-r border-pink-500/10 bg-black/20 p-4 space-y-2 overflow-y-auto">
                  {Object.keys(projectFiles).map(file => (
                    <button key={file} onClick={() => setSelectedFile(file)} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold ${selectedFile === file ? 'bg-pink-500/10 text-pink-400' : 'text-slate-500'}`}>{file}</button>
                  ))}
                </aside>
                <main className="flex-1 bg-[#050108] p-4 flex flex-col">
                  <textarea value={projectFiles[selectedFile]} onChange={e => setProjectFiles(prev => ({...prev, [selectedFile]: e.target.value}))} className="flex-1 w-full bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-xs text-slate-300 outline-none resize-none" />
                  <button onClick={handleBuildAPK} className="mt-4 px-8 py-3 bg-pink-600 rounded-xl text-xs font-black uppercase">Start Build Sequence</button>
                </main>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-10">
                <div className="glass-tech p-16 rounded-[3rem] text-center max-w-2xl w-full">
                  {buildStatus.status === 'success' ? (
                    <div className="space-y-8">
                      <CheckCircle2 size={80} className="mx-auto text-green-400 animate-bounce"/>
                      <h2 className="text-4xl font-black">Build Successful</h2>
                      <div className="flex gap-4 justify-center">
                        <a href={buildStatus.apkUrl} target="_blank" className="px-10 py-5 bg-pink-600 rounded-2xl font-black uppercase text-sm">Download APK</a>
                        <button onClick={() => setBuildStatus({status: 'idle', message: ''})} className="px-10 py-5 bg-white/5 rounded-2xl">Back</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <Loader2 size={80} className="mx-auto text-pink-500 animate-spin"/>
                      <h2 className="text-3xl font-black uppercase">{buildStatus.status}</h2>
                      <p className="text-pink-400 font-mono">{buildStatus.message}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : mode === AppMode.SHOP ? (
          <div className="flex-1 p-10 overflow-y-auto">
            <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
              {packages.map((p, i) => (
                <div key={i} className="glass-tech p-10 rounded-[3rem] text-center hover:border-pink-500/50 transition-all">
                  <PackageIcon size={48} className="mx-auto text-pink-500 mb-6"/>
                  <h3 className="text-2xl font-black">{p.name}</h3>
                  <div className="text-5xl font-black my-6">{p.tokens} Units</div>
                  <button className="w-full py-4 bg-pink-600 rounded-2xl font-black">৳ {p.price}</button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default App;
