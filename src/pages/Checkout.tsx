import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/locale';

type Step = 'address' | 'payment' | 'review' | 'complete';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const [step, setStep] = useState<Step>('address');
  const [address, setAddress] = useState({
    street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip: '', country: 'BR',
  });
  const [payment, setPayment] = useState('credit_card');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  if (items.length === 0 && step !== 'complete') {
    navigate('/cart');
    return null;
  }

  const subtotal = getTotal();
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal - discount + shipping;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'WELCOME10') setDiscount(subtotal * 0.1);
  };

  const placeOrder = () => {
    clearCart();
    setStep('complete');
  };

  if (step === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md px-4">
          <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">{t('checkoutPage.confirmed')}</h1>
          <p className="text-sm font-body text-muted-foreground mb-2">{t('checkoutPage.orderNumber')} #ORD-{Date.now().toString().slice(-6)}</p>
          <p className="text-sm font-body text-muted-foreground mb-8">{t('checkoutPage.confirmationEmail')}</p>
          <Link to="/products" className="btn-premium">{t('common.continueShopping')} <ArrowRight className="w-4 h-4" /></Link>
        </motion.div>
      </div>
    );
  }

  const steps = [
    { key: 'address', label: t('checkoutPage.address') },
    { key: 'payment', label: t('checkoutPage.payment') },
    { key: 'review', label: t('checkoutPage.review') },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="container-premium py-12 max-w-4xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">{t('checkoutPage.title')}</h1>

        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-1">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-semibold transition-colors ${
                step === s.key ? 'bg-primary text-primary-foreground' : steps.findIndex((x) => x.key === step) > i ? 'bg-success text-success-foreground' : 'bg-secondary text-secondary-foreground'
              }`}>
                {steps.findIndex((x) => x.key === step) > i ? '✓' : i + 1}
              </div>
              <span className="text-xs font-body text-muted-foreground hidden sm:inline">{s.label}</span>
              {i < steps.length - 1 && <div className="w-8 md:w-16 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 'address' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="text-lg font-display font-semibold text-foreground mb-4">{t('checkoutPage.shippingAddress')}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder={t('checkoutPage.street')} className="input-premium col-span-2" />
                  <input value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} placeholder={t('checkoutPage.number')} className="input-premium" />
                  <input value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} placeholder={t('checkoutPage.complement')} className="input-premium" />
                  <input value={address.neighborhood} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })} placeholder={t('checkoutPage.neighborhood')} className="input-premium" />
                  <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder={t('checkoutPage.city')} className="input-premium" />
                  <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder={t('checkoutPage.state')} className="input-premium" />
                  <input value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} placeholder={t('checkoutPage.zip')} className="input-premium" />
                </div>
                <button onClick={() => setStep('payment')} className="btn-premium mt-6">
                  {t('checkoutPage.continueToPayment')} <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="text-lg font-display font-semibold text-foreground mb-4">{t('checkoutPage.paymentMethod')}</h2>
                {['credit_card', 'pix', 'boleto'].map((method) => (
                  <label key={method} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${payment === method ? 'border-foreground bg-secondary/50' : 'border-border'}`}>
                    <input type="radio" name="payment" value={method} checked={payment === method} onChange={() => setPayment(method)} className="sr-only" />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${payment === method ? 'border-foreground' : 'border-muted-foreground'}`}>
                      {payment === method && <div className="w-2 h-2 rounded-full bg-foreground" />}
                    </div>
                    <span className="text-sm font-body font-medium text-foreground capitalize">
                      {method === 'credit_card' ? t('checkoutPage.creditCard') : method === 'pix' ? 'PIX' : 'Boleto'}
                    </span>
                  </label>
                ))}
                {payment === 'credit_card' && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input placeholder={t('checkoutPage.cardNumber')} className="input-premium col-span-2" />
                    <input placeholder={t('checkoutPage.expiry')} className="input-premium" />
                    <input placeholder={t('checkoutPage.cvv')} className="input-premium" />
                    <input placeholder={t('checkoutPage.cardholder')} className="input-premium col-span-2" />
                  </div>
                )}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep('address')} className="btn-premium-outline">{t('common.back')}</button>
                  <button onClick={() => setStep('review')} className="btn-premium">
                    {t('checkoutPage.reviewOrder')} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'review' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-lg font-display font-semibold text-foreground mb-4">{t('checkoutPage.yourOrder')}</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-3 border-b border-border/50">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary">
                        <img src={item.product?.images[0]?.url} alt={item.product?.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-body font-medium text-foreground">{item.product?.title}</p>
                        <p className="text-xs font-body text-muted-foreground">{t('checkoutPage.qty')}: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-body font-semibold text-foreground">{formatCurrency(item.price * item.quantity, language)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('payment')} className="btn-premium-outline">{t('common.back')}</button>
                  <button onClick={placeOrder} className="btn-premium">
                    {t('checkoutPage.placeOrder')} — {formatCurrency(total, language)}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="glass-card p-6 h-fit sticky top-24">
            <h3 className="text-sm font-display font-semibold text-foreground mb-4">{t('checkoutPage.summary')}</h3>
            <div className="space-y-2 text-sm font-body">
              <div className="flex justify-between"><span className="text-muted-foreground">{t('common.subtotal')}</span><span>{formatCurrency(subtotal, language)}</span></div>
              {discount > 0 && <div className="flex justify-between"><span className="text-success">{t('checkoutPage.discount')}</span><span className="text-success">-{formatCurrency(discount, language)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">{t('common.shipping')}</span><span>{shipping === 0 ? t('common.free') : formatCurrency(shipping, language)}</span></div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold"><span>{t('common.total')}</span><span>{formatCurrency(total, language)}</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder={t('checkoutPage.couponCode')} className="input-premium text-xs flex-1" />
              <button onClick={applyCoupon} className="btn-premium-outline text-xs px-3">{t('checkoutPage.apply')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
