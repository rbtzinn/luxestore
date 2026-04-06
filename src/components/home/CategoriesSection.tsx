import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mockCategories } from '@/data/mockData';
import { useCategories } from '@/hooks/useCatalog';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function CategoriesSection() {
  const { data: categoriesData = [], isLoading } = useCategories();
  const categories = categoriesData.length ? categoriesData.slice(0, 6) : mockCategories;
  const { t } = useTranslation();

  return (
    <section className="premium-section bg-background">
      <div className="container-premium">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-xs font-body tracking-[0.4em] uppercase text-muted-foreground mb-3">{t('home.categoriesEyebrow')}</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">{t('home.categoriesTitle')}</h2>
          <p className="text-sm font-body text-muted-foreground mt-4">{isLoading ? t('common.loadingCategories') : t('home.categoriesApi')}</p>
        </motion.div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={item}>
              <Link to={`/products?category=${cat.slug}`} className="group relative aspect-[4/5] md:aspect-[3/4] rounded-xl overflow-hidden block">
                <img src={cat.image_url || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=900&q=80'} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-primary-foreground mb-1">{cat.name}</h3>
                  <p className="text-xs font-body text-primary-foreground/70">{cat.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
