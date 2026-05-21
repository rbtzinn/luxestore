import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, LogOut, MapPin, Save, ShieldCheck, UserRound, Package, User } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/AuthContext';
import type { BackendAddress } from '@/lib/backendAuth';
import { cn } from '@/lib/utils';

const emptyAddress: BackendAddress = {
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zip: '',
  country: 'Brasil',
};

function normalizeUsername(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 24);
}

type TabType = 'personal' | 'address' | 'orders';

export default function Profile() {
  const { isAdmin, profile, signOut, updateProfile, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [address, setAddress] = useState<BackendAddress>(profile?.address || emptyAddress);

  useEffect(() => {
    setFullName(profile?.full_name || '');
    setUsername(profile?.username || '');
    setAddress(profile?.address || emptyAddress);
  }, [profile?.address, profile?.full_name, profile?.username]);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddress((current) => ({ ...current, [name]: value }));
  };

  const handleSaveAddress = async () => {
    setIsSavingAddress(true);
    try {
      const { error } = await updateProfile({ address });
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Endereço salvo com sucesso!');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleSaveProfile = async () => {
    const nextFullName = fullName.trim();
    const nextUsername = normalizeUsername(username);

    if (!nextFullName) {
      toast.error('Informe seu nome completo.');
      return;
    }

    if (nextUsername.length < 3) {
      toast.error('O usuário precisa ter pelo menos 3 caracteres.');
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

  const renderPersonalTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-xl font-display font-semibold text-foreground">Meus Dados</h2>
        <p className="mt-1 text-sm font-body text-muted-foreground">Gerencie suas informações pessoais e credenciais.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground">Nome completo</label>
          <input
            type="text"
            className="input-premium bg-background/50"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Seu nome completo"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground">Nome de usuário</label>
          <input
            type="text"
            className="input-premium bg-background/50"
            value={username}
            onChange={(event) => setUsername(normalizeUsername(event.target.value))}
            placeholder="seu_usuario"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
        <div className="rounded-xl border border-border/70 bg-background/50 p-4 md:col-span-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground">Email</p>
            <p className="mt-1 text-sm font-body font-medium text-foreground">
              {user?.email || profile?.email || 'Não informado'}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-body text-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            {isAdmin ? 'Admin' : 'Cliente'}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border/50">
        <button
          type="button"
          onClick={() => void handleSaveProfile()}
          disabled={isSavingProfile}
          className="btn-premium justify-center w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {isSavingProfile ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </motion.div>
  );

  const renderAddressTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-xl font-display font-semibold text-foreground">Meu Endereço</h2>
        <p className="mt-1 text-sm font-body text-muted-foreground">Onde você deseja receber suas compras da Helô Modas.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="space-y-2 md:col-span-4">
          <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">CEP</label>
          <input type="text" name="zip" value={address.zip} onChange={handleAddressChange} className="input-premium bg-background/50" placeholder="00000-000" />
        </div>
        <div className="space-y-2 md:col-span-8">
          <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">Rua / Logradouro</label>
          <input type="text" name="street" value={address.street} onChange={handleAddressChange} className="input-premium bg-background/50" placeholder="Ex: Rua das Flores" />
        </div>
        
        <div className="space-y-2 md:col-span-4">
          <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">Número</label>
          <input type="text" name="number" value={address.number} onChange={handleAddressChange} className="input-premium bg-background/50" placeholder="123" />
        </div>
        <div className="space-y-2 md:col-span-8">
          <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">Complemento <span className="text-muted-foreground/50 lowercase text-[10px]">(Opcional)</span></label>
          <input type="text" name="complement" value={address.complement} onChange={handleAddressChange} className="input-premium bg-background/50" placeholder="Apto 42" />
        </div>

        <div className="space-y-2 md:col-span-5">
          <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">Bairro</label>
          <input type="text" name="neighborhood" value={address.neighborhood} onChange={handleAddressChange} className="input-premium bg-background/50" placeholder="Centro" />
        </div>
        <div className="space-y-2 md:col-span-5">
          <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">Cidade</label>
          <input type="text" name="city" value={address.city} onChange={handleAddressChange} className="input-premium bg-background/50" placeholder="São Paulo" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-body uppercase tracking-[0.1em] text-muted-foreground">Estado</label>
          <input type="text" name="state" value={address.state} onChange={handleAddressChange} className="input-premium bg-background/50" placeholder="SP" />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border/50">
        <button type="button" onClick={() => void handleSaveAddress()} disabled={isSavingAddress} className="btn-premium justify-center w-full sm:w-auto">
          <Save className="h-4 w-4" />
          {isSavingAddress ? 'Salvando...' : 'Salvar endereço'}
        </button>
      </div>
    </motion.div>
  );

  const renderOrdersTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8 flex flex-col h-full"
    >
      <div>
        <h2 className="text-xl font-display font-semibold text-foreground">Meus Pedidos</h2>
        <p className="mt-1 text-sm font-body text-muted-foreground">Histórico de compras e acompanhamento de entregas.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4 rounded-xl border border-dashed border-border bg-background/30">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-6">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-display font-medium text-foreground mb-2">Nenhum pedido recente</h3>
        <p className="text-sm font-body text-muted-foreground max-w-sm mb-8">
          Você ainda não realizou nenhuma compra. Explore nossa coleção e encontre peças exclusivas.
        </p>
        <Link to="/products" className="btn-premium">
          Explorar Catálogo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container-premium max-w-6xl mx-auto">
        
        {/* Header Profile Summary (Mobile + Desktop) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-border/50 pb-10 text-center sm:text-left"
        >
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-secondary/80 shadow-sm border border-border">
            <UserRound className="h-10 w-10 text-foreground" />
          </div>
          <div className="flex-1 space-y-1 mt-2">
            <p className="text-xs font-body uppercase tracking-[0.3em] text-muted-foreground">Sua Conta</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              {profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'Perfil'}
            </h1>
            <p className="text-sm font-body text-muted-foreground pt-1">
              {user?.email}
            </p>
          </div>
          {isAdmin && (
             <div className="mt-4 sm:mt-2">
                <Link to="/admin" className="btn-premium-outline shrink-0">
                  Acessar Admin
                  <ArrowRight className="h-4 w-4" />
                </Link>
             </div>
          )}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-64 shrink-0"
          >
            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide lg:sticky lg:top-24">
              <button
                onClick={() => setActiveTab('personal')}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium transition-all duration-300 whitespace-nowrap lg:whitespace-normal text-left",
                  activeTab === 'personal' 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <User className="h-4 w-4" />
                Meus Dados
              </button>
              
              <button
                onClick={() => setActiveTab('address')}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium transition-all duration-300 whitespace-nowrap lg:whitespace-normal text-left",
                  activeTab === 'address' 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <MapPin className="h-4 w-4" />
                Endereço
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium transition-all duration-300 whitespace-nowrap lg:whitespace-normal text-left",
                  activeTab === 'orders' 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <Package className="h-4 w-4" />
                Meus Pedidos
              </button>

              <div className="hidden lg:block h-px w-full bg-border/50 my-4" />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all duration-300 whitespace-nowrap lg:whitespace-normal text-left mt-auto lg:mt-0">
                    <LogOut className="h-4 w-4" />
                    Sair da conta
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza que deseja sair?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Sua sessão será encerrada e você precisará fazer login novamente para acessar seus dados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void signOut()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Sair</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </nav>
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 min-w-0"
          >
            <div className="glass-card p-6 sm:p-8 lg:p-10 min-h-[500px]">
              <AnimatePresence mode="wait">
                {activeTab === 'personal' && <div key="personal">{renderPersonalTab()}</div>}
                {activeTab === 'address' && <div key="address">{renderAddressTab()}</div>}
                {activeTab === 'orders' && <div key="orders">{renderOrdersTab()}</div>}
              </AnimatePresence>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
