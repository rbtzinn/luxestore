import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const { isAdmin, profile, signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container-premium py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl space-y-6"
        >
          <div className="glass-card p-6 md:p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                <UserRound className="h-7 w-7 text-foreground" />
              </div>
              <div>
                <p className="text-xs font-body uppercase tracking-[0.3em] text-muted-foreground">Minha conta</p>
                <h1 className="text-3xl font-display font-bold text-foreground">
                  {profile?.full_name || profile?.username || user?.email || 'Perfil'}
                </h1>
                <p className="mt-1 text-sm font-body text-muted-foreground">
                  {profile?.username ? `@${profile.username}` : user?.email}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground">Nome completo</p>
                <p className="mt-2 text-sm font-body font-medium text-foreground">
                  {profile?.full_name || 'Nao informado'}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground">Nome de usuario</p>
                <p className="mt-2 text-sm font-body font-medium text-foreground">
                  {profile?.username ? `@${profile.username}` : 'Nao informado'}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4 md:col-span-2">
                <p className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground">Email</p>
                <p className="mt-2 text-sm font-body font-medium text-foreground">
                  {user?.email || profile?.email || 'Nao informado'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm font-body text-foreground">
                <ShieldCheck className="h-4 w-4" />
                {isAdmin ? 'Conta administradora' : 'Conta cliente'}
              </div>
              {isAdmin ? (
                <Link to="/admin" className="btn-premium-outline">
                  Abrir admin
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </div>

          <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-foreground">Sessao</h2>
            <p className="mt-2 text-sm font-body text-muted-foreground">
              Se quiser trocar de conta, saia daqui e entre novamente com outro email.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void signOut()}
                className="btn-premium justify-center sm:w-auto"
              >
                <LogOut className="h-4 w-4" />
                Sair da conta
              </button>
              <Link to="/products" className="btn-premium-outline justify-center sm:w-auto">
                Voltar ao catalogo
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
