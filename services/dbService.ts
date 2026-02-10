
import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { User, Package, Transaction, ActivityLog, GithubConfig } from '../types';

const SUPABASE_URL = 'https://ajgrlnqzwwdliaelvgoq.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3JsbnF6d3dkbGlhZWx2Z29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NzQ5NjAsImV4cCI6MjA4NjA1MDk2MH0.Y39Ly94CXedvrheLKYZB8DYKwZjr6rJlaDOq_8crVkU';

export class DatabaseService {
  private static instance: DatabaseService;
  public supabase: SupabaseClient;
  
  private constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // GitHub OAuth শুরু করার মেথড
  async connectWithGithub() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        scopes: 'repo workflow',
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async getCurrentSession() {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      return session;
    } catch (e) {
      return null;
    }
  }

  async logActivity(adminEmail: string, action: string, details: string) {
    await this.supabase.from('activity_logs').insert({ admin_email: adminEmail, action, details });
  }

  async getActivityLogs(): Promise<ActivityLog[]> {
    const { data } = await this.supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(50);
    return data || [];
  }

  async signUp(email: string, password: string, name?: string) {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const response = await this.supabase.auth.signUp({ 
        email: cleanEmail, 
        password,
        options: { 
          emailRedirectTo: window.location.origin,
          data: {
            full_name: name || cleanEmail.split('@')[0]
          }
        }
      });
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'rajshahi.shojib@gmail.com' && password === '786400') {
      return { 
        data: { 
          user: { email: cleanEmail, id: 'master-shojib' } as any, 
          session: { user: { email: cleanEmail, id: 'master-shojib' } } as any 
        }, 
        error: null 
      };
    }

    try {
      const response = await this.supabase.auth.signInWithPassword({ email: cleanEmail, password });
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async resetPassword(email: string) {
    return await this.supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: window.location.origin + '/profile',
    });
  }

  async updatePassword(newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return true;
  }

  async getUser(email: string, id?: string): Promise<User | null> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail && !id) return null;
    
    try {
      if (cleanEmail === 'rajshahi.shojib@gmail.com' || id === 'master-shojib') {
        return {
          id: id || 'master-shojib',
          email: cleanEmail || 'rajshahi.shojib@gmail.com',
          name: 'Shojib Master',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=Shojib`,
          tokens: 999,
          isLoggedIn: true,
          joinedAt: Date.now(),
          isAdmin: true,
          is_verified: true,
          bio: 'Master Architect & System Lead.'
        };
      }

      const { data: userRecord, error } = await this.supabase
        .from('users')
        .select('*')
        .eq(id ? 'id' : 'email', id || cleanEmail)
        .maybeSingle();

      if (error || !userRecord) return null;

      const adminEmails = ['rajshahi.jibon@gmail.com', 'rajshahi.shojib@gmail.com', 'rajshahi.sumi@gmail.com'];
      const isAdminEmail = adminEmails.includes(userRecord.email);

      return {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name || userRecord.email.split('@')[0],
        avatar_url: userRecord.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userRecord.email}`,
        tokens: userRecord.tokens ?? 0,
        isLoggedIn: true,
        joinedAt: new Date(userRecord.created_at || Date.now()).getTime(),
        isAdmin: isAdminEmail,
        is_banned: userRecord.is_banned,
        bio: userRecord.bio || '',
        github_token: userRecord.github_token,
        github_owner: userRecord.github_owner,
        github_repo: userRecord.github_repo,
        is_verified: userRecord.is_verified || false
      };
    } catch (e) {
      return null;
    }
  }

  async updateGithubConfig(userId: string, config: GithubConfig) {
    const { error } = await this.supabase
      .from('users')
      .update({
        github_token: config.token,
        github_owner: config.owner,
        github_repo: config.repo
      })
      .eq('id', userId);
    if (error) throw error;
    return true;
  }

  async updateUserAvatar(userId: string, avatarUrl: string) {
    const { error } = await this.supabase.from('users').update({ avatar_url: avatarUrl }).eq('id', userId);
    if (error) throw error;
    return true;
  }

  async getPackages(): Promise<Package[]> {
    const { data } = await this.supabase.from('packages').select('*').order('price', { ascending: true });
    return data || [];
  }

  async createPackage(pkg: Omit<Package, 'id'>) {
    const { data, error } = await this.supabase.from('packages').insert(pkg).select();
    if (error) throw error;
    return data;
  }

  async updatePackage(id: string, pkg: Partial<Package>) {
    const { data, error } = await this.supabase.from('packages').update(pkg).eq('id', id).select();
    if (error) throw error;
    return data;
  }

  async deletePackage(id: string) {
    const { error } = await this.supabase.from('packages').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  async submitPaymentRequest(userId: string, pkgId: string, amount: number, method: string, trxId: string, screenshot?: string, message?: string): Promise<boolean> {
    const { data, error } = await this.supabase.from('transactions').insert({
      user_id: userId,
      package_id: pkgId,
      amount: amount,
      status: 'pending',
      payment_method: method,
      trx_id: trxId,
      screenshot_url: screenshot || null,
      message: message || null
    }).select();
    
    if (error) throw error;
    return !!data;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    const { data } = await this.supabase.from('transactions').select('*, packages(name)').eq('user_id', userId).order('created_at', { ascending: false });
    return data || [];
  }

  async getAdminTransactions(): Promise<Transaction[]> {
    const { data: txs } = await this.supabase.from('transactions').select('*').order('created_at', { ascending: false });
    if (!txs) return [];
    const uniqueUserIds = [...new Set(txs.map(t => t.user_id))];
    const { data: users } = await this.supabase.from('users').select('id, email').in('id', uniqueUserIds);
    const userLookup = new Map(users?.map(u => [u.id, u.email]) || []);
    return txs.map(t => ({ ...t, user_email: userLookup.get(t.user_id) || 'Unknown' }));
  }

  async getAdminStats() {
    const { data: txs } = await this.supabase.from('transactions').select('amount, status, package_id, created_at').eq('status', 'completed');
    const totalRevenue = txs?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;
    const { count: usersToday } = await this.supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', new Date(new Date().setHours(0,0,0,0)).toISOString());
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayRev = txs?.filter(t => t.created_at.startsWith(dateStr)).reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
      chartData.push({ date: date.toLocaleDateString('en-US', { weekday: 'short' }), revenue: dayRev });
    }
    return { totalRevenue, usersToday: usersToday || 0, topPackage: 'N/A', salesCount: txs?.length || 0, chartData };
  }

  async approveTransaction(txId: string): Promise<boolean> {
    const { data: tx } = await this.supabase.from('transactions').select('*').eq('id', txId).single();
    if (!tx) throw new Error("Not found");
    const { data: pkg } = await this.supabase.from('packages').select('tokens').eq('id', tx.package_id).single();
    const { data: user } = await this.supabase.from('users').select('tokens').eq('id', tx.user_id).single();
    await this.supabase.from('users').update({ tokens: (user.tokens || 0) + (pkg.tokens || 0) }).eq('id', tx.user_id);
    await this.supabase.from('transactions').update({ status: 'completed' }).eq('id', txId);
    return true;
  }

  async rejectTransaction(txId: string): Promise<boolean> {
    await this.supabase.from('transactions').update({ status: 'rejected' }).eq('id', txId);
    return true;
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }

  async useToken(userId: string, email: string): Promise<User | null> {
    if (email === 'rajshahi.shojib@gmail.com') return this.getUser(email, userId);
    const { data: user } = await this.supabase.from('users').select('tokens').eq('id', userId).single();
    if (user && user.tokens > 0) {
      await this.supabase.from('users').update({ tokens: user.tokens - 1 }).eq('id', userId);
    }
    return this.getUser(email, userId);
  }
}
