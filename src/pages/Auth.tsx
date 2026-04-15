import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Loader2, MailCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type AuthStep = 'credentials' | 'verify';

function normalizeUsername(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 24);
}

export default function Auth() {
  const { enabled, isAuthenticated, resendSignupOtp, signInWithPassword, signUpWithPassword, verifyEmailOtp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<AuthStep>('credentials');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isSignup = mode === 'signup';

  const resetSensitiveFields = () => {
    setPassword('');
    setConfirmPassword('');
    setOtpCode('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchMode = (nextMode: 'signin' | 'signup') => {
    setMode(nextMode);
    setStep('credentials');
    resetSensitiveFields();
    setResendCooldown(0);
    setFeedback(null);
  };

  useEffect(() => {
    if (resendCooldown <= 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [resendCooldown]);

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

        if (error) {
          setFeedback(error);
          return;
        }

        setEmail(normalizedEmail);
        setUsername(normalizedUsername);
        setStep('verify');
        setOtpCode('');
        setFeedback('Conta criada. Agora confirme o codigo enviado para o seu email.');
        return;
      }

      const { error } = await signInWithPassword(normalizedEmail, trimmedPassword);
      setFeedback(error ?? 'Login realizado com sucesso.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = otpCode.trim().replace(/\s+/g, '');

    if (!normalizedEmail || !normalizedCode) {
      setFeedback('Preencha o codigo recebido no email.');
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const { error } = await verifyEmailOtp(normalizedEmail, normalizedCode);

      if (error) {
        setFeedback(`Nao foi possivel confirmar o codigo. ${error}`);
        return;
      }

      setFeedback('Email confirmado com sucesso. Se voce nao for redirecionado automaticamente, entre com sua senha.');
      setStep('credentials');
      setMode('signin');
      setOtpCode('');
      setPassword('');
      setConfirmPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setFeedback('Informe o email para reenviar o codigo.');
      return;
    }

    setIsResendingCode(true);
    setFeedback(null);

    try {
      const { error } = await resendSignupOtp(normalizedEmail);
      if (error) {
        setFeedback(error);
        return;
      }

      setResendCooldown(60);
      setFeedback('Enviamos um novo codigo para o seu email.');
    } finally {
      setIsResendingCode(false);
    }
  };

  if (enabled && isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full max-w-lg p-8 md:p-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
          {step === 'verify' ? <MailCheck className="h-7 w-7 text-foreground" /> : <ShieldCheck className="h-7 w-7 text-foreground" />}
        </div>

        <p className="mb-3 text-xs font-body uppercase tracking-[0.35em] text-muted-foreground">
          {step === 'verify' ? 'Confirmar email' : isSignup ? 'Criar conta' : 'Entrar'}
        </p>
        <h1 className="mb-3 text-3xl font-display font-bold text-foreground md:text-4xl">
          {step === 'verify' ? 'Digite o codigo recebido' : isSignup ? 'Crie sua conta' : 'Acesse sua conta'}
        </h1>
        <p className="mb-8 text-sm font-body leading-relaxed text-muted-foreground md:text-base">
          {step === 'verify'
            ? 'Enviamos um codigo para o seu email. Digite-o abaixo para confirmar e liberar o acesso.'
            : isSignup
              ? 'Cadastre nome, usuario, email e senha para criar sua conta com autenticacao real.'
              : 'Entre com seu email e senha para acessar o projeto.'}
        </p>

        {enabled ? (
          <div className="space-y-4">
            {step === 'verify' ? (
              <>
                <div className="grid gap-3">
                  <input
                    type="email"
                    className="input-premium"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                  />
                  <input
                    type="text"
                    inputMode="text"
                    className="input-premium tracking-[0.35em]"
                    placeholder="codigo recebido"
                    value={otpCode}
                    onChange={(event) => setOtpCode(event.target.value.replace(/\s+/g, '').slice(0, 12))}
                    autoComplete="one-time-code"
                    autoCapitalize="none"
                    spellCheck={false}
                    maxLength={12}
                  />
                  <p className="text-xs font-body text-muted-foreground">
                    Se o email chegar com link em vez de codigo, ajuste o template do Supabase para usar o token do email.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-premium w-full justify-center"
                  onClick={() => void handleVerifyCode()}
                  disabled={isSubmitting || !email.trim() || otpCode.trim().replace(/\s+/g, '').length < 6}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Confirmar codigo
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    className="btn-premium-outline flex-1 justify-center"
                    onClick={() => void handleResendCode()}
                    disabled={isResendingCode || resendCooldown > 0 || !email.trim()}
                  >
                    {isResendingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {isResendingCode ? 'Enviando...' : resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar codigo'}
                  </button>
                  <button
                    type="button"
                    className="btn-premium-outline flex-1 justify-center"
                    onClick={() => {
                      setStep('credentials');
                      setFeedback(null);
                    }}
                  >
                    Voltar
                  </button>
                </div>
              </>
            ) : (
              <>
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

                {!isSignup ? (
                  <p className="text-center text-sm font-body text-muted-foreground">
                    Ja criou a conta e precisa confirmar o email?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setStep('verify');
                        setFeedback(null);
                      }}
                      className="font-medium text-foreground underline underline-offset-4"
                    >
                      Digitar codigo
                    </button>
                  </p>
                ) : null}
              </>
            )}

            {feedback ? <p className="text-sm font-body text-muted-foreground">{feedback}</p> : null}

            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao catalogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-body text-muted-foreground">
              O Supabase ainda nao foi configurado neste ambiente. Preencha as variaveis para ativar cadastro e login reais.
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
