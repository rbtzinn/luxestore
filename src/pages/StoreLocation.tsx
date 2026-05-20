import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const storeImage =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=80';

export default function StoreLocation() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative min-h-[76vh] overflow-hidden">
        <img src={storeImage} alt="Interior da loja Helô Modas" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/82 to-background/10" />
        <div className="container-premium relative flex min-h-[76vh] items-center pt-20">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <p className="mb-4 text-xs font-body font-semibold uppercase tracking-[0.28em] text-muted-foreground">Loja física</p>
            <h1 className="font-display text-5xl font-bold leading-tight text-foreground md:text-7xl">Helô Modas Jardins</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Uma loja conceito fictícia com curadoria premium, atendimento reservado e peças selecionadas para experimentar com calma.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/categories" className="btn-premium">
                <ShoppingBag className="h-4 w-4" />
                Ver categorias
              </Link>
              <a href="#visit" className="btn-premium-outline">
                Planejar visita
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="visit" className="py-16 md:py-24">
        <div className="container-premium grid gap-4 md:grid-cols-3">
          {[
            { icon: MapPin, label: 'Endereço', value: 'Rua Oscar Freire, 928 - Jardins, São Paulo' },
            { icon: Clock, label: 'Horário', value: 'Segunda a sábado, 10h às 20h' },
            { icon: Phone, label: 'Atendimento', value: '(11) 4002-2026' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-border/60 bg-card/80 p-6 shadow-premium-sm">
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mb-2 text-xs font-body font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
              <p className="text-sm font-body leading-relaxed text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
