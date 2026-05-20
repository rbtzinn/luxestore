import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LogOut, ShieldCheck, UserRound, MapPin, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export default function Profile() {
  const { isAdmin, profile, signOut, user } = useAuth();
  const { t } = useTranslation();

  const [address, setAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zip: '',
    country: 'Brasil'
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = () => {
    // Mock save functionality
    toast.success('Endereço salvo com sucesso!');
  };

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
                  {profile?.full_name || 'Não informado'}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground">Nome de usuário</p>
                <p className="mt-2 text-sm font-body font-medium text-foreground">
                  {profile?.username ? `@${profile.username}` : 'Não informado'}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4 md:col-span-2">
                <p className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground">Email</p>
                <p className="mt-2 text-sm font-body font-medium text-foreground">
                  {user?.email || profile?.email || 'Não informado'}
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
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-foreground" />
              <h2 className="text-xl font-display font-semibold text-foreground">Meu Endereço</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">CEP</label>
                <input type="text" name="zip" value={address.zip} onChange={handleAddressChange} className="input-premium" placeholder="00000-000" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">Logradouro / Rua</label>
                <input type="text" name="street" value={address.street} onChange={handleAddressChange} className="input-premium" placeholder="Ex: Rua das Flores" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">Número</label>
                <input type="text" name="number" value={address.number} onChange={handleAddressChange} className="input-premium" placeholder="123" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">Complemento</label>
                <input type="text" name="complement" value={address.complement} onChange={handleAddressChange} className="input-premium" placeholder="Apto 42" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">Bairro</label>
                <input type="text" name="neighborhood" value={address.neighborhood} onChange={handleAddressChange} className="input-premium" placeholder="Centro" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">Cidade</label>
                <input type="text" name="city" value={address.city} onChange={handleAddressChange} className="input-premium" placeholder="São Paulo" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">Estado</label>
                <input type="text" name="state" value={address.state} onChange={handleAddressChange} className="input-premium" placeholder="SP" />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleSaveAddress}
                className="btn-premium"
              >
                <Save className="h-4 w-4" />
                Salvar Endereço
              </button>
            </div>
          </div>

          <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-foreground">Sessão</h2>
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
                Voltar ao catálogo
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
