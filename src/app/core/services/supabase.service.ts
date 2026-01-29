import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  user = signal<User | null>(null);
  session = signal<Session | null>(null);

  constructor() {
    this.supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_PUBLIC_KEY);

    this.supabase.auth.getSession().then(({ data }) => {
      this.session.set(data.session);
      this.user.set(data.session?.user ?? null);
    });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.session.set(session);
      this.user.set(session?.user ?? null);
    });
  }

  get client() {
    return this.supabase;
  }

  async signInWithGithub() {
    await this.supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: environment.APP_URL,
      },
    });
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }
}
