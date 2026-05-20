import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function normalizeUsername(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 24);
}

export default function Auth() {
  const { enabled, isAuthenticated, signInWithPassword, signUpWithPassword } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isSignup = mode === 'signup';

  const resetSensitiveFields = () => {
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchMode = (nextMode: 'signin' | 'signup') => {
    setMode(nextMode);
    resetSensitiveFields();
    setFeedback(null);
  };

  const handleCredentialSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
    const trimmedFullName = fullName.trim();
    const normalizedUsername = normalizeUsername(username.trim());

    if (!normalizedEmail || !trimmedPassword) {
      setFeedback('Preencha email e senha para continuar.');
      return;
    }

    if (!normalizedEmail.includes('@')) {
      setFeedback('Digite um email valido.');
      return;
    }

    if (trimmedPassword.length < 6) {
      setFeedback('Use uma senha com pelo menos 6 caracteres.');
      return;
    }

    if (isSignup) {
      if (!trimmedFullName) {
        setFeedback('Informe seu nome completo.');
        return;
      }

      if (normalizedUsername.length < 3) {
        setFeedback('Escolha um nome de usuario com pelo menos 3 caracteres.');
        return;
      }

      if (trimmedPassword !== trimmedConfirmPassword) {
        setFeedback('As senhas nao conferem.');
        return;
      }
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      if (isSignup) {
        const { error } = await signUpWithPassword({
          email: normalizedEmail,
          password: trimmedPassword,
          fullName: trimmedFullName,
          username: normalizedUsername,
        });

        setFeedback(error ?? 'Conta criada com sucesso.');
        return;
      }

      const { error } = await signInWithPassword(normalizedEmail, trimmedPassword);
      setFeedback(error ?? 'Login realizado com sucesso.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (enabled && isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full max-w-lg p-8 md:p-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
          <ShieldCheck className="h-7 w-7 text-foreground" />
        </div>

        <p className="mb-3 text-xs font-body uppercase tracking-[0.35em] text-muted-foreground">
          {isSignup ? 'Criar conta' : 'Entrar'}
        </p>
        <h1 className="mb-3 text-3xl font-display font-bold text-foreground md:text-4xl">
          {isSignup ? 'Crie sua conta' : 'Acesse sua conta'}
        </h1>
        <p className="mb-8 text-sm font-body leading-relaxed text-muted-foreground md:text-base">
          {isSignup
            ? 'Cadastre nome, usuario, email e senha para criar sua conta com autenticacao real.'
            : 'Entre com seu email e senha para acessar o projeto.'}
        </p>

        {enabled ? (
          <div className="space-y-4">
            <div className="grid gap-3">
              {isSignup ? (
                <>
                  <input
                    type="text"
                    className="input-premium"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    autoComplete="name"
                  />
                  <input
                    type="text"
                    className="input-premium"
                    placeholder="Nome de usuario"
                    value={username}
                    onChange={(event) => setUsername(normalizeUsername(event.target.value))}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </>
              ) : null}

              <input
                type="email"
                className="input-premium"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete={isSignup ? 'email' : 'username'}
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-premium pr-12"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {isSignup ? (
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="input-premium pr-12"
                    placeholder="Repita sua senha"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showConfirmPassword ? 'Ocultar confirmacao de senha' : 'Mostrar confirmacao de senha'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              className="btn-premium w-full justify-center"
              onClick={() => void handleCredentialSubmit()}
              disabled={
                isSubmitting ||
                !email.trim() ||
                !password.trim() ||
                (isSignup && (!fullName.trim() || !username.trim() || !confirmPassword.trim()))
              }
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isSignup ? 'Criar conta' : 'Entrar'}
            </button>

            <p className="text-center text-sm font-body text-muted-foreground">
              {isSignup ? 'Ja tem conta?' : 'Ainda nao tem conta?'}{' '}
              <button
                type="button"
                onClick={() => switchMode(isSignup ? 'signin' : 'signup')}
                className="font-medium text-foreground underline underline-offset-4"
              >
                {isSignup ? 'Entrar' : 'Criar conta'}
              </button>
            </p>

            {feedback ? <p className="text-sm font-body text-muted-foreground">{feedback}</p> : null}

            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao catalogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-body text-muted-foreground">
              O backend ainda nao foi configurado neste ambiente. Preencha VITE_BACKEND_API_URL para ativar cadastro e login reais.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao catalogo
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
