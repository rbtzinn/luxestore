import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, LogOut, MapPin, Save, ShieldCheck, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/AuthContext';

function normalizeUsername(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 24);
}

export default function Profile() {
  const { isAdmin, profile, signOut, updateProfile, user } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zip: '',
    country: 'Brasil',
  });

  useEffect(() => {
    setFullName(profile?.full_name || '');
    setUsername(profile?.username || '');
  }, [profile?.full_name, profile?.username]);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddress((current) => ({ ...current, [name]: value }));
  };

  const handleSaveAddress = () => {
    toast.success('Endereco salvo com sucesso!');
  };

  const handleSaveProfile = async () => {
    const nextFullName = fullName.trim();
    const nextUsername = normalizeUsername(username);

    if (!nextFullName) {
      toast.error('Informe seu nome completo.');
      return;
    }

    if (nextUsername.length < 3) {
      toast.error('O usuario precisa ter pelo menos 3 caracteres.');
      return;
    }

    setIsSavingProfile(true);

    try {
      const { error } = await updateProfile({
        fullName: nextFullName,
        username: nextUsername,
      });

      if (error) {
        toast.error(error);
        return;
      }

      setUsername(nextUsername);
      toast.success('Perfil atualizado com sucesso!');
    } finally {
      setIsSavingProfile(false);
    }
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
              <div className="space-y-2">
                <label className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground">Nome completo</label>
                <input
                  type="text"
                  className="input-premium"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground">Nome de usuario</label>
                <input
                  type="text"
                  className="input-premium"
                  value={username}
                  onChange={(event) => setUsername(normalizeUsername(event.target.value))}
                  placeholder="seu_usuario"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4 md:col-span-2">
                <p className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground">Email</p>
                <p className="mt-2 text-sm font-body font-medium text-foreground">
                  {user?.email || profile?.email || 'Nao informado'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void handleSaveProfile()}
                disabled={isSavingProfile}
                className="btn-premium justify-center sm:w-auto"
              >
                <Save className="h-4 w-4" />
                {isSavingProfile ? 'Salvando...' : 'Salvar perfil'}
              </button>
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
            <div className="mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-foreground" />
              <h2 className="text-xl font-display font-semibold text-foreground">Meu endereco</h2>
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
                <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">Numero</label>
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
                <input type="text" name="city" value={address.city} onChange={handleAddressChange} className="input-premium" placeholder="Sao Paulo" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">Estado</label>
                <input type="text" name="state" value={address.state} onChange={handleAddressChange} className="input-premium" placeholder="SP" />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={handleSaveAddress} className="btn-premium-outline justify-center sm:w-auto">
                <Save className="h-4 w-4" />
                Salvar endereco
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button type="button" className="btn-premium justify-center sm:w-auto">
                    <LogOut className="h-4 w-4" />
                    Sair da conta
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza que deseja sair?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Sua sessao sera encerrada e voce precisara fazer login novamente para acessar sua conta.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void signOut()}>Sair</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
